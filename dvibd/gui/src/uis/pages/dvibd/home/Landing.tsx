import { A } from '@solidjs/router'
import style from '../../../../styles/pages/dvibd/home/Landing.module.css'
import Product from '../../../components/dvibd/home/landing/Product.tsx'

function Landing() {
  return (
    <main id={style.landing}>
      <section id={style.hero}>
        <h1>Connect with everyone, everywhere.</h1>
        <p>
          dvibd builds the apps that bring people together. Social is where you
          share your world, and Message is how you reach anyone — anywhere,
          instantly.
        </p>
        <div id={style.heroActions}>
          <A class={style.cta} href="/social">
            Explore Social
          </A>
          <A
            classList={{ [style.cta]: true, [style.secondary]: true }}
            href="/message"
          >
            Try Message
          </A>
        </div>
      </section>

      <section id={style.products}>
        <h2>Our apps</h2>
        <div id={style.productCards}>
          <Product name="Social" variant="social" href="/social">
            A social network where you connect with friends, share your
            moments, and discover the people around you.
          </Product>
          <Product name="Message" variant="message" href="/message">
            Fast, reliable messaging over the internet — send a message to
            anyone you care about, wherever they are.
          </Product>
        </div>
      </section>

      <section id={style.join}>
        <h2>Join dvibd</h2>
        <p>
          Create your account, build your network, and start the conversation.
          dvibd is where the world connects.
        </p>
        <A class={style.cta} href="/">
          Get started
        </A>
      </section>
    </main>
  )
}

export default Landing