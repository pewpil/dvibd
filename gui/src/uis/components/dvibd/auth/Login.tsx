import { A } from '@solidjs/router'
import style from '../../../../styles/components/dvibd/auth/Login.module.css'

function Login() {
  return (
    <main id={style.login}>
      <h1>Log in</h1>
      <p>Welcome back — enter your details to continue.</p>
      <form id={style.loginForm}>
        <label>
          Username or email
          <input
            type="text"
            name="identifier"
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Your password" required />
        </label>
        <button id={style.loginSubmit} type="submit">
          Log in
        </button>
      </form>
      <p id={style.loginSwitch}>
        Don't have an account? <A href="/signup">Sign up</A>
      </p>
    </main>
  )
}

export default Login