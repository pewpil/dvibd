import style from '../../../../styles/pages/dvibd/home/Products.module.css'
import ProductIntro from '../../../components/dvibd/home/products/ProductIntro.tsx'
import Ecosystem from '../../../components/dvibd/home/products/Ecosystem.tsx'
import Stats from '../../../components/dvibd/home/products/Stats.tsx'
import FAQ from '../../../components/dvibd/home/products/FAQ.tsx'
import CTABanner from '../../../components/dvibd/home/products/CTABanner.tsx'

function Products() {
  return (
    <main id={style.products}>
      <section id={style.productsHero}>
        <h1>Two apps, one community.</h1>
        <p>
          dvibd builds the software that brings people together. Social is
          where you share your life; Message is how you talk to the people in
          it. Explore what each one does.
        </p>
      </section>

      <ProductIntro
        name="Social"
        href="/social"
        variant="social"
        tagline="Share your world."
        features={[
          'A feed of posts, photos, and updates from the people you follow',
          'Communities built around shared interests',
          'Discover people and topics that matter to you',
        ]}
      >
        Social is dvibd's social network. Post what you're up to, follow your
        friends, and join communities where you can find your people.
      </ProductIntro>

      <ProductIntro
        name="Message"
        href="/message"
        variant="message"
        tagline="Reach anyone, instantly."
        features={[
          'Fast, reliable messaging over the internet',
          'One-on-one chats and group conversations',
          'Works on any device, wherever you are',
        ]}
      >
        Message is dvibd's messaging app. Send a message to anyone you care
        about, start a group, and keep the conversation going — anywhere in the
        world.
      </ProductIntro>

      <Ecosystem />

      <Stats />

      <FAQ />

      <CTABanner />
    </main>
  )
}

export default Products
