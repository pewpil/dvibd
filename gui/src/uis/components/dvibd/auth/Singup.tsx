import { A } from '@solidjs/router'
import style from '../../../../styles/components/dvibd/auth/Singup.module.css'

function Singup() {
  return (
    <main id={style.singup}>
      <h1>Create your account</h1>
      <p>Join dvibd and start connecting — it only takes a minute.</p>
      <form id={style.singupForm}>
        <label>
          Username
          <input type="text" name="username" placeholder="Your username" required />
        </label>
        <label>
          Email
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Create a password" required />
        </label>
        <button id={style.singupSubmit} type="submit">
          Sign up
        </button>
      </form>
      <p id={style.singupSwitch}>
        Already have an account? <A href="/login">Log in</A>
      </p>
    </main>
  )
}

export default Singup