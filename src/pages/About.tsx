import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { Action } from '../components/Action';
import { Icon } from '../components/Icon';
import styles from './About.module.css';

const values = [
  {
    color: 'purple' as const,
    title: 'People over metrics',
    text: 'We optimize for calm and connection, not time-on-app or ad impressions.',
  },
  {
    color: 'teal' as const,
    title: 'Private by default',
    text: 'Your messages and moments are yours. Encryption and minimal data collection are the baseline.',
  },
  {
    color: 'coral' as const,
    title: 'Small and focused',
    text: 'A few tools that work well together beat a sprawling suite you never finish setting up.',
  },
];

const stats = [
  { value: '3', label: 'Connected products' },
  { value: 'E2E', label: 'Encrypted messaging' },
  { value: '0', label: 'Ads in your feed' },
  { value: '1', label: 'Account for everything' },
];

export default function About() {
  return (
    <div class={styles.page}>
      <section class={`container ${styles.hero}`}>
        <span class={styles.eyebrow}>About dvibd</span>
        <h1 class={styles.title}>
          A social network built for <span class={styles.accent}>people</span>,
          not engagement.
        </h1>
        <p class={styles.lead}>
          dvibd is a social networking company on a simple mission: give people a
          calm, private place to connect, talk, and get things done — without the
          noise of the feed-industrial complex.
        </p>
      </section>

      <section class={`container ${styles.stats}`}>
        <For each={stats}>
          {(s) => (
            <div class={styles.stat}>
              <span class={styles.statValue}>{s.value}</span>
              <span class={styles.statLabel}>{s.label}</span>
            </div>
          )}
        </For>
      </section>

      <section class={`container ${styles.values}`}>
        <h2 class={styles.h2}>What we believe</h2>
        <div class={styles.grid}>
          <For each={values}>
            {(v) => (
              <article class={`${styles.value} ${styles[v.color]}`}>
                <div class={styles.iconWrap}>
                  <Icon name="check" size={22} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class={styles.cta}>
        <div class={`container ${styles.ctaInner}`}>
          <h2>We’re just getting started.</h2>
          <p>Help us shape dvibd from the ground up.</p>
          <div class={styles.actions}>
            <Action href="/contact" variant="primary" color="purple">
              Get in touch
            </Action>
            <A href="/products" class={styles.link}>
              See the products <Icon name="arrow" size={18} />
            </A>
          </div>
        </div>
      </section>
    </div>
  );
}
