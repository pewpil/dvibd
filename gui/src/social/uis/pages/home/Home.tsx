import { Show, type JSX } from "solid-js";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import Nav from "@src/social/uis/components/Nav";
import Panel from "@src/social/uis/components/panel/Panel";
import styles from "@src/social/styles/pages/home/Home.module.css";

function Home(props: { children?: JSX.Element }): JSX.Element {
  const { isAuthenticated } = useAuth();

  return (
    <div class={styles.home} classList={{ [styles.loggedOut]: !isAuthenticated() }}>
      <Show when={isAuthenticated()}>
        <div class={styles.left}><Nav /></div>
      </Show>
      <div class={styles.center}>{props.children}</div>
      <div class={styles.right}>
        <Panel />
      </div>
    </div>
  );
}

export default Home;