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

export function clearClientSession() {
  try {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore storage access issues
  }
}
