import { A } from '@solidjs/router'
import { For, type Component } from 'solid-js'
import Tag from './Tag'
import s from '../styles/FeatureCard.module.css'

interface TagDef {
  label: string
  color: string
}

interface FeatureCardProps {
  iconLetter: string
  iconBg: string
  title: string
  children: string
  tags: TagDef[]
  ctaColor: string
  ctaTextColor: string
}

const FeatureCard: Component<FeatureCardProps> = (props) => {
  return (
    <article class={s.card}>
      <div class={s.header}>
        <div
          class={s.icon}
          style={{ '--icon-bg': `${props.iconBg}26` } as Record<string, string>}
        >
          <span style={{ color: props.iconBg }}>{props.iconLetter}</span>
        </div>
        <h3 class={s.title}>{props.title}</h3>
      </div>
      <p class={s.desc}>{props.children}</p>
      <div class={s.tags}>
        <For each={props.tags}>
          {(tag) => <Tag label={tag.label} color={tag.color} />}
        </For>
      </div>
      <A
        href="/"
        class={s.cta}
        style={{
          '--cta-bg': props.ctaColor,
          '--cta-color': props.ctaTextColor,
        } as Record<string, string>}
      >
        Learn More
      </A>
    </article>
  )
}

export default FeatureCard
