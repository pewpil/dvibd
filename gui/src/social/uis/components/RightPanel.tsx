import type { JSX } from 'solid-js';
import { For } from 'solid-js';
import { Icon, type IconName } from '~/social/uis/components/Icon';
import type { Color } from '~/social/types';
import styles from '~/social/styles/components/RightPanel.module.css';

const tags: { tag: string; color: Color; posts: string }[] = [
  { tag: '#calmtech', color: 'purple', posts: '1.2k' },
  { tag: '#microblog', color: 'teal', posts: '840' },
  { tag: '#buildinpublic', color: 'coral', posts: '3.5k' },
  { tag: '#quietinternet', color: 'purple', posts: '610' },
];

const suggestions: { username: string; bio: string; color: Color; icon: IconName }[] = [
  { username: 'ada', bio: 'Writing things down. Calm by default.', color: 'purple', icon: 'user' },
  { username: 'lin', bio: 'Anti-engagement-maxxing.', color: 'teal', icon: 'user' },
  { username: 'grace', bio: 'Quiet rooms with good light.', color: 'coral', icon: 'user' },
];

export function RightPanel(): JSX.Element {
  return (
    <aside class={styles.panel}>
      <section class={styles.card}>
        <h2 class={styles.h2}>Trending</h2>
        <For each={tags}>
          {(t) => (
            <div class={`${styles.tag} ${styles[t.color]}`}>
              <span class={styles.tagName}>{t.tag}</span>
              <span class={styles.tagCount}>{t.posts} posts</span>
            </div>
          )}
        </For>
      </section>

      <section class={styles.card}>
        <h2 class={styles.h2}>Who to follow</h2>
        <For each={suggestions}>
          {(s) => (
            <div class={styles.person}>
              <div class={`${styles.pAvatar} ${styles[s.color]}`}>
                <Icon name={s.icon} size={18} />
              </div>
              <div class={styles.pBody}>
                <span class={styles.pName}>@{s.username}</span>
                <span class={styles.pBio}>{s.bio}</span>
              </div>
              <button class={styles.follow}>Follow</button>
            </div>
          )}
        </For>
      </section>
    </aside>
  );
}
