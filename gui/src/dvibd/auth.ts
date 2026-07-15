import { createSignal } from 'solid-js';

const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';
const TOKEN_KEY: string = 'dvibd_token';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
};

interface AuthResponse {
  token: string;
  user: AuthUser;
}

const [token, setToken] = createSignal<string | null>(localStorage.getItem(TOKEN_KEY));
const [user, setUser] = createSignal<AuthUser | null>(null);

function apply(tokenValue: string, userValue: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, tokenValue);
  setToken(tokenValue);
  setUser(userValue);
}

function clear(): void {
  localStorage.removeItem(TOKEN_KEY);
  setToken(null);
  setUser(null);
}

export function isAuthenticated(): boolean {
  return token() !== null;
}

export function currentUser(): AuthUser | null {
  return user();
}

export function authToken(): string | null {
  return token();
}

export async function signup(input: { username: string; email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data: Record<string, string> = await res
      .json()
      .catch(() => ({}) as Record<string, string>);
    throw new Error(data.message ?? 'Sign up failed');
  }
  const data: AuthResponse = await res.json();
  apply(data.token, data.user);
  return data;
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data: Record<string, string> = await res
      .json()
      .catch(() => ({}) as Record<string, string>);
    throw new Error(data.message ?? 'Log in failed');
  }
  const data: AuthResponse = await res.json();
  apply(data.token, data.user);
  return data;
}

export function logout(): void {
  clear();
}
