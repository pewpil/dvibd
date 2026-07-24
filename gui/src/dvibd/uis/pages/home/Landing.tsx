import type { JSX } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import FeatureCard from "@src/dvibd/uis/components/FeatureCard";
const socialIcon = "/social.ico";
import messageIcon from "@src/dvibd/assets/message.ico";
import suiteIcon from "@src/dvibd/assets/suite.ico";
import styles from "@src/dvibd/styles/pages/home/Landing.module.css";

const features = [
  {
    name: "social",
    title: "social",
    color: "#ec4899",
    icon: socialIcon,
    tags: ["Social network", "Feeds", "Communities"],
    description: "Share moments and stay close with the people who matter.",
  },
  {
    name: "message",
    title: "message",
    color: "#06b6d4",
    icon: messageIcon,
    tags: ["Messaging app", "Private chats", "Group rooms"],
    description: "Fast, private conversations in dvibd's communication app.",
  },
  {
    name: "suite",
    title: "suite",
    color: "#22c55e",
    icon: suiteIcon,
    tags: ["Productivity suite", "Notes", "Cloud", "Email", "Docs"],
    description:
      "Notes, cloud, email, and docs — separate apps, one workspace. Coming soon.",
  },
];

function Landing(): JSX.Element {
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
              icon={feature.icon}
              tags={feature.tags}
            >
              <div class={styles.cardActions}>
                <Button variant="ghost" href={`#${feature.name}`}>
                  Learn more
                </Button>
                {feature.name === "suite" ? (
                  <Button variant="primary" href="#get-started" disabled>
                    Coming soon
                  </Button>
                ) : (
                  <Button variant="primary" href={feature.name === "social" ? "/social" : "/auth/signup"}>
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
    </main>
  );
}

export default Landing;
