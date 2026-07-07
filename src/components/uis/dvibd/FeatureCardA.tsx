import { For, type Component } from 'solid-js';
import style from '../../styles/dvibd/FeatureCardA.module.css';
import Action from './Action';
import Tag from './featureCardA/Tag';

interface TagDef {
  label: string;
  color: string;
}

interface FeatureCardAProps {
  iconLetter: string;
  iconBg: string;
  title: string;
  description: string;
  tags: TagDef[];
  ctaLabel: string;
  ctaBg: string;
  ctaText: string;
  ctaHref: string;
}

const FeatureCardA: Component<FeatureCardAProps> = (props) => {
  return (
    <article class={style.card}>
      <div class={style.header}>
        <div
          class={style.icon}
          style={{ background: `${props.iconBg}26` }}
        >
          <span class={style.letter} style={{ color: props.iconBg }}>
            {props.iconLetter}
          </span>
        </div>
        <h3 class={style.title}>{props.title}</h3>
      </div>

      <p class={style.description}>{props.description}</p>

      <div class={style.tags}>
        <For each={props.tags}>
          {(tag) => <Tag label={tag.label} color={tag.color} />}
        </For>
      </div>

      <Action
        bgColor={props.ctaBg}
        textColor={props.ctaText}
        href={props.ctaHref}
        radius={18}
      >
        {props.ctaLabel}
      </Action>
    </article>
  );
};

export default FeatureCardA;
