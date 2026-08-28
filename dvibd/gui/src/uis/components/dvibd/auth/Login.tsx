import { A, useNavigate } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { useAuth, type Session } from "../../../contexts/dvibd/AuthContext";
import style from "../../../../styles/components/dvibd/auth/Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { session, setSession } = useAuth();
  const [identifier, setIdentifier] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal("");

  createEffect(() => {
    if (session()) {
      navigate("/", { replace: true });
    }
  });

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier(),
          password: password(),
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "Unable to log in. Please try again.");
        return;
      }
      const newSession = (await response.json()) as Session;
      setSession(newSession);
      navigate("/", { replace: true });
    } catch {
      setError("Cannot reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main id={style.login}>
      <h1>Log in</h1>
      <p>Welcome back — enter your details to continue.</p>
      <form id={style.loginForm} onSubmit={handleSubmit}>
        <label>
          Username or email
          <input
            type="text"
            name="identifier"
            placeholder="you@example.com"
            value={identifier()}
            onInput={(event) => setIdentifier(event.currentTarget.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Your password"
            value={password()}
            onInput={(event) => setPassword(event.currentTarget.value)}
            required
          />
        </label>
        <button id={style.loginSubmit} type="submit" disabled={pending()}>
          {pending() ? "Logging in…" : "Log in"}
        </button>
        {error() && (
          <p id={style.loginError} role="alert">
            {error()}
          </p>
        )}
      </form>
      <p id={style.loginSwitch}>
        Don't have an account? <A href="/signup">Sign up</A>
      </p>
    </main>
  );
}

export default Login;
