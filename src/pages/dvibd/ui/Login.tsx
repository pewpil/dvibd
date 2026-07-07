import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import s from "../styles/Login.module.css";

const Login: Component = () => {
  return (
    <div class={s.loginPage}>
      <div class={s.brandPanel}>
        <span class={s.logo}>dvibd</span>
        <p class={s.tagline}>Connect. Create.{"\n"}Communicate.</p>
        <p class={s.brandDesc}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
      </div>

      <div class={s.formPanel}>
        <div class={s.loginCard}>
          <h1 class={s.heading}>Welcome back</h1>
          <p class={s.subtitle}>Sign in to your dvibd account</p>

          <div class={s.field}>
            <label class={s.label} for="email">
              Email address
            </label>
            <input
              id="email"
              class={s.input}
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div class={s.field}>
            <label class={s.label} for="password">
              Password
            </label>
            <input
              id="password"
              class={s.input}
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button class={s.signInBtn} type="submit">
            Sign In
          </button>

          <div class={s.footer}>
            <A href="/forgot" class={s.forgotLink}>
              Forgot password?
            </A>
            <A href="/signup" class={s.signupLink}>
              Create account
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
