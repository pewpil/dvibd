import type { JSX } from 'solid-js';
import { A } from '@solidjs/router';
import styles from '~/social/styles/components/Footer.module.css';

export function Footer(): JSX.Element {
  return (
    <footer class={styles.footer}>
      <div class={`container ${styles.top}`}>
        <div class={styles.brand}>
          <span class={styles.logo}>social</span>
          <p class={styles.tag}>A calm microblog — your corner of the conversation.</p>
        </div>

        <div class={styles.columns}>
          <div class={styles.col}>
            <span class={styles.colTitle}>Social</span>
            <A href="/" class={styles.fLink}>
              Feed
            </A>
            <A href="/explore" class={styles.fLink}>
              Explore
            </A>
            <A href="/profile" class={styles.fLink}>
              Profile
            </A>
          </div>
          <div class={styles.col}>
            <span class={styles.colTitle}>Company</span>
            <A href="/about" class={styles.fLink}>
              About dvibd
            </A>
            <A href="/contact" class={styles.fLink}>
              Contact
            </A>
          </div>
        </div>
      </div>

      <div class={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} dvibd. All rights reserved.</span>
        <span class={styles.made}>Built with SolidJS</span>
      </div>
    </footer>
  );
}
