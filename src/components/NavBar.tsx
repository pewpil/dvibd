import { A } from '@solidjs/router';
import styles from './NavBar.module.css';

export function NavBar() {
  return (
    <header class={styles.header}>
      <div class={`container ${styles.inner}`}>
        <A href="/" class={styles.logo}>
          dvibd
        </A>

        <nav class={styles.nav}>
          <A href="/" class={styles.link} end>
            Home
          </A>
          <A href="/products" class={styles.link}>
            Products
          </A>
          <A href="/about" class={styles.link}>
            About
          </A>
          <A href="/contact" class={styles.link}>
            Contact
          </A>
        </nav>

        <A href="/contact" class={styles.cta}>
          Get Started
        </A>
      </div>
    </header>
  );
}
