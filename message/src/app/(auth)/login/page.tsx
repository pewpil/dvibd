"use client";

import { Suspense, useState, type ReactNode, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import style from "../../../styles/pages/login.module.css";

function LoginForm(): ReactNode {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(identifier, password);
      const from: string | null = searchParams.get("from");
      router.replace(from !== null && from.startsWith("/") ? from : "/");
      router.refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section id={style.login}>
      <h1 id={style.loginHeading}>Log in</h1>
      <p id={style.loginIntro}>Welcome back. Enter your details to continue.</p>
      <form id={style.loginForm} onSubmit={handleSubmit}>
        {error !== null ? <p id={style.loginError}>{error}</p> : null}
        <label id={style.loginIdentifierLabel}>
          Username or email
          <input
            id={style.loginIdentifier}
            type="text"
            name="identifier"
            placeholder="you@example.com"
            autoComplete="username"
            value={identifier}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              setIdentifier(event.target.value)
            }
            required
          />
        </label>
        <label id={style.loginPasswordLabel}>
          Password
          <input
            id={style.loginPassword}
            type="password"
            name="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              setPassword(event.target.value)
            }
            required
          />
        </label>
        <button id={style.loginSubmit} type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p id={style.loginSwitch}>
        Don&apos;t have an account?{" "}
        <Link id={style.loginSwitchLink} href="/signup">
          Sign up
        </Link>
      </p>
    </section>
  );
}

export default function LoginPage(): ReactNode {
  return (
    <main id={style.auth}>
      <div id={style.authInner}>
        <Link id={style.authBrand} href="/">
          <span id={style.authBrandName}>
            message<span id={style.authBrandDot}>.</span>
          </span>
        </Link>
        <Suspense fallback={<section id={style.login} />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}