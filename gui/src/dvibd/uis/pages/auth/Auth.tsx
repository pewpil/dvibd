import type { Component, JSX } from "solid-js";
import { A } from "@solidjs/router";

import styles from "@src/dvibd/styles/pages/auth/Auth.module.css";

const Auth: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <div class={styles.auth}>
      <div class={styles.glow} />
      <A class={styles.brand} href="/">
        dvibd
      </A>
      <div class={styles.panel}>{props.children}</div>
      <A class={styles.back} href="/">
        ← Back to home
      </A>
    </div>
  );
};

export default Auth;
