import type { JSX } from "solid-js";

import Nav from "@src/social/uis/components/Nav";
import Panel from "@src/social/uis/pages/home/Panel";
import styles from "@src/social/styles/pages/home/Home.module.css";

function Home(props: { children?: JSX.Element }): JSX.Element {
  return (
    <div class={styles.home}>
      <div class={styles.left}>
        <Nav />
      </div>
      <div class={styles.center}>{props.children}</div>
      <div class={styles.right}>
        <Panel />
      </div>
    </div>
  );
}

export default Home;