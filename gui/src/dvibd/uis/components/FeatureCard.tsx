import type { Component, JSX } from "solid-js";

import styles from "@src/dvibd/styles/components/FeatureCard.module.css";

type FeatureCardProps = {
  title: string;
  description: string;
  color: string;
  children?: JSX.Element;
};

const FeatureCard: Component<FeatureCardProps> = (props) => {
  return (
    <article
      class={styles.card}
      style={{ "--card-accent": props.color } as JSX.CSSProperties}
    >
      <span class={styles.chip}>{props.title}</span>
      <h3 class={styles.title}>{props.title}</h3>
      <p class={styles.description}>{props.description}</p>
      {props.children}
    </article>
  );
};

export default FeatureCard;
