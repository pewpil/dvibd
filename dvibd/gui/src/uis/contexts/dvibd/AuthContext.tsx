import {
  createContext,
  createSignal,
  onMount,
  useContext,
  type ParentProps,
} from "solid-js";
import type { User } from "../../../generated/browser.mts";

const SESSION_KEY = "dvibd.session";

export type Session = Omit<
  User,
  "passwordHash" | "refreshTokens" | "createdAt"
> & {
  createdAt: string;
  accessToken: string;
  refreshToken: string;
};

interface AuthContextValue {
  session(): Session | null;
  setSession(session: Session): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue>();

function readStoredSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function AuthProvider(props: ParentProps) {
  const [session, setSessionSignal] = createSignal<Session | null>(
    readStoredSession(),
  );

  const setSession = (next: Session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSessionSignal(next);
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionSignal(null);
  };

  const logout = () => {
    const stored = session();
    if (stored) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: stored.refreshToken }),
      }).catch(() => {});
    }
    clearSession();
  };

  onMount(() => {
    const stored = session();
    if (!stored) {
      return;
    }

    const restore = async () => {
      const me = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${stored.accessToken}` },
      });
      if (me.ok) {
        return;
      }

      const refreshed = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: stored.refreshToken }),
      });
      if (!refreshed.ok) {
        clearSession();
        return;
      }

      const body = (await refreshed.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      setSession({
        ...stored,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
      });
    };

    restore().catch(() => clearSession());
  });

  return (
    <AuthContext.Provider value={{ session, setSession, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}

export { AuthProvider, useAuth };
