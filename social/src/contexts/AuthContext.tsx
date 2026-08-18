import {
  createContext,
  createSignal,
  onMount,
  useContext,
  type ParentProps,
} from "solid-js";

const LOGGED_IN_KEY = "social.logged-in";

interface AuthContextValue {
  loggedIn(): boolean;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue>();

function AuthProvider(props: ParentProps) {
  const [loggedIn, setLoggedIn] = createSignal(false);

  onMount(() => {
    setLoggedIn(localStorage.getItem(LOGGED_IN_KEY) === "true");
  });

  const logout = () => {
    localStorage.removeItem(LOGGED_IN_KEY);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logout }}>
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