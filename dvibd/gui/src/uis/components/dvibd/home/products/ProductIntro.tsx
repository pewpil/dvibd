import { A } from '@solidjs/router'
import type { ParentProps } from 'solid-js'
import style from '../../../../../styles/components/dvibd/home/products/ProductIntro.module.css'
import socialLogo from '../../../../../assets/components/dvibd/home/landing/product/social.svg'
import messageLogo from '../../../../../assets/components/dvibd/home/landing/product/message.svg'

type ProductIntroProps = ParentProps & {
  name: string
  href: string
  variant: 'social' | 'message'
  tagline: string
  features: string[]
}

function ProductIntro(props: ProductIntroProps) {
  const logo = props.variant === 'social' ? socialLogo : messageLogo

  return (
    <section classList={{ [style.productIntro]: true, [style[props.variant]]: true }}>
      <img src={logo} alt={`${props.name} logo`} />
      <h2>{props.name}</h2>
      <p class={style.tagline}>{props.tagline}</p>
      <p>{props.children}</p>
      <ul class={style.features}>
        {props.features.map((feature) => (
          <li>{feature}</li>
        ))}
      </ul>
      <A class={style.cta} href={props.href}>
        Open {props.name}
      </A>
    </section>
  )
}

export default ProductIntro
