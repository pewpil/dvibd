import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';
import { Mail, Lock } from 'lucide-solid';
import { Action } from '../components/Action';
import { Field } from '../components/Field';
import { AuthLayout } from './AuthLayout';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [done, setDone] = createSignal(false);

  const submit = (e: Event) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to dvibd? <A href="/signup">Create an account</A>
        </>
      }
    >
      {done() ? (
        <div class={styles.success}>
          <h2>Signed in as {email() || 'you'}</h2>
          <p>This is a demo — no real session was created.</p>
          <Action href="/" variant="secondary" color="purple">
            Back home
          </Action>
        </div>
      ) : (
        <form class={styles.form} onSubmit={submit}>
          <Field
            label="Email"
            type="email"
            value={email()}
            onInput={setEmail}
            placeholder="you@example.com"
            autocomplete="email"
            icon={<Mail size={18} />}
            required
          />
          <Field
            label="Password"
            type="password"
            value={password()}
            onInput={setPassword}
            placeholder="Your password"
            autocomplete="current-password"
            icon={<Lock size={18} />}
            required
          />
          <A href="#" class={styles.forgot}>
            Forgot your password?
          </A>
          <Action variant="primary" color="purple" full submit>
            Log in
          </Action>
        </form>
      )}
    </AuthLayout>
  );
}
