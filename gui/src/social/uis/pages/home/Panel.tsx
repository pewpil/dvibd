import type { JSX } from "solid-js";

import Trending from "@src/social/uis/components/Trending";
import People from "@src/social/uis/components/People";
import Communities from "@src/social/uis/components/Communities";
import styles from "@src/dvibd/styles/components/Panel.module.css";

function Panel(): JSX.Element {
  return (
    <div class={styles.panel}>
      <Trending />
      <People />
      <Communities />
      <div class={styles.legal}>
        <a href="/terms">Terms</a>
        <a href="/conditions">Conditions</a>
        <a href="/privacy">Privacy Notice</a>
      </div>
    </div>
  );
}

export default Panel;