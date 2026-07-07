import type { Component } from 'solid-js'
import s from '../styles/ProductivityCard.module.css'

interface ProductivityCardProps {
  iconLetter: string
  iconColor: string
  title: string
  children: string
}

const ProductivityCard: Component<ProductivityCardProps> = (props) => {
  return (
    <article class={s.card}>
      <div
        class={s.icon}
        style={{ '--icon-bg': `${props.iconColor}26`, '--icon-color': props.iconColor } as Record<string, string>}
      >
        <span>{props.iconLetter}</span>
      </div>
      <div class={s.text}>
        <h3 class={s.title}>{props.title}</h3>
        <p class={s.desc}>{props.children}</p>
      </div>
    </article>
  )
}

export default ProductivityCard
