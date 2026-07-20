import type { JSX } from "solid-js";

import NavBar from "@src/dvibd/uis/components/NavBar";
import Footer from "@src/dvibd/uis/components/Footer";
import styles from "@src/dvibd/styles/pages/home/Home.module.css";

import Landing from "./Landing";

function Home(props: { children?: JSX.Element }): JSX.Element {
  return (
    <div class={styles.home}>
      <NavBar />
      {props.children ?? <Landing />}
      <Footer />
    </div>
  );
}

export default Home;
