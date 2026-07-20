import { For, type JSX } from "solid-js";
import { A } from "@solidjs/router";

import Tag from "@src/dvibd/uis/components/Tag";

import Button from "@src/dvibd/uis/components/Button";
import socialIcon from "@src/dvibd/assets/social.ico";
import messageIcon from "@src/dvibd/assets/message.ico";
import suiteIcon from "@src/dvibd/assets/suite.ico";
import styles from "@src/dvibd/styles/pages/home/Products.module.css";

const products = [
  {
    name: "social",
    title: "social",
    color: "#ec4899",
    icon: socialIcon,
    tags: ["Social network", "Feeds", "Communities"],
    tagline: "Your world, shared.",
    description:
      "social is dvibd's social media — a calm, people-first feed where you share moments, post updates, and follow the communities you care about. No noise, no pressure, just the people who matter.",
    features: [
      "Post photos, short updates, and longer stories",
      "Curated, chronological feed — no engagement bait",
      "Close-friends circles and interest communities",
      "Cross-posts seamlessly into message",
    ],
    status: "available",
    cta: "Open social",
    href: "/auth/signup",
  },
  {
    name: "message",
    title: "message",
    color: "#06b6d4",
    icon: messageIcon,
    tags: ["Messaging app", "Private chats", "Group rooms"],
    tagline: "Talk that keeps up with you.",
    description:
      "message is dvibd's communication chat app — fast, private, and built for real conversation. One-to-one chats, group rooms, and shared spaces that connect straight to your social and productivity work.",
    features: [
      "End-to-end encrypted one-to-one and group chats",
      "Persistent rooms for teams, families, and events",
      "Rich media, voice notes, and screen sharing",
      "Jump from a social post into a live conversation",
    ],
    status: "available",
    cta: "Open message",
    href: "/auth/signup",
  },
  {
    name: "suite",
    title: "suite",
    color: "#22c55e",
    icon: suiteIcon,
    tags: ["Productivity suite", "Notes", "Cloud", "Email", "Docs"],
    tagline: "Everything in one workspace.",
    description:
      "suite brings your work life into dvibd — notes, cloud storage, email, and document editing as separate apps that share one connected workspace. Draft a note, attach a file from the cloud, and send it by email without leaving dvibd.",
    features: [
      "Notes: capture and organize ideas instantly",
      "Cloud: secure storage for every file you create",
      "Email: a focused inbox wired to your workspace",
      "Docs: real-time collaborative document editing",
    ],
    status: "soon",
    cta: "Coming soon",
    href: "#get-started",
  },
];

function Products(): JSX.Element {
  return (
    <main class={styles.products}>
      <section class={styles.hero}>
        <span class={styles.badge}>Products</span>
        <h1 class={styles.title}>
          One platform, <span class={styles.titleAccent}>many ways</span> to
          connect.
        </h1>
        <p class={styles.lead}>
          dvibd brings social, message, and productivity together. Explore what's
          ready to use today and what's coming soon.
        </p>
      </section>

      <section class={styles.list}>
        {products.map((product) => (
          <article
            class={styles.item}
            style={{ "--card-accent": product.color } as JSX.CSSProperties}
          >
            <div class={styles.itemMain}>
              <div class={styles.itemHead}>
                <img
                  class={styles.itemIcon}
                  src={product.icon}
                  alt={`${product.title} icon`}
                />
                {product.status === "soon" && (
                  <span class={styles.soon}>Coming soon</span>
                )}
              </div>
              <h2 class={styles.itemTitle}>{product.title}</h2>
              <p class={styles.itemTagline}>{product.tagline}</p>
              <div class={styles.tags}>
                <For each={product.tags}>{(tag) => <Tag label={tag} />}</For>
              </div>
              <div class={styles.itemActions}>
                <Button
                  variant="primary"
                  href={product.href}
                  disabled={product.status === "soon"}
                >
                  {product.cta}
                </Button>
              </div>
            </div>
            <div class={styles.itemDetails}>
              <p class={styles.itemText}>{product.description}</p>
              <ul class={styles.features}>
                {product.features.map((feature) => (
                  <li class={styles.feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section id="get-started" class={styles.cta}>
        <h2 class={styles.ctaTitle}>Ready to dive in?</h2>
        <p class={styles.ctaText}>
          Create an account and bring your social, messaging, and work life
          together.
        </p>
        <A class={styles.ctaLink} href="/auth/signup">
          Create your account
        </A>
      </section>
    </main>
  );
}

export default Products;
