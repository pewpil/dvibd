import type { JSX } from "solid-js";
import { createSignal } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import styles from "@src/dvibd/styles/pages/auth/SignUp.module.css";

function SignUp(): JSX.Element {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  function submit(e: Event): void {
    e.preventDefault();
  }

  return (
    <div class={styles.signup}>
      <h1 class={styles.title}>Join dvibd</h1>
      <p class={styles.subtitle}>
        Create an account and connect with everything dvibd offers.
      </p>

      <form class={styles.form} onSubmit={submit}>
        <label class={styles.field}>
          <span class={styles.label}>Name</span>
          <input
            class={styles.input}
            type="text"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="Your name"
            required
          />
        </label>

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
          Create account
        </Button>
      </form>

      <p class={styles.alt}>
        Already have an account?{" "}
        <a class={styles.link} href="/auth/login">
          Log in
        </a>
      </p>
    </div>
  );
}

export default SignUp;
