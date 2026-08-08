import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import style from "../../../../styles/components/dvibd/auth/Signup.module.css";

interface Session {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username(),
          email: email(),
          password: password(),
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "Unable to sign up. Please try again.");
        return;
      }
      const session = (await response.json()) as Session;
      localStorage.setItem("dvibd.session", JSON.stringify(session));
      navigate("/", { replace: true });
    } catch {
      setError("Cannot reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main id={style.signup}>
      <h1>Create your account</h1>
      <p>Join dvibd and start connecting — it only takes a minute.</p>
      <form id={style.signupForm} onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            placeholder="Your username"
            value={username()}
            onInput={(event) => setUsername(event.currentTarget.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email()}
            onInput={(event) => setEmail(event.currentTarget.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={password()}
            onInput={(event) => setPassword(event.currentTarget.value)}
            required
          />
        </label>
        <button id={style.signupSubmit} type="submit" disabled={pending()}>
          {pending() ? "Signing up…" : "Sign up"}
        </button>
        {error() && (
          <p id={style.signupError} role="alert">
            {error()}
          </p>
        )}
      </form>
      <p id={style.signupSwitch}>
        Already have an account? <A href="/login">Log in</A>
      </p>
    </main>
  );
}

export default Signup