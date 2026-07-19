import type { Component, JSX } from "solid-js";

import NavBar from "@src/dvibd/uis/components/NavBar";
import Footer from "@src/dvibd/uis/components/Footer";
import styles from "@src/dvibd/styles/pages/home/Home.module.css";

import Landing from "./Landing";

const Home: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <div class={styles.home}>
      <NavBar />
      {props.children ?? <Landing />}
      <Footer />
    </div>
  );
};

export default Home;
