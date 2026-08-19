import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import style from "../../styles/pages/(auth)/login.module.css";

export default function Login() {
  const [identifier, setIdentifier] = createSignal("");
  const [password, setPassword] = createSignal("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    login().then(() => navigate("/"));
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
        <main id={style.login}>
          <h1>Log in</h1>
          <p>Welcome back. Enter your details to continue.</p>
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
            <button id={style.loginSubmit} type="submit">
              Log in
            </button>
          </form>
          <p id={style.loginSwitch}>
            Don't have an account? <A href="/signup">Sign up</A>
          </p>
        </main>
      </div>
    </div>,
  ];
}
