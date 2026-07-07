import type { Component } from "solid-js";
import NavBar from "./components/NavBar";
import FeatureCard from "./components/FeatureCard";
import ProductivityCard from "./components/ProductivityCard";
import "./App.css";

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
    <>
      <NavBar />

      <section class="hero">
        <h1 class="hero-heading">dvibd</h1>
        <p class="hero-tagline">Connect. Create. Communicate.</p>
        <p class="hero-subtitle">
          Adipiscing elit sed do eiusmod tempor incididunt.
        </p>
        <a href="#" class="hero-cta">Sign Up</a>
      </section>

      <section class="products">
        <h2 class="section-heading">Our Products</h2>
        <div class="cards-row">
          <FeatureCard
            iconLetter="S"
            iconBg="#6c63ff"
            title="social"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor."
            tags={socialTags}
            ctaColor="#6c63ff"
            ctaTextColor="#ffffff"
          />
          <FeatureCard
            iconLetter="M"
            iconBg="#00c9a7"
            title="message"
            description="Ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim."
            tags={messageTags}
            ctaColor="#00c9a7"
            ctaTextColor="#0d0d12"
          />
        </div>
      </section>

      <section class="productivity">
        <h2 class="section-heading">Coming Soon</h2>
        <ProductivityCard
          iconLetter="P"
          iconColor="#ff6b6b"
          title="Productivity suite placeholder title."
          description="Dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
      </section>
    </>
  );
};

export default App;

