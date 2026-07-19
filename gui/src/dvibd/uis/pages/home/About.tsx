import type { Component } from "solid-js";
import { A } from "@solidjs/router";

import styles from "@src/dvibd/styles/pages/home/About.module.css";

const values = [
  {
    title: "People first",
    description:
      "Everything we build starts with how it helps people connect and belong.",
  },
  {
    title: "One workspace",
    description:
      "Social, message, and productivity tools that work better together.",
  },
  {
    title: "Built to last",
    description:
      "A calm, reliable home for your conversations, memories, and work.",
  },
];

const About: Component = () => {
  return (
    <main class={styles.about}>
      <section class={styles.hero}>
        <span class={styles.badge}>About dvibd</span>
        <h1 class={styles.title}>
          We build the place where <span class={styles.titleAccent}>people</span>{" "}
          stay close.
        </h1>
        <p class={styles.lead}>
          dvibd is a social networking company. We make social — dvibd's social
          media — and message — dvibd's communication chat app. We also serve
          productivity tools such as note taking, cloud, email, and document
          editing, all designed to fit into one connected workspace.
        </p>
      </section>

      <section class={styles.values}>
        <div class={styles.valuesGrid}>
          {values.map((value) => (
            <article class={styles.valueCard}>
              <h3 class={styles.valueTitle}>{value.title}</h3>
              <p class={styles.valueText}>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section class={styles.cta}>
        <h2 class={styles.ctaTitle}>Come build with us.</h2>
        <p class={styles.ctaText}>
          Explore dvibd and see how social, message, and productivity come
          together.
        </p>
        <A class={styles.ctaLink} href="/">
          Back to home
        </A>
      </section>
    </main>
  );
};

export default About;
