import type { JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { Mail, Lock } from 'lucide-solid';
import { Action } from '~/dvibd/uis/components/Action';
import { Field } from '~/dvibd/uis/components/Field';
import { AuthLayout } from '~/dvibd/uis/pages/app/auth/Auth';
import { login } from '~/dvibd/auth';
import styles from '~/dvibd/styles/pages/app/auth/Auth.module.css';

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const submit = async (e: Event): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: email(), password: password() });
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
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
      <form class={styles.form} onSubmit={submit}>
        {error() && <p class={styles.error}>{error()}</p>}
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
          {loading() ? 'Logging in…' : 'Log in'}
        </Action>
      </form>
    </AuthLayout>
  );
}
