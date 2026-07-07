import type { Component } from 'solid-js'
import '../../styles/dvibd/ProductivityCard.css'

interface ProductivityCardProps {
  iconLetter: string
  iconColor: string
  title: string
  description: string
}

const ProductivityCard: Component<ProductivityCardProps> = (props) => {
  return (
    <article class="prod-card">
      <div
        class="prod-card-icon"
        style={{ '--icon-bg': `${props.iconColor}26`, '--icon-color': props.iconColor } as Record<string, string>}
      >
        <span>{props.iconLetter}</span>
      </div>
      <div class="prod-card-text">
        <h3 class="prod-card-title">{props.title}</h3>
        <p class="prod-card-desc">{props.description}</p>
      </div>
    </article>
  )
}

export default ProductivityCard