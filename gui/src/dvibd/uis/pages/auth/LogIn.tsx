import type { JSX } from "solid-js";
import { createSignal } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import styles from "@src/dvibd/styles/pages/auth/LogIn.module.css";

function LogIn(): JSX.Element {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function submit(e: Event): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email(), password: password() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
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
    <div class={styles.login}>
      <h1 class={styles.title}>Welcome back</h1>
      <p class={styles.subtitle}>Log in to your dvibd account.</p>

      <form class={styles.form} onSubmit={submit}>
        {error() && <div class={styles.error}>{error()}</div>}
        
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
          {isLoading() ? "Logging in..." : "Log in"}
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
