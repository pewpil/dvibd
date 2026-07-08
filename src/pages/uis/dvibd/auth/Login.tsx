import type { Component } from 'solid-js';
import { A } from '@solidjs/router';
import style from '../../../styles/dvibd/auth/Login.module.css';
import Field from '@components/uis/dvibd/auth/Field';
import Action from '@components/uis/dvibd/Action';

const Login: Component = () => {
  return (
    <div class={style.login}>
      <div class={style.brandPanel}>
        <h1 class={style.logo}>dvibd</h1>
        <p class={style.tagline}>
          Connect. Create.<br />
          Communicate.
        </p>
        <p class={style.brandDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
      </div>

      <div class={style.formPanel}>
        <div class={style.card}>
          <h2 class={style.heading}>Welcome back</h2>
          <p class={style.subtitle}>Sign in to your dvibd account</p>

          <Field label="Email address" placeholder="you@example.com" type="email" />
          <Field label="Password" placeholder="Enter your password" type="password" />

          <Action
            bgColor="#6c63ff"
            textColor="#ffffff"
            href="/"
            radius={24}
            fullWidth
          >
            Sign In
          </Action>

          <div class={style.footer}>
            <A href="/login" class={style.forgotLink}>Forgot password?</A>
            <A href="/signup" class={style.signupLink}>Create account</A>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
