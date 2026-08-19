import {
  createContext,
  createResource,
  createSignal,
  useContext,
  type ParentProps,
} from "solid-js";
import {
  getAuthState,
  login as loginRequest,
  logout as logoutRequest,
} from "../server/auth";

interface AuthContextValue {
  loggedIn(): boolean | undefined;
  login(): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue>();

function AuthProvider(props: ParentProps) {
  const [refresh, setRefresh] = createSignal(0);
  const [loggedIn] = createResource(refresh, () => getAuthState());

  const login = async () => {
    // Ignore diagnostic: await is actually needed here for user redirection page to load properly
    await loginRequest();
    setRefresh((value) => value + 1);
  };

  const logout = async () => {
    // Ignore diagnostic: await is actually needed here for user redirection page to load properly
    await logoutRequest();
    setRefresh((value) => value + 1);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
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
