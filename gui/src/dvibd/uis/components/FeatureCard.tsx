import { For, Show, type JSX } from "solid-js";

import Tag from "@src/dvibd/uis/components/Tag";
import styles from "@src/dvibd/styles/components/FeatureCard.module.css";

type FeatureCardProps = {
  title: string;
  description: string;
  color: string;
  icon?: string;
  tags?: string[];
  children?: JSX.Element;
};

function FeatureCard(props: FeatureCardProps): JSX.Element {
  return (
    <article
      class={styles.card}
      style={{ "--card-accent": props.color } as JSX.CSSProperties}
    >
      <Show when={props.icon}>
        <img class={styles.icon} src={props.icon!} alt={`${props.title} icon`} />
      </Show>
      <h3 class={styles.title}>{props.title}</h3>
      <p class={styles.description}>{props.description}</p>
      <Show when={props.tags && props.tags.length > 0}>
        <div class={styles.tags}>
          <For each={props.tags!}>{(tag) => <Tag label={tag} />}</For>
        </div>
      </Show>
      {props.children}
    </article>
  );
}

export default FeatureCard;
