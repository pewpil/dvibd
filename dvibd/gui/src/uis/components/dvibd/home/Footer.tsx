import { A } from '@solidjs/router'
import logo from '../../../../assets/pages/dvibd/home/logo.svg'
import style from '../../../../styles/components/dvibd/home/Footer.module.css'

function Footer() {
  return (
    <footer id={style.footer}>
      <div id={style.footerInner}>
        <div id={style.footerBrand}>
          <A id={style.brandLink} href="/" end>
            <img src={logo} alt="dvibd logo" />
            <span id={style.brandName}>
              dvibd<span id={style.brandDot}>.</span>
            </span>
          </A>
          <p id={style.footerTagline}>The networking company.</p>
        </div>
        <nav id={style.footerColProducts}>
          <h4>Products</h4>
          <ul>
            <li>
              <A href="/social">Social</A>
            </li>
            <li>
              <A href="/message">Message</A>
            </li>
          </ul>
        </nav>
        <nav id={style.footerColCompany}>
          <h4>Company</h4>
          <ul>
            <li>
              <A href="/about">About</A>
            </li>
            <li>
              <A href="/contact">Contact</A>
            </li>
          </ul>
        </nav>
        <nav id={style.footerColSupport}>
          <h4>Support</h4>
          <ul>
            <li>
              <a href="mailto:support@dvibd.com">support@dvibd.com</a>
            </li>
            <li>
              <a href="mailto:press@dvibd.com">press@dvibd.com</a>
            </li>
          </ul>
        </nav>
        <div id={style.footerBottom}>
          <p id={style.copyright}>
            © {new Date().getFullYear()} dvibd. All rights reserved.
          </p>
          <div id={style.footerAuth}>
            <A href="/login">Log in</A>
            <A href="/signup">Sign up</A>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer