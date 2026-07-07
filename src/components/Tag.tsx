import type { Component } from 'solid-js'
import './Tag.css'

interface TagProps {
  label: string
  color: string
}

const Tag: Component<TagProps> = (props) => {
  return (
    <span
      class="tag"
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