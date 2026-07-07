import type { Component } from 'solid-js';
import style from '../../../styles/dvibd/app/Home.module.css';
import Action from '@components/uis/dvibd/Action';
import FeatureCardA from '@components/uis/dvibd/FeatureCardA';
import FeatureCardB from '@components/uis/dvibd/FeatureCardB';

const Home: Component = () => {
  return (
    <div class={style.home}>
      {/* ── Hero ── */}
      <section class={style.hero}>
        <h1 class={style.heroHeading}>dvibd</h1>
        <p class={style.tagline}>Connect. Create. Communicate.</p>
        <p class={style.subtitle}>
          Adipiscing elit sed do eiusmod tempor incididunt.
        </p>
        <Action
          bgColor="#6c63ff"
          textColor="#ffffff"
          href="/signup"
          radius={24}
        >
          Create free account
        </Action>
      </section>

      {/* ── Products Preview ── */}
      <section class={style.section}>
        <h2 class={style.sectionHeading}>Our Products</h2>
        <div class={style.cardsRow}>
          <FeatureCardA
            iconLetter="S"
            iconBg="#6c63ff"
            title="social"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor."
            tags={[
              { label: 'Photo Sharing', color: '#6c63ff' },
              { label: 'Stories', color: '#6c63ff' },
              { label: 'Video Calls', color: '#6c63ff' },
            ]}
            ctaLabel="Learn More"
            ctaBg="#6c63ff"
            ctaText="#ffffff"
            ctaHref="/"
          />
          <FeatureCardA
            iconLetter="M"
            iconBg="#00c9a7"
            title="message"
            description="Ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim."
            tags={[
              { label: 'End-to-End Encrypted', color: '#00c9a7' },
              { label: 'Group Chats', color: '#00c9a7' },
              { label: 'Media Sharing', color: '#00c9a7' },
            ]}
            ctaLabel="Learn More"
            ctaBg="#00c9a7"
            ctaText="#0d0d12"
            ctaHref="/"
          />
        </div>
      </section>

      {/* ── Productivity / Coming Soon ── */}
      <section class={style.section}>
        <h2 class={style.sectionHeading}>Coming Soon</h2>
        <FeatureCardB
          iconLetter="P"
          iconBg="#ff6b6b"
          title="Productivity suite placeholder title."
        >
          Dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </FeatureCardB>
      </section>
    </div>
  );
};

export default Home;
