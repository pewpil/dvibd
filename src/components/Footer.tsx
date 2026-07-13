import { A } from '@solidjs/router';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer class={styles.footer}>
      <div class={`container ${styles.top}`}>
        <div class={styles.brand}>
          <span class={styles.logo}>dvibd</span>
          <p class={styles.tag}>Social, reimagined — one calm, private space.</p>
        </div>

        <div class={styles.columns}>
          <div class={styles.col}>
            <span class={styles.colTitle}>Product</span>
            <A href="/products" class={styles.fLink}>
              Products
            </A>
            <A href="/products" class={styles.fLink}>
              Social
            </A>
            <A href="/products" class={styles.fLink}>
              Message
            </A>
          </div>
          <div class={styles.col}>
            <span class={styles.colTitle}>Company</span>
            <A href="/about" class={styles.fLink}>
              About
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
