"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: number | string;
  name: string;
  email: string;
  [key: string]: any;
}

interface LoginResult {
  success: boolean;
  message?: string;
  admin?: AdminUser;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Client-side logout mechanism
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    } catch {
      // ignore storage access issues
    }
    setToken(null);
    setAdmin(null);
    router.push("/admin/login");
  }, [router]);

  // Session verification on page reload
  useEffect(() => {
    const verifyStoredSession = async () => {
      let storedToken: string | null = null;
      try {
        storedToken = localStorage.getItem("admin_token");
      } catch {
        storedToken = null;
      }

      if (!storedToken) {
        setToken(null);
        setAdmin(null);
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/admin/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          // Support direct admin object or nested response
          const adminProfile: AdminUser =
            userData?.admin || userData?.data || userData;
          setAdmin(adminProfile);
          try {
            localStorage.setItem("admin_user", JSON.stringify(adminProfile));
          } catch {
            // ignore
          }
        } else {
          // Token is invalid or expired (e.g. 401 Unauthorized)
          try {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
          } catch {
            // ignore
          }
          setToken(null);
          setAdmin(null);
        }
      } catch (error) {
        console.error("Admin session verification failed:", error);
        // On network error or failure, clear invalid state
        try {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
        } catch {
          // ignore
        }
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyStoredSession();
  }, []);

  // Login handler
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || (data && data.success === false)) {
        const errorMessage =
          data?.message ||
          data?.error ||
          (response.status === 401
            ? "Invalid credentials"
            : "Login failed. Please check your credentials.");
        return { success: false, message: errorMessage };
      }

      const receivedToken =
        data?.token || data?.access_token || data?.data?.token || "";
      const adminData: AdminUser =
        data?.admin || data?.data?.admin || data?.user || null;

      if (!receivedToken) {
        return {
          success: false,
          message: "No authentication token received from server.",
        };
      }

      // Save token and state
      try {
        localStorage.setItem("admin_token", receivedToken);
        if (adminData) {
          localStorage.setItem("admin_user", JSON.stringify(adminData));
        }
      } catch {
        // ignore
      }

      setToken(receivedToken);
      setAdmin(adminData);

      return {
        success: true,
        message: data?.message || "Login successful!",
        admin: adminData,
      };
    } catch (err: any) {
      console.error("Admin login error:", err);
      return {
        success: false,
        message:
          err?.message ||
          "Unable to connect to the authentication server. Please check your network.",
      };
    }
  };

  // Wrapper around fetch to automatically include Bearer token & handle 401
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers || {});
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
      }

      return response;
    },
    [token, logout]
  );

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
        authFetch,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
