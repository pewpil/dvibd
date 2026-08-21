import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import style from "../../styles/pages/(auth)/signup.module.css";

export default function Signup() {
  const [fullName, setFullName] = createSignal<string>("");
  const [username, setUsername] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [error, setError] = createSignal<string | undefined>(undefined);
  const [pending, setPending] = createSignal<boolean>(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    try {
      await signup({
        displayName: fullName(),
        username: username(),
        email: email(),
        password: password(),
      });
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return [
    <ThemeToggle />,
    <div id={style.auth}>
      <div id={style.authInner}>
        <A id={style.authBrand} href="/" end>
          <img src="/logo.svg" alt="social logo" />
          <span id={style.authBrandName}>
            social<span id={style.authBrandDot}>.</span>
          </span>
        </A>
        <main id={style.signup}>
          <h1>Create your account</h1>
          <p>Join social and start connecting. It only takes a minute.</p>
          <form id={style.signupForm} onSubmit={handleSubmit}>
            <Show when={error() !== undefined}>
              <p id={style.signupError}>{error()}</p>
            </Show>
            <label>
              Display name
              <input
                type="text"
                name="fullName"
                placeholder="Your display name"
                value={fullName()}
                onInput={(event) => setFullName(event.currentTarget.value)}
                required
              />
            </label>
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
              {pending() ? "Signing up..." : "Sign up"}
            </button>
          </form>
          <p id={style.signupSwitch}>
            Already have an account? <A href="/login">Log in</A>
          </p>
        </main>
      </div>
    </div>,
  ];
}
