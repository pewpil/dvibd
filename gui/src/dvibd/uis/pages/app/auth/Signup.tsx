import type { JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { User, Mail, Lock } from 'lucide-solid';
import { Action } from '~/dvibd/uis/components/Action';
import { Field } from '~/dvibd/uis/components/Field';
import { AuthLayout } from '~/dvibd/uis/pages/app/auth/Auth';
import { signup } from '~/dvibd/auth';
import styles from '~/dvibd/styles/pages/app/auth/Auth.module.css';

export default function Signup(): JSX.Element {
  const navigate = useNavigate();
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const submit = async (e: Event): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup({ username: name(), email: email(), password: password() });
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the dvibd open beta — it takes a minute."
      footer={
        <>
          Already have an account? <A href="/login">Log in</A>
        </>
      }
    >
      <form class={styles.form} onSubmit={submit}>
        {error() && <p class={styles.error}>{error()}</p>}
        <Field
          label="Username"
          value={name()}
          onInput={setName}
          placeholder="ada"
          autocomplete="username"
          icon={<User size={18} />}
          required
        />
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
          placeholder="At least 8 characters"
          autocomplete="new-password"
          icon={<Lock size={18} />}
          required
        />
        <p class={styles.hint}>
          By signing up you agree to our <a href="#">Terms</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
        <Action variant="primary" color="purple" full submit>
          {loading() ? 'Creating account…' : 'Create account'}
        </Action>
      </form>
    </AuthLayout>
  );
}
