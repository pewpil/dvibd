import { A } from '@solidjs/router'
import type { ParentProps } from 'solid-js'
import style from '../../../../../styles/components/dvibd/home/landing/Product.module.css'

type ProductProps = ParentProps & {
  name: string
  href: string
  variant: 'social' | 'message'
}

function Product(props: ProductProps) {
  return (
    <article classList={{ [style.productCard]: true, [style[props.variant]]: true }}>
      <h3>{props.name}</h3>
      <p>{props.children}</p>
      <A href={props.href}>Open {props.name}</A>
    </article>
  )
}

export default Product