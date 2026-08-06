import { A } from '@solidjs/router'
import type { ParentProps } from 'solid-js'
import style from '../../../../../styles/components/dvibd/home/landing/Product.module.css'
import socialLogo from '../../../../../assets/components/dvibd/home/landing/product/social.svg'
import messageLogo from '../../../../../assets/components/dvibd/home/landing/product/message.svg'

type ProductProps = ParentProps & {
  name: string
  href: string
  variant: 'social' | 'message'
}

function Product(props: ProductProps) {
  const logo = props.variant === 'social' ? socialLogo : messageLogo

  return (
    <article classList={{ [style.productCard]: true, [style[props.variant]]: true }}>
      <div id={style.productTitle}>
        <img src={logo} alt={`${props.name} logo`} />
        <h3>{props.name}</h3>
      </div>
      <p>{props.children}</p>
      <A href={props.href}>Open {props.name}</A>
    </article>
  )
}

export default Product