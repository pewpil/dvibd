import { A } from '@solidjs/router'
import style from '../../../../styles/components/dvibd/home/Footer.module.css'

function Footer() {
  return (
    <footer id={style.footer}>
      <div id={style.footerInner}>
        <div id={style.footerBrand}>
          <span id={style.footerName}>
            dvibd<span id={style.footerNameDot}>.</span>
          </span>
          <p id={style.footerTagline}>The networking company.</p>
        </div>
        <ul id={style.footerLinks}>
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
        <p id={style.copyright}>
          © {new Date().getFullYear()} dvibd. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer