import type { Component } from 'solid-js';
import style from '../../styles/dvibd/FeatureCardB.module.css';

interface FeatureCardBProps {
  iconLetter: string;
  iconBg: string;
  title: string;
  children: string;
}

const FeatureCardB: Component<FeatureCardBProps> = (props) => {
  return (
    <article class={style.card}>
      <div
        class={style.icon}
        style={{ background: `${props.iconBg}26` }}
      >
        <span class={style.letter} style={{ color: props.iconBg }}>
          {props.iconLetter}
        </span>
      </div>
      <div class={style.text}>
        <h3 class={style.title}>{props.title}</h3>
        <p class={style.description}>{props.children}</p>
      </div>
    </article>
  );
};

export default FeatureCardB;
