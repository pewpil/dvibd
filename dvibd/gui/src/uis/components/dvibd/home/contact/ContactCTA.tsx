import { A } from '@solidjs/router'
import style from '../../../../../styles/components/dvibd/home/contact/ContactCTA.module.css'

function ContactCTA() {
  return (
    <section id={style.contactCta}>
      <div id={style.contactCtaInner}>
        <h2>Prefer to explore first?</h2>
        <p>
          Get to know dvibd before reaching out — see what Social and Message
          can do, and learn more about who we are.
        </p>
        <div id={style.contactCtaActions}>
          <A class={style.contactCtaPrimary} href="/products">
            Explore our products
          </A>
          <A class={style.contactCtaSecondary} href="/about">
            About dvibd
          </A>
        </div>
      </div>
    </section>
  )
}

export default ContactCTA