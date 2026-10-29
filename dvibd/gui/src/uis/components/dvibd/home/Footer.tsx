import { A } from "@solidjs/router";
import logo from "../../../../assets/pages/dvibd/home/logo.svg";
import {
  MESSAGE_URL,
  PRESS_EMAIL,
  SOCIAL_URL,
  SUPPORT_EMAIL,
} from "../../../lib/dvibd";
import { reveal } from "../../../directives/reveal.ts";
import style from "../../../../styles/components/dvibd/home/Footer.module.css";

function Footer() {
  return (
    <footer id={style.footer}>
      <div id={style.footerInner}>
        <div id={style.footerBrand} ref={reveal()}>
          <A id={style.footerMark} href="/" end>
            <img
              id={style.footerMarkImage}
              src={logo}
              alt=""
              width="64"
              height="64"
            />
            <span id={style.footerName}>
              dvibd<span id={style.footerDot}>.</span>
            </span>
          </A>
          <p id={style.footerTagline}>The networking company.</p>
        </div>
        <ul id={style.footerLinks} ref={reveal(1)}>
          <li>
            <A href="/products">Products</A>
          </li>
          <li>
            <A href="/about">About</A>
          </li>
          <li>
            <A href="/contact">Contact</A>
          </li>
          <li>
            <a href={SOCIAL_URL}>Social</a>
          </li>
          <li>
            <a href={MESSAGE_URL}>Message</a>
          </li>
          <li>
            <A href="/login">Log in</A>
          </li>
          <li>
            <A href="/signup">Sign up</A>
          </li>
        </ul>
        <div id={style.footerMeta} ref={reveal(2)}>
          <p id={style.footerEmails}>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <a href={`mailto:${PRESS_EMAIL}`}>{PRESS_EMAIL}</a>
          </p>
          <p id={style.footerCopyright}>
            © {new Date().getFullYear()} dvibd
          </p>
        </div>
        <p id={style.footerProduct} ref={reveal(3)}>
          Social and Message are dvibd products.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
