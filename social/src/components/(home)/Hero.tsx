import { A } from "@solidjs/router";
import style from "../../styles/components/(home)/Hero.module.css";

export default function Hero() {
  return (
    <section id={style.hero}>
      <h1 id={style.heroTitle}>Welcome to social</h1>
      <p id={style.heroText}>
        A slower kind of social. No noise, no race for reach, just thoughtful
        posts from people and communities you care about.
      </p>
      <div id={style.heroActions}>
        <A href="/signup" id={style.heroPrimary}>
          Create an account
        </A>
        <A href="/login" id={style.heroSecondary}>
          Log in
        </A>
      </div>
    </section>
  );
}
