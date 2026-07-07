import type { Component } from 'solid-js'
import s from '../styles/Tag.module.css'

interface TagProps {
  label: string
  color: string
}

const Tag: Component<TagProps> = (props) => {
  return (
    <span
      class={s.tag}
      style={{
        '--tag-bg': `${props.color}1a`,
        '--tag-color': props.color,
      } as Record<string, string>}
    >
      {props.label}
    </span>
  )
}

export default Tag
