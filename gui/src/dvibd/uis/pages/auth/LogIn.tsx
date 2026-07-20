import type { JSX } from "solid-js";
import { createSignal } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import styles from "@src/dvibd/styles/pages/auth/LogIn.module.css";

function LogIn(): JSX.Element {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  function submit(e: Event): void {
    e.preventDefault();
  }

  return (
    <div class={styles.login}>
      <h1 class={styles.title}>Welcome back</h1>
      <p class={styles.subtitle}>Log in to your dvibd account.</p>

      <form class={styles.form} onSubmit={submit}>
        <label class={styles.field}>
          <span class={styles.label}>Email</span>
          <input
            class={styles.input}
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label class={styles.field}>
          <span class={styles.label}>Password</span>
          <input
            class={styles.input}
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <Button
          variant="primary"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          Log in
        </Button>
      </form>

      <p class={styles.alt}>
        New to dvibd?{" "}
        <a class={styles.link} href="/auth/signup">
          Create an account
        </a>
      </p>
    </div>
  );
}

export default LogIn;
