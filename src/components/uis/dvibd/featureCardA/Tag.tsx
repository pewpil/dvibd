import type { Component } from 'solid-js';
import style from '../../../styles/dvibd/featureCardA/Tag.module.css';

interface TagProps {
  label: string;
  color: string;
}

const Tag: Component<TagProps> = (props) => {
  return (
    <span
      class={style.tag}
      style={{
        background: `${props.color}1a`,
        color: props.color,
      }}
    >
      {props.label}
    </span>
  );
};

export default Tag;
