import { A } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import logo from "../../../../assets/pages/dvibd/home/logo.svg";
import AccountCard from "../home/fragments/AccountCard.tsx";
import ThemeToggle from "../home/ThemeToggle.tsx";
import layoutStyle from "../../../../styles/pages/dvibd/layout.module.css";
import style from "../../../../styles/components/dvibd/auth/Auth.module.css";

function Auth(props: ParentProps) {
  return (
    <main id={layoutStyle.mainContent} tabindex="-1">
      <div id={style.auth}>
        <aside id={style.authAside}>
          <A id={style.authBrand} href="/" end>
            <img
              id={style.authMark}
              src={logo}
              alt=""
              width="64"
              height="64"
            />
            <span id={style.authName}>
              dvibd<span id={style.authDot}>.</span>
            </span>
          </A>
          <div id={style.authAsideBody}>
            <p id={style.authTagline}>The networking company.</p>
            <div id={style.authCard}>
              <AccountCard context="On Social and Message" />
            </div>
          </div>
          <div id={style.authTheme}>
            <ThemeToggle />
          </div>
        </aside>
        <div id={style.authMain}>{props.children}</div>
      </div>
    </main>
  );
}

export default Auth;
