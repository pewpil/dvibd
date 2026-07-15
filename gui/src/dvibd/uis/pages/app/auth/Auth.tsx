import { A } from '@solidjs/router';
import type { JSX } from 'solid-js';
import styles from '~/dvibd/styles/pages/app/auth/Auth.module.css';

type Props = {
  title: string;
  subtitle: string;
  children: JSX.Element;
  footer: JSX.Element;
};

export function AuthLayout(props: Props) {
  return (
    <div class={styles.wrap}>
      <div class={styles.card}>
        <A href="/" class={styles.logo}>
          dvibd
        </A>
        <h1 class={styles.title}>{props.title}</h1>
        <p class={styles.subtitle}>{props.subtitle}</p>
        {props.children}
        <div class={styles.footer}>{props.footer}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
