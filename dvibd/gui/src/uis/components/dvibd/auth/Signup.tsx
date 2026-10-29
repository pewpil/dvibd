import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { useAuth, type Session } from "../../../contexts/dvibd/AuthContext";
import style from "../../../../styles/components/dvibd/auth/Signup.module.css";

function firstValue(value: string | string[] | undefined): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return "";
}

function Signup() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [searchParams] = useSearchParams<{ name?: string | string[] }>();
  const prefilledName: string = firstValue(searchParams.name);
  const [displayName, setDisplayName] = createSignal<string>(prefilledName);
  const [username, setUsername] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username(),
          email: email(),
          password: password(),
          displayName: displayName(),
        }),
      });
      if (!response.ok) {
        if (response.status === 409) {
          setError(
            "That username or email already has an account. Log in instead, or pick another username.",
          );
        } else if (response.status >= 500) {
          setError(
            "Cannot reach the server. Check your connection and try again.",
          );
        } else {
          setError("Check the fields above and try again.");
        }
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
    <section id={style.signup}>
      <h1 id={style.signupTitle}>Create your account</h1>
      <p id={style.signupLead}>
        One account for Social and Message. Your profile, friends, and
        communities are the same in both.
      </p>
      <Show when={prefilledName !== ""}>
        <p id={style.signupPrefill}>
          This name came from the home page. Change it if you like.
        </p>
      </Show>
      <form id={style.signupForm} onSubmit={handleSubmit}>
        <div>
          <div>
            <label for={style.signupName}>
              Full name
            </label>
            <span>Required</span>
          </div>
          <input
            id={style.signupName}
            type="text"
            name="displayName"
            placeholder="Your full name"
            autocomplete="name"
            required
            value={displayName()}
            onInput={(event) => setDisplayName(event.currentTarget.value)}
          />
        </div>
        <div>
          <div>
            <label for={style.signupUsername}>
              Username
            </label>
            <span>Required</span>
          </div>
          <input
            id={style.signupUsername}
            type="text"
            name="username"
            placeholder="Your username"
            autocomplete="username"
            required
            value={username()}
            onInput={(event) => setUsername(event.currentTarget.value)}
          />
        </div>
        <div>
          <div>
            <label for={style.signupEmail}>
              Email
            </label>
            <span>Required</span>
          </div>
          <input
            id={style.signupEmail}
            type="email"
            name="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
            value={email()}
            onInput={(event) => setEmail(event.currentTarget.value)}
          />
        </div>
        <div>
          <div>
            <label for={style.signupPassword}>
              Password
            </label>
            <span>Required</span>
          </div>
          <input
            id={style.signupPassword}
            type="password"
            name="password"
            placeholder="Create a password"
            autocomplete="new-password"
            required
            value={password()}
            onInput={(event) => setPassword(event.currentTarget.value)}
          />
        </div>
        <button id={style.signupSubmit} type="submit" disabled={pending()}>
          {pending() ? "Signing up" : "Sign up"}
        </button>
        <Show when={error() !== ""}>
          <p id={style.signupError} role="alert">
            {error()}
          </p>
        </Show>
      </form>
      <p id={style.signupSwitch}>
        Already have an account? <A href="/login">Log in</A>
      </p>
    </section>
  );
}

export default Signup;
