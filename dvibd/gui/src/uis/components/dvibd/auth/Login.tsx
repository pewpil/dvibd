import { A, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { useAuth, type Session } from "../../../contexts/dvibd/AuthContext";
import style from "../../../../styles/components/dvibd/auth/Login.module.css";

function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [identifier, setIdentifier] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [pending, setPending] = createSignal<boolean>(false);
  const [error, setError] = createSignal<string>("");

  createEffect((): void => {
    if (auth.session() !== null) {
      navigate("/", { replace: true });
    }
  });

  const handleSubmit = async (event: SubmitEvent): Promise<void> => {
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
        setError(
          response.status >= 500
            ? "Cannot reach the server. Check your connection and try again."
            : "That username and password do not match. Check both and try again.",
        );
        return;
      }
      const session = (await response.json()) as Session;
      auth.setSession(session);
      navigate("/", { replace: true });
    } catch {
      setError("Cannot reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section id={style.login}>
      <h1 id={style.loginTitle}>Log in</h1>
      <p id={style.loginLead}>
        Use the username or email on your dvibd account. The same account opens
        Social and Message.
      </p>
      <form id={style.loginForm} onSubmit={handleSubmit}>
        <div>
          <div>
            <label for={style.loginIdentifier}>
              Username or email
            </label>
            <span>Required</span>
          </div>
          <input
            id={style.loginIdentifier}
            type="text"
            name="identifier"
            placeholder="you@example.com"
            autocomplete="username"
            required
            value={identifier()}
            onInput={(event) => setIdentifier(event.currentTarget.value)}
          />
        </div>
        <div>
          <div>
            <label for={style.loginPassword}>
              Password
            </label>
            <span>Required</span>
          </div>
          <input
            id={style.loginPassword}
            type="password"
            name="password"
            placeholder="Your password"
            autocomplete="current-password"
            required
            value={password()}
            onInput={(event) => setPassword(event.currentTarget.value)}
          />
        </div>
        <button id={style.loginSubmit} type="submit" disabled={pending()}>
          {pending() ? "Logging in" : "Log in"}
        </button>
        <Show when={error() !== ""}>
          <p id={style.loginError} role="alert">
            {error()}
          </p>
        </Show>
      </form>
      <p id={style.loginSwitch}>
        No account yet? <A href="/signup">Sign up</A>
      </p>
    </section>
  );
}

export default Login;
