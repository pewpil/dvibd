import type { JSX } from "solid-js";
import { createSignal, createContext, useContext, onMount } from "solid-js";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: () => User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: JSX.Element;
}

export function AuthProvider(props: AuthProviderProps): JSX.Element {
  const [user, setUserSignal] = createSignal<User | null>(null);

  const setUser = (newUser: User): void => {
    setUserSignal(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const clearUser = (): void => {
    setUserSignal(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  onMount(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserSignal(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        isAuthenticated: () => !!user(),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
