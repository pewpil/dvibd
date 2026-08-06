import { A } from "@solidjs/router";
import logo from "../../../../assets/pages/dvibd/home/logo.svg";
import style from "../../../../styles/components/dvibd/home/NavBar.module.css";

function NavBar() {
  return (
    <nav id={style.navBar}>
      <div id={style.navInner}>
        <A id={style.brand} href="/" end>
          <img src={logo} alt="dvibd logo" />
          <span id={style.brandName}>
            dvibd<span id={style.brandDot}>.</span>
          </span>
        </A>
        <ul id={style.navLinks}>
          <li>
            <A href="/" end>
              Home
            </A>
          </li>
          <li>
            <A href="/social">Social</A>
          </li>
          <li>
            <A href="/message">Message</A>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;

