import { A } from '@solidjs/router';
import { Icon, type IconName } from '~/dvibd/uis/components/Icon';
import styles from '~/dvibd/styles/components/FeatureCard.module.css';

type Props = {
  title: string;
  description: string;
  color: 'purple' | 'teal' | 'coral';
  icon: IconName;
  href: string;
  cta?: string;
};

export function FeatureCard(props: Props) {
  return (
    <article class={`${styles.card} ${styles[props.color]}`}>
      <div class={styles.iconWrap}>
        <Icon name={props.icon} size={26} />
      </div>
      <h3 class={styles.title}>{props.title}</h3>
      <p class={styles.desc}>{props.description}</p>
      <A href={props.href} class={styles.link}>
        {props.cta ?? 'Learn more'} <Icon name="arrow" size={16} />
      </A>
    </article>
  );
}
