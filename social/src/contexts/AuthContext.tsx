import {
  createContext,
  createResource,
  useContext,
  type ParentProps,
} from "solid-js";
import { fetchSession } from "../server/auth";
import type { SessionPayload } from "../server/session";

export interface SignupInput {
  displayName: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  loggedIn(): boolean | undefined;
  login(identifier: string, password: string): Promise<void>;
  signup(input: SignupInput): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue>();

async function requestAuth(path: string, body?: Record<string, string>): Promise<void> {
  const init: RequestInit = { method: "POST" };
  if (body !== undefined) {
    init.headers = { "content-type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const response: Response = await fetch(path, init);
  if (!response.ok) {
    let message: string = "Something went wrong.";
    try {
      const data = (await response.json()) as { error?: string };
      if (typeof data.error === "string") {
        message = data.error;
      }
    } catch {
      message = "Something went wrong.";
    }
    throw new Error(message);
  }
}

function AuthProvider(props: ParentProps) {
  const [session, { refetch }] = createResource<SessionPayload | null>(() =>
    fetchSession(),
  );

  const loggedIn = (): boolean | undefined => {
    const value: SessionPayload | null | undefined = session();
    if (value === undefined) {
      return undefined;
    }
    return value !== null;
  };

  const login = async (identifier: string, password: string): Promise<void> => {
    await requestAuth("/login", { identifier: identifier, password: password });
    await refetch();
  };

  const signup = async (input: SignupInput): Promise<void> => {
    await requestAuth("/signup", {
      displayName: input.displayName,
      username: input.username,
      email: input.email,
      password: input.password,
    });
    await refetch();
  };

  const logout = async (): Promise<void> => {
    await requestAuth("/logout");
    await refetch();
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, signup, logout }}>
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
