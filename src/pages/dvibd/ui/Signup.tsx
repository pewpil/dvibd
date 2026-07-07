import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import s from "../styles/Signup.module.css";

const Signup: Component = () => {
  return (
    <div class={s.signupPage}>
      <div class={s.brandPanel}>
        <span class={s.logo}>dvibd</span>
        <p class={s.tagline}>Start your{"\n"}journey.</p>
        <p class={s.brandDesc}>
          Sit amet consectetur adipiscing elit sed do eiusmod.
        </p>
      </div>

      <div class={s.formPanel}>
        <div class={s.signupCard}>
          <h1 class={s.heading}>Create your account</h1>
          <p class={s.subtitle}>Get started with dvibd today</p>

          <div class={s.field}>
            <label class={s.label} for="username">
              Username
            </label>
            <input
              id="username"
              class={s.input}
              type="text"
              placeholder="Enter your username"
            />
          </div>

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

          <p class={s.terms}>
            Amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut
            labore.
          </p>

          <button class={s.signUpBtn} type="submit">
            Create Account
          </button>

          <div class={s.footer}>
            <A href="/login" class={s.loginLink}>
              Already have an account? Log in
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
