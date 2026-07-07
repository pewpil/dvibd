import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import NavBar from "../../../components/dvibd/ui/NavBar";
import FeatureCard from "../../../components/dvibd/ui/FeatureCard";
import ProductivityCard from "../../../components/dvibd/ui/ProductivityCard";
import s from "../styles/App.module.css";

const socialTags = [
  { label: "Photo Sharing", color: "#6c63ff" },
  { label: "Stories", color: "#6c63ff" },
  { label: "Video Calls", color: "#6c63ff" },
];

const messageTags = [
  { label: "End-to-End Encrypted", color: "#00c9a7" },
  { label: "Group Chats", color: "#00c9a7" },
  { label: "Media Sharing", color: "#00c9a7" },
];

const App: Component = () => {
  return (
    <div class={s.app}>
      <NavBar />

      <section class={s.hero}>
        <h1 class={s.heading}>dvibd</h1>
        <p class={s.tagline}>Connect. Create. Communicate.</p>
        <p class={s.subtitle}>
          Adipiscing elit sed do eiusmod tempor incididunt.
        </p>
        <A href="/signup" class={s.heroCta}>
          Create free account
        </A>
      </section>

      <section class={s.products}>
        <h2 class={s.sectionHeading}>Our Products</h2>
        <div class={s.cardsRow}>
          <FeatureCard
            iconLetter="S"
            iconBg="#6c63ff"
            title="social"
            tags={socialTags}
            ctaColor="#6c63ff"
            ctaTextColor="#ffffff"
          >
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
            eiusmod tempor.
          </FeatureCard>
          <FeatureCard
            iconLetter="M"
            iconBg="#00c9a7"
            title="message"
            tags={messageTags}
            ctaColor="#00c9a7"
            ctaTextColor="#0d0d12"
          >
            Ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua ut enim.
          </FeatureCard>
        </div>
      </section>

      <section class={s.productivity}>
        <h2 class={s.sectionHeading}>Coming Soon</h2>
        <ProductivityCard
          iconLetter="P"
          iconColor="#ff6b6b"
          title="Productivity suite placeholder title."
        >
          Dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </ProductivityCard>
      </section>
    </div>
  );
};

export default App;
