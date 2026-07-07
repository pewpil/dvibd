import { For, type Component } from "solid-js";
import style from "../../../styles/dvibd/app/Products.module.css";
import FeatureCardA from "@components/uis/dvibd/FeatureCardA";
import FeatureCardB from "@components/uis/dvibd/FeatureCardB";

const Products: Component = () => {
  const socialFeatures = [
    {
      title: "Photo & Video Sharing",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
    },
    {
      title: "Stories & Reels",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    },
    {
      title: "Communities & Groups",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.",
    },
    {
      title: "Discover Feed",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
    },
  ];

  const messageFeatures = [
    {
      title: "End-to-End Encrypted",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna.",
    },
    {
      title: "Group Chats",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et.",
    },
    {
      title: "Voice & Video Calls",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.",
    },
    {
      title: "Media & File Sharing",
      desc: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
    },
  ];

  return (
    <div class={style.products}>
      {/* ── Product Hero ── */}
      <section class={style.hero}>
        <h1 class={style.heroHeading}>Our Products</h1>
        <p class={style.heroSubtitle}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
      </section>

      {/* ── Social Section ── */}
      <section class={style.section}>
        <span class={style.sectionLabel} style={{ color: "#6c63ff" }}>
          social
        </span>
        <div class={style.sectionContent}>
          <FeatureCardA
            iconLetter="S"
            iconBg="#6c63ff"
            title="social"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua lorem ipsum."
            tags={[
              { label: "Photo Sharing", color: "#6c63ff" },
              { label: "Stories", color: "#6c63ff" },
              { label: "Video Calls", color: "#6c63ff" },
            ]}
            ctaLabel="Learn More"
            ctaBg="#6c63ff"
            ctaText="#ffffff"
            ctaHref="/"
          />
          <div class={style.featuresCard}>
            <h3 class={style.featuresHeading}>Key Features</h3>
            <For each={socialFeatures}>
              {(item) => (
                <div class={style.featureItem}>
                  <span class={style.featureTitle} style={{ color: "#6c63ff" }}>
                    {item.title}
                  </span>
                  <p class={style.featureDesc}>{item.desc}</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* ── Message Section ── */}
      <section class={style.section}>
        <span class={style.sectionLabel} style={{ color: "#00c9a7" }}>
          message
        </span>
        <div class={style.sectionContent}>
          <div class={style.featuresCard}>
            <h3 class={style.featuresHeading}>Key Features</h3>
            <For each={messageFeatures}>
              {(item) => (
                <div class={style.featureItem}>
                  <span class={style.featureTitle} style={{ color: "#00c9a7" }}>
                    {item.title}
                  </span>
                  <p class={style.featureDesc}>{item.desc}</p>
                </div>
              )}
            </For>
          </div>
          <FeatureCardA
            iconLetter="M"
            iconBg="#00c9a7"
            title="message"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            tags={[
              { label: "End-to-End Encrypted", color: "#00c9a7" },
              { label: "Group Chats", color: "#00c9a7" },
              { label: "Media Sharing", color: "#00c9a7" },
            ]}
            ctaLabel="Learn More"
            ctaBg="#00c9a7"
            ctaText="#0d0d12"
            ctaHref="/"
          />
        </div>
      </section>

      {/* ── Coming Soon Section ── */}
      <section class={style.section} style={{ padding: "75px 107px" }}>
        <span class={style.sectionLabel} style={{ color: "#ff6b6b" }}>
          Coming Soon
        </span>
        <FeatureCardB
          iconLetter="P"
          iconBg="#ff6b6b"
          title="dvibd productivity suite — work smarter"
        >
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua lorem.
        </FeatureCardB>
      </section>
    </div>
  );
};

export default Products;
