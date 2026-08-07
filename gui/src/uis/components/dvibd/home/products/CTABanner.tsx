import { A } from '@solidjs/router'
import style from '../../../../../styles/components/dvibd/home/products/CTABanner.module.css'

function CTABanner() {
  return (
    <section id={style.ctaBanner}>
      <div id={style.ctaInner}>
        <h2>Ready to get started?</h2>
        <p>
          Create your account, build your network, and start the conversation.
          dvibd is where the world connects.
        </p>
        <div id={style.ctaActions}>
          <A class={style.ctaPrimary} href="/social">
            Explore Social
          </A>
          <A class={style.ctaSecondary} href="/message">
            Try Message
          </A>
        </div>
      </div>
    </section>
  )
}

export default CTABanner
