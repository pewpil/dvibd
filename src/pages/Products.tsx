import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { Action } from '../components/Action';
import { Icon } from '../components/Icon';
import styles from './Products.module.css';

const products = [
  {
    color: 'purple' as const,
    icon: 'social' as const,
    name: 'Social',
    tagline: 'Your corner of the internet',
    description:
      'Share photos, post stories, and hop into live video calls with the people you actually care about. No algorithms deciding what you see — just your people, in order.',
    points: [
      'Photo & album sharing',
      'Ephemeral and saved stories',
      'Live video rooms',
      'Chronological, ad-free feed',
    ],
  },
  {
    color: 'teal' as const,
    icon: 'message' as const,
    name: 'Message',
    tagline: 'Private by default',
    description:
      'End-to-end encrypted chats, group conversations, and media sharing that never leaves your control. Fast, quiet, and built for real talk.',
    points: [
      'End-to-end encryption',
      'Groups & broadcasts',
      'Rich media sharing',
      'Cross-device sync',
    ],
  },
  {
    color: 'coral' as const,
    icon: 'productivity' as const,
    name: 'Productivity',
    tagline: 'Coming soon',
    description:
      'Calm planning and focus tools that connect your conversations to your day. Turn a message into a task without leaving the thread.',
    points: [
      'Shared calendars',
      'Focus sessions',
      'Task from any chat',
      'Quiet by design',
    ],
  },
];

export default function Products() {
  return (
    <div class={styles.page}>
      <section class={`container ${styles.head}`}>
        <span class={styles.eyebrow}>Products</span>
        <h1 class={styles.title}>One account, three connected products</h1>
        <p class={styles.lead}>
          dvibd is a small set of tools that work together so you can spend less
          time switching apps and more time with people.
        </p>
      </section>

      <div class="container">
        <For each={products}>
          {(p, i) => (
            <article class={`${styles.product} ${styles[p.color]}`}>
              <div class={styles.media}>
                <div class={styles.iconWrap}>
                  <Icon name={p.icon} size={34} />
                </div>
                <span class={styles.index}>0{i() + 1}</span>
              </div>

              <div class={styles.body}>
                <span class={styles.tagline}>{p.tagline}</span>
                <h2 class={styles.name}>{p.name}</h2>
                <p class={styles.desc}>{p.description}</p>
                <ul class={styles.points}>
                  <For each={p.points}>
                    {(pt) => (
                      <li>
                        <Icon name="check" size={18} />
                        <span>{pt}</span>
                      </li>
                    )}
                  </For>
                </ul>
                <div class={styles.actions}>
                  {p.color === 'coral' ? (
                    <Action href="/contact" variant="secondary" color="coral">
                      Notify me
                    </Action>
                  ) : (
                    <Action href="/contact" variant="primary" color={p.color}>
                      Get {p.name}
                    </Action>
                  )}
                </div>
              </div>
            </article>
          )}
        </For>
      </div>

      <section class={styles.foot}>
        <div class={`container ${styles.footInner}`}>
          <h2>Not sure where to start?</h2>
          <p>Begin with Social and Message — they work best together.</p>
          <A href="/contact" class={styles.footLink}>
            Talk to us <Icon name="arrow" size={18} />
          </A>
        </div>
      </section>
    </div>
  );
}
