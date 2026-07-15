import { For } from 'solid-js';
import { A } from '@solidjs/router';
import { Action } from '~/dvibd/uis/components/Action';
import { FeatureCard } from '~/dvibd/uis/components/FeatureCard';
import { Icon } from '~/dvibd/uis/components/Icon';
import styles from '~/dvibd/styles/pages/app/Home.module.css';

const highlights = [
  { color: 'purple' as const, text: 'Share photos, stories & live moments' },
  { color: 'teal' as const, text: 'Private, end-to-end encrypted chats' },
  { color: 'coral' as const, text: 'Plan & focus with connected tools' },
];

export default function Home() {
  return (
    <div>
      <section class={styles.hero}>
        <div class={styles.glow} aria-hidden="true" />
        <div class={`container ${styles.heroInner}`}>
          <span class={styles.badge}>New · Now in open beta</span>
          <h1 class={styles.title}>
            Connect. Share. <span class={styles.accent}>Belong.</span>
          </h1>
          <p class={styles.subtitle}>
            dvibd brings your social life, messages, and work into one calm,
            private space built around the people who matter most.
          </p>
          <div class={styles.actions}>
            <Action href="/contact" variant="primary" color="purple">
              Get Started
            </Action>
            <Action href="/products" variant="secondary">
              Explore Products
            </Action>
          </div>

          <ul class={styles.highlights}>
            <For each={highlights}>
              {(item) => (
                <li class={`${styles.highlight} ${styles[item.color]}`}>
                  <Icon name="check" size={18} />
                  <span>{item.text}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </section>

      <section class={styles.section}>
        <div class="container">
          <div class={styles.sectionHead}>
            <h2 class={styles.sectionTitle}>Everything in one place</h2>
            <p class={styles.sectionSub}>
              Three connected products, one account. Switch between them without
              losing the thread.
            </p>
          </div>

          <div class={styles.grid}>
            <FeatureCard
              color="purple"
              icon="social"
              title="Social"
              href="/products"
              description="Photo sharing, stories, and live video calls with the people you actually care about."
            />
            <FeatureCard
              color="teal"
              icon="message"
              title="Message"
              href="/products"
              description="End-to-end encrypted messaging, group chats, and seamless media sharing."
            />
            <FeatureCard
              color="coral"
              icon="productivity"
              title="Productivity"
              href="/products"
              cta="Coming soon"
              description="Calm planning and focus tools that connect your conversations to your day."
            />
          </div>
        </div>
      </section>

      <section class={styles.cta}>
        <div class={`container ${styles.ctaInner}`}>
          <h2 class={styles.ctaTitle}>Ready to feel at home online?</h2>
          <p class={styles.ctaSub}>
            Join the open beta and help shape a social network built for people,
            not engagement metrics.
          </p>
          <A href="/contact" class={styles.ctaLink}>
            Request early access <Icon name="arrow" size={18} />
          </A>
        </div>
      </section>
    </div>
  );
}
