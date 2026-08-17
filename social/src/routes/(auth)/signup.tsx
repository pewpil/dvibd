import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import ThemeToggle from "../../components/ThemeToggle";
import style from "../../styles/pages/(auth)/signup.module.css";

export default function Signup() {
  const [fullName, setFullName] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

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
        <form id={style.signupForm}>
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
            <button id={style.signupSubmit} type="submit">
              Sign up
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
