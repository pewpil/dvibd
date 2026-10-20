"use client";

import { useState, type ReactNode, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import ThemeToggle from "../../../components/ThemeToggle";
import style from "../../../styles/pages/signup.module.css";

export default function SignupPage(): ReactNode {
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await signup({
        displayName: displayName,
        username: username,
        email: email,
        password: password,
      });
      router.replace("/");
      router.refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main id={style.auth}>
      <div id={style.authInner}>
        <Link id={style.authBrand} href="/">
          <img id={style.authBrandIcon} src="/icon.svg" alt="" />
          <span id={style.authBrandName}>
            message<span id={style.authBrandDot}>.</span>
          </span>
        </Link>
        <section id={style.signup}>
          <h1 id={style.signupHeading}>Sign up</h1>
          <p id={style.signupIntro}>Create an account to start messaging.</p>
          <form id={style.signupForm} onSubmit={handleSubmit}>
            {error !== null ? <p id={style.signupError}>{error}</p> : null}
            <label id={style.signupDisplayNameLabel}>
              Display name
              <input
                id={style.signupDisplayName}
                type="text"
                name="displayName"
                placeholder="Alex Rivera"
                autoComplete="name"
                value={displayName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setDisplayName(event.target.value)
                }
                required
              />
            </label>
            <label id={style.signupUsernameLabel}>
              Username
              <input
                id={style.signupUsername}
                type="text"
                name="username"
                placeholder="alexrivera"
                autoComplete="username"
                value={username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setUsername(event.target.value)
                }
                required
              />
            </label>
            <label id={style.signupEmailLabel}>
              Email
              <input
                id={style.signupEmail}
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setEmail(event.target.value)
                }
                required
              />
            </label>
            <label id={style.signupPasswordLabel}>
              Password
              <input
                id={style.signupPassword}
                type="password"
                name="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setPassword(event.target.value)
                }
                required
              />
            </label>
            <button id={style.signupSubmit} type="submit" disabled={pending}>
              {pending ? "Creating account..." : "Sign up"}
            </button>
          </form>
          <p id={style.signupSwitch}>
            Already have an account?{" "}
            <Link id={style.signupSwitchLink} href="/login">
              Log in
            </Link>
          </p>
        </section>
      </div>
      <ThemeToggle fixed />
    </main>
  );
}