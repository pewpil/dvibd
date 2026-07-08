import type { Component } from 'solid-js';
import { A } from '@solidjs/router';
import style from '../../../styles/dvibd/auth/Signup.module.css';
import Field from '@components/uis/dvibd/auth/Field';
import Action from '@components/uis/dvibd/Action';

const Signup: Component = () => {
  return (
    <div class={style.signup}>
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
          <h2 class={style.heading}>Create your account</h2>
          <p class={style.subtitle}>Get started with dvibd today</p>

          <Field label="Full name" placeholder="John Doe" />
          <Field label="Email address" placeholder="you@example.com" type="email" />
          <Field label="Password" placeholder="Create a password" type="password" />

          <p class={style.terms}>
            Amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
          </p>

          <A href="/login" class={style.loginLink}>
            Already have an account? Log in
          </A>

          <Action
            bgColor="#6c63ff"
            textColor="#ffffff"
            href="/"
            radius={24}
            fullWidth
          >
            Sign Up
          </Action>
        </div>
      </div>
    </div>
  );
};

export default Signup;
