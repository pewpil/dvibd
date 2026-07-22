import type { JSX } from "solid-js";
import { createSignal } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import styles from "@src/dvibd/styles/pages/auth/SignUp.module.css";

function SignUp(): JSX.Element {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function submit(e: Event): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email(),
          username: name(),
          password: password(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // Redirect to home page
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div class={styles.signup}>
      <h1 class={styles.title}>Join dvibd</h1>
      <p class={styles.subtitle}>
        Create an account and connect with everything dvibd offers.
      </p>

      <form class={styles.form} onSubmit={submit}>
        {error() && <div class={styles.error}>{error()}</div>}

        <label class={styles.field}>
          <span class={styles.label}>Name</span>
          <input
            class={styles.input}
            type="text"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="Your name"
            required
            disabled={isLoading()}
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
            disabled={isLoading()}
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
            disabled={isLoading()}
          />
        </label>

        <Button
          variant="primary"
          href="#"
          disabled={isLoading()}
          type="submit"
        >
          {isLoading() ? "Creating account..." : "Create account"}
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
