import { A } from '@solidjs/router'
import style from '../../../../../styles/components/dvibd/home/about/AboutProducts.module.css'

function AboutProducts() {
  return (
    <section id={style.aboutProducts}>
      <div id={style.aboutProductsInner}>
        <h2>Meet the apps we build</h2>
        <p>
          Everything we believe goes into two products — see what Social and
          Message are all about.
        </p>
        <div id={style.aboutProductsLinks}>
          <A class={style.aboutProductLink} href="/products">
            Explore our products
          </A>
        </div>
      </div>
    </section>
  )
}

export default AboutProducts