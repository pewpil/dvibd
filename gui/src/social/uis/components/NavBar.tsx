import type { JSX } from 'solid-js';
import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { User } from 'lucide-solid';
import { Icon, type IconName } from '~/social/uis/components/Icon';
import { isAuthenticated, currentUser, logout } from '~/social/auth';
import styles from '~/social/styles/components/NavBar.module.css';

const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/explore', label: 'Explore', icon: 'compass' },
  { href: '/profile', label: 'Profile', icon: 'user' },
];

export function NavBar(): JSX.Element {
  return (
    <aside class={styles.sidebar}>
      <A href="/" class={styles.logo} aria-label="social home">
        <Icon name="social" size={22} />
      </A>

      <nav class={styles.nav}>
        <For each={links}>
          {(link) => (
            <A
              href={link.href}
              class={styles.link}
              title={link.label}
              aria-label={link.label}
              end={link.href === '/'}
            >
              <Icon name={link.icon} size={22} />
            </A>
          )}
        </For>
      </nav>

      <div class={styles.bottom}>
        {isAuthenticated() ? (
          <button class={styles.avatar} title="Log out" aria-label="Log out" onClick={() => logout()}>
            <User size={18} />
            <span class={styles.tip}>{currentUser()?.username ?? 'Log out'}</span>
          </button>
        ) : (
          <A href="/login" class={styles.link} title="Log in" aria-label="Log in">
            <Icon name="logout" size={22} />
          </A>
        )}
      </div>
    </aside>
  );
}
