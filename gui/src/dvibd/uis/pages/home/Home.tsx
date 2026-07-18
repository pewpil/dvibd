import type { Component } from "solid-js";

import styles from "@src/dvibd/styles/pages/home/Home.module.css";

import Landing from "./Landing";

const Home: Component = () => {
  return (
    <div class={styles.home}>
      <Landing />
    </div>
  );
};

export default Home;
