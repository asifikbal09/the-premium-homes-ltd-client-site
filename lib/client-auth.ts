// Every key the client login has stored over time; all are cleared on logout.
const SESSION_KEYS = [
  "tphl_auth_token",
  "token",
  "tphl_user_id",
  "user_id",
  "tphl_user",
  "user",
  "tphl_auth_data",
];

/** True when a client (property owner) session is stored in this browser. */
export function hasClientSession(): boolean {
  try {
    return Boolean(
      localStorage.getItem("tphl_auth_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("tphl_user") ||
        localStorage.getItem("user"),
    );
  } catch {
    return false;
  }
}

/** Reads the logged-in client's user ID from browser storage, or null when logged out. */
export function getClientUserId(): string | null {
  try {
    const direct =
      localStorage.getItem("tphl_user_id") || localStorage.getItem("user_id");
    if (direct && direct.trim()) return direct.trim();

    const rawUser =
      localStorage.getItem("tphl_user") || localStorage.getItem("user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const id = parsed?.id ?? parsed?.user_id;
      if (id !== undefined && id !== null && String(id).trim()) {
        return String(id).trim();
      }
    }

    const rawAuth = localStorage.getItem("tphl_auth_data");
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth);
      const id =
        parsed?.user?.id ??
        parsed?.data?.user?.id ??
        parsed?.user_id ??
        parsed?.id ??
        parsed?.data?.id;
      if (id !== undefined && id !== null && String(id).trim()) {
        return String(id).trim();
      }
    }
  } catch {
    // ignore storage access issues
  }
  return null;
}

/** Reads the logged-in client's auth token if present. */
export function getClientToken(): string | null {
  try {
    return (
      localStorage.getItem("tphl_auth_token") ||
      localStorage.getItem("token") ||
      null
    );
  } catch {
    return null;
  }
}

export function clearClientSession() {
  try {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore storage access issues
  }
}
