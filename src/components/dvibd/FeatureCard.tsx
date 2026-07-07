import { For, type Component } from 'solid-js'
import Tag from './Tag'
import '../../styles/dvibd/FeatureCard.css'

interface TagDef {
  label: string
  color: string
}

interface FeatureCardProps {
  iconLetter: string
  iconBg: string
  title: string
  description: string
  tags: TagDef[]
  ctaColor: string
  ctaTextColor: string
}

const FeatureCard: Component<FeatureCardProps> = (props) => {
  return (
    <article class="feature-card">
      <div class="feature-card-header">
        <div
          class="feature-card-icon"
          style={{ '--icon-bg': `${props.iconBg}26` } as Record<string, string>}
        >
          <span style={{ color: props.iconBg }}>{props.iconLetter}</span>
        </div>
        <h3 class="feature-card-title">{props.title}</h3>
      </div>
      <p class="feature-card-desc">{props.description}</p>
      <div class="feature-card-tags">
        <For each={props.tags}>
          {(tag) => <Tag label={tag.label} color={tag.color} />}
        </For>
      </div>
      <a
        href="#"
        class="feature-card-cta"
        style={{
          '--cta-bg': props.ctaColor,
          '--cta-color': props.ctaTextColor,
        } as Record<string, string>}
      >
        Learn More
      </a>
    </article>
  )
}

export default FeatureCard