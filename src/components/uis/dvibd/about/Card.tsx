import type { Component } from 'solid-js';
import style from '../../../styles/dvibd/about/Card.module.css';

interface CardProps {
  letter: string;
  accent: string;
  title: string;
  description: string;
}

const Card: Component<CardProps> = (props) => {
  return (
    <article class={style.card}>
      <div
        class={style.icon}
        style={{ background: `${props.accent}26` }}
      >
        <span class={style.letter} style={{ color: props.accent }}>
          {props.letter}
        </span>
      </div>
      <h3 class={style.title}>{props.title}</h3>
      <p class={style.description}>{props.description}</p>
    </article>
  );
};

export default Card;
