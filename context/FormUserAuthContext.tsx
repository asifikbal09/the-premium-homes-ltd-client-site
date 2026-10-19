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

export interface FormUser {
  id: number | string;
  name: string;
  email: string;
  [key: string]: any;
}

interface LoginResult {
  success: boolean;
  message?: string;
  user?: FormUser;
}

interface FormUserAuthContextType {
  user: FormUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  checkUser: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const FormUserAuthContext = createContext<FormUserAuthContextType | undefined>(
  undefined
);

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");
};

export function FormUserAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<FormUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Client-side logout mechanism
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("formUserToken");
      localStorage.removeItem("formUser");
    } catch {
      // ignore storage access issues
    }
    setToken(null);
    setUser(null);
    router.push("/tphl-forms/login");
  }, [router]);

  // Session verification on page reload or verification call
  const checkUser = useCallback(async () => {
    let storedToken: string | null = null;
    try {
      storedToken = localStorage.getItem("formUserToken");
    } catch {
      storedToken = null;
    }

    if (!storedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setToken(storedToken);

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/tphl-forms/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userProfile: FormUser = data?.user || data?.data || data;
        setUser(userProfile);
        try {
          localStorage.setItem("formUser", JSON.stringify(userProfile));
        } catch {
          // ignore
        }
      } else {
        // Token is expired or invalid (e.g. 401 Unauthorized)
        try {
          localStorage.removeItem("formUserToken");
          localStorage.removeItem("formUser");
        } catch {
          // ignore
        }
        setToken(null);
        setUser(null);
        router.push("/tphl-forms/login");
      }
    } catch (error) {
      console.error("TPHL Form user session check failed:", error);
      try {
        localStorage.removeItem("formUserToken");
        localStorage.removeItem("formUser");
      } catch {
        // ignore
      }
      setToken(null);
      setUser(null);
      router.push("/tphl-forms/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Login handler
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/tphl-forms/login`, {
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
            ? "Invalid email or password."
            : "Login failed. Please check your credentials.");
        return { success: false, message: errorMessage };
      }

      const receivedToken =
        data?.token || data?.access_token || data?.data?.token || "";
      const userData: FormUser =
        data?.user || data?.data?.user || data?.data || null;

      if (!receivedToken) {
        return {
          success: false,
          message: "No authentication token received from server.",
        };
      }

      // Save token and state
      try {
        localStorage.setItem("formUserToken", receivedToken);
        if (userData) {
          localStorage.setItem("formUser", JSON.stringify(userData));
        }
      } catch {
        // ignore
      }

      setToken(receivedToken);
      setUser(userData);

      return {
        success: true,
        message: data?.message || "Login successful!",
        user: userData,
      };
    } catch (err: any) {
      console.error("TPHL Form login error:", err);
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
    <FormUserAuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        checkUser,
        authFetch,
      }}
    >
      {children}
    </FormUserAuthContext.Provider>
  );
}

export function useFormUserAuth() {
  const context = useContext(FormUserAuthContext);
  if (!context) {
    throw new Error(
      "useFormUserAuth must be used within a FormUserAuthProvider"
    );
  }
  return context;
}
