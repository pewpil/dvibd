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
            <A href="/products">Products</A>
          </li>
          <li>
            <A href="/about">About</A>
          </li>
          <li>
            <A href="/contact">Contact</A>
          </li>
        </ul>
        <div id={style.navAuth}>
          <A id={style.navLogIn} href="/login">
            Log in
          </A>
          <A id={style.navSignUp} href="/signup">
            Sign up
          </A>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
