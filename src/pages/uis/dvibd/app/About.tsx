import { For, type Component } from 'solid-js';
import style from '../../../styles/dvibd/app/About.module.css';

const About: Component = () => {
  const values = [
    {
      id: 'connect',
      letter: 'C',
      accent: '#6c63ff',
      title: 'Connect',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lorem ipsum dolor.',
    },
    {
      id: 'create',
      letter: 'C',
      accent: '#00c9a7',
      title: 'Create',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lorem ipsum dolor.',
    },
    {
      id: 'trust',
      letter: 'T',
      accent: '#ff6b6b',
      title: 'Trust',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lorem ipsum dolor.',
    },
  ];

  const contacts = [
    { label: 'Email', value: 'hello@dvibd.com' },
    { label: 'Location', value: 'San Francisco, California' },
    { label: 'Follow', value: '@dvibd on social' },
  ];

  return (
    <div class={style.about}>
      {/* ── About Hero ── */}
      <section class={style.hero}>
        <h1 class={style.heroHeading}>About dvibd</h1>
        <p class={style.heroSubtitle}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.
        </p>
      </section>

      {/* ── Our Story ── */}
      <section class={style.section}>
        <span class={style.sectionLabel}>Our Story</span>
        <p class={style.storyText}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua lorem ipsum dolor
          sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua lorem ipsum dolor sit amet consectetur
          adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua lorem ipsum dolor.
        </p>
      </section>

      {/* ── What We Believe ── */}
      <section class={style.section}>
        <span class={style.sectionLabel}>What We Believe</span>
        <div class={style.valuesRow}>
          <For each={values}>
            {(v) => (
              <article class={style.valueCard}>
                <div
                  class={style.valueIcon}
                  style={{ background: `${v.accent}26` }}
                >
                  <span class={style.valueLetter} style={{ color: v.accent }}>
                    {v.letter}
                  </span>
                </div>
                <h3 class={style.valueTitle}>{v.title}</h3>
                <p class={style.valueDesc}>{v.description}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      {/* ── Get In Touch ── */}
      <section class={style.section}>
        <span class={style.sectionLabel}>Get In Touch</span>
        <div class={style.contactCard}>
          <For each={contacts}>
            {(c) => (
              <div class={style.contactItem}>
                <span class={style.contactLabel}>{c.label}</span>
                <span class={style.contactValue}>{c.value}</span>
              </div>
            )}
          </For>
        </div>
      </section>
    </div>
  );
};

export default About;
