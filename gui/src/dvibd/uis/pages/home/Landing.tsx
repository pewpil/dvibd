import type { Component } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import FeatureCard from "@src/dvibd/uis/components/FeatureCard";
import styles from "@src/dvibd/styles/pages/home/Landing.module.css";

const features = [
  {
    name: "social",
    title: "social",
    color: "#ec4899",
    description: "Share moments and stay close with the people who matter.",
  },
  {
    name: "message",
    title: "message",
    color: "#06b6d4",
    description: "Fast, private conversations in dvibd's communication app.",
  },
  {
    name: "productivity",
    title: "productivity",
    color: "#22c55e",
    description:
      "Notes, cloud, email, and docs — separate apps, one workspace. Coming soon.",
  },
];

const Landing: Component = () => {
  return (
    <main class={styles.landing}>
      <section class={styles.hero}>
        <span class={styles.badge}>One platform · many ways to connect</span>
        <h1 class={styles.title}>
          Connect. Communicate. <span class={styles.titleAccent}>Create.</span>
        </h1>
        <p class={styles.tagline}>
          dvibd brings social, message, and productivity tools together so you
          can stay close to the people who matter — and get more done.
        </p>
        <div class={styles.actions}>
          <Button variant="primary" href="#get-started">
            Get started
          </Button>
          <Button variant="ghost" href="#features">
            Explore products
          </Button>
        </div>
      </section>

      <section id="features" class={styles.features}>
        <div class={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureCard
              title={feature.title}
              description={feature.description}
              color={feature.color}
            >
              <div class={styles.cardActions}>
                <Button variant="ghost" href={`#${feature.name}`}>
                  Learn more
                </Button>
                {feature.name === "productivity" ? (
                  <Button variant="primary" href="#get-started" disabled>
                    Coming soon
                  </Button>
                ) : (
                  <Button variant="primary" href={`/auth/signup`}>
                    Open app
                  </Button>
                )}
              </div>
            </FeatureCard>
          ))}
        </div>
      </section>

      <section id="get-started" class={styles.cta}>
        <h2 class={styles.ctaTitle}>Ready to join dvibd?</h2>
        <p class={styles.ctaText}>
          Create an account and bring your social, messaging, and work life
          together.
        </p>
        <Button variant="primary" href="/auth/signup">
          Create your account
        </Button>
      </section>

      <footer class={styles.footer}>
        <span class={styles.footerBrand}>dvibd</span>
        <span class={styles.footerCopy}>
          © {new Date().getFullYear()} dvibd. All rights reserved.
        </span>
      </footer>
    </main>
  );
};

export default Landing;
