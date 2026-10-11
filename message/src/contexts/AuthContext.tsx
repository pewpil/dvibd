"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SessionPayload } from "../server/session";

interface AuthContextValue {
  loggedIn: boolean;
  pending: boolean;
  user: SessionPayload["user"] | null;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

export interface SignupInput {
  displayName: string;
  username: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function requestAuth(
  path: string,
  body?: Record<string, string>,
): Promise<void> {
  const init: RequestInit = { method: "POST" };
  if (body !== undefined) {
    init.headers = { "content-type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const response: Response = await fetch(path, init);
  if (!response.ok) {
    let message: string = "Something went wrong.";
    try {
      const data: unknown = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error: unknown }).error === "string"
      ) {
        message = (data as { error: string }).error;
      }
    } catch {
      message = "Something went wrong.";
    }
    throw new Error(message);
  }
}

export function AuthProvider(props: { children: ReactNode }): ReactNode {
  const [user, setUser] = useState<SessionPayload["user"] | null>(null);
  const [pending, setPending] = useState<boolean>(true);

  const refetch = useCallback(async (): Promise<void> => {
    try {
      const response: Response = await fetch("/session", { cache: "no-store" });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data: unknown = await response.json();
      const nextUser: SessionPayload["user"] | null =
        typeof data === "object" && data !== null && "user" in data
          ? ((data as { user: SessionPayload["user"] | null }).user ?? null)
          : null;
      setUser(nextUser);
    } catch {
      setUser(null);
    } finally {
      setPending(false);
    }
  }, []);

  useEffect((): void => {
    void refetch();
  }, [refetch]);

  const login = useCallback(
    async (identifier: string, password: string): Promise<void> => {
      await requestAuth("/login", {
        identifier: identifier,
        password: password,
      });
      await refetch();
    },
    [refetch],
  );

  const signup = useCallback(
    async (input: SignupInput): Promise<void> => {
      await requestAuth("/signup", {
        displayName: input.displayName,
        username: input.username,
        email: input.email,
        password: input.password,
      });
      await refetch();
    },
    [refetch],
  );

  const logout = useCallback(async (): Promise<void> => {
    await requestAuth("/logout");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn: user !== null,
        pending: pending,
        user: user,
        login: login,
        signup: signup,
        logout: logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value: AuthContextValue | null = useContext(AuthContext);
  if (value === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}