import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';
import { User, Mail, Lock } from 'lucide-solid';
import { Action } from '../components/Action';
import { Field } from '../components/Field';
import { AuthLayout } from './AuthLayout';
import styles from './Auth.module.css';

export default function Signup() {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [done, setDone] = createSignal(false);

  const submit = (e: Event) => {
    e.preventDefault();
    setDone(true);
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
      {done() ? (
        <div class={styles.success}>
          <h2>You’re on the list, {name() || 'friend'}!</h2>
          <p>
            We sent a confirmation link to <strong>{email() || 'your inbox'}</strong>.
            Click it to activate your account.
          </p>
          <Action href="/" variant="secondary" color="purple">
            Back home
          </Action>
        </div>
      ) : (
        <form class={styles.form} onSubmit={submit}>
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
            Create account
          </Action>
        </form>
      )}
    </AuthLayout>
  );
}
