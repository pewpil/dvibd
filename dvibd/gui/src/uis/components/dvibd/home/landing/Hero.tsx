import { A } from "@solidjs/router";
import socialProfile from "../../../../../assets/pages/dvibd/home/social-profile.jpg";
import { reveal } from "../../../../directives/reveal.ts";
import howStyle from "../../../../../styles/components/dvibd/home/landing/HowItWorks.module.css";
import style from "../../../../../styles/components/dvibd/home/landing/Hero.module.css";

function Hero() {
  return (
    <section id={style.hero}>
      <div id={style.heroCopy}>
        <h1 id={style.heroTitle} ref={reveal()}>
          <span id={style.heroLineOne}>Two apps.</span>
          <span id={style.heroLineTwo}>One account.</span>
        </h1>
        <p id={style.heroLead} ref={reveal(1)}>
          Social is a community feed, Message is a private chat, and both run on
          the same dvibd account.
        </p>
        <div id={style.heroActions} ref={reveal(2)}>
          <A id={style.heroPrimary} href="/signup">
            Create account
          </A>
          <a id={style.heroSecondary} href={`#${howStyle.howItWorks}`}>
            See how it works
          </a>
        </div>
      </div>
      <div id={style.stage}>
        <div id={style.stageColumn} ref={reveal(1)}>
          <img
            id={style.stageImage}
            src={socialProfile}
            alt="Social profile for Aria Chen with the new feed post."
            width={640}
            height={960}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
