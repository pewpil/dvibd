import type { JSX } from 'solid-js';
import { A } from '@solidjs/router';
import { User } from 'lucide-solid';
import { Action } from '~/dvibd/uis/components/Action';
import { isAuthenticated, currentUser, logout } from '~/dvibd/auth';
import styles from '~/dvibd/styles/components/NavBar.module.css';

export function NavBar(): JSX.Element {
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

        <div class={styles.auth}>
          {isAuthenticated() ? (
            <>
              <div class={styles.avatar} aria-hidden="true">
                <User size={18} />
              </div>
              <span class={styles.username}>{currentUser()?.username ?? 'Account'}</span>
              <Action variant="ghost" color="purple" onClick={() => logout()}>
                Log out
              </Action>
            </>
          ) : (
            <>
              <Action href="/login" variant="ghost" color="purple">
                Log in
              </Action>
              <Action href="/signup" variant="primary" color="purple">
                Sign up
              </Action>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
