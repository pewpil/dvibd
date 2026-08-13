import style from "../../styles/components/(home)/Hero.module.css";

export default function Hero() {
  return (
    <section id={style.hero}>
      <h1 id={style.heroTitle}>Welcome to dvibd</h1>
      <p id={style.heroText}>
        A slower kind of social. No noise, no race for reach, just thoughtful
        posts from people and communities you care about.
      </p>
      <div id={style.heroActions}>
        <a href="/auth/signup" id={style.heroPrimary}>
          Create an account
        </a>
        <a href="/auth/login" id={style.heroSecondary}>
          Log in
        </a>
      </div>
    </section>
  );
}
