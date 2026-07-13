import { A } from '@solidjs/router';
import type { JSX } from 'solid-js';
import styles from './Action.module.css';

type Props = {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  color?: 'purple' | 'teal' | 'coral';
  submit?: boolean;
  onClick?: () => void;
  children: JSX.Element;
};

export function Action(props: Props) {
  const classes = () => {
    const variant = props.variant ?? 'primary';
    const color = props.color ?? 'purple';
    return `${styles.action} ${styles[variant]} ${styles[color]}`;
  };

  const content = <span class={styles.inner}>{props.children}</span>;

  return props.href ? (
    <A href={props.href} class={classes()} onClick={props.onClick}>
      {content}
    </A>
  ) : (
    <button
      type={props.submit ? 'submit' : 'button'}
      class={classes()}
      onClick={props.onClick}
    >
      {content}
    </button>
  );
}
