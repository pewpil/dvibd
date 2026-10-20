import { A } from "@solidjs/router";
import style from "../../styles/components/(home)/Hero.module.css";

export default function Hero() {
  return (
    <section id={style.hero}>
      <h1 id={style.heroTitle}>A calmer timeline</h1>
      <p id={style.heroText}>
        A slow feed of posts and articles from the people you follow. No race
        for reach, and each one has room to breathe.
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
