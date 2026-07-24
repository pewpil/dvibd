import type { JSX } from "solid-js";

import Trending from "@src/social/uis/components/Trending";
import People from "@src/social/uis/components/People";
import Communities from "@src/social/uis/components/Communities";
import searchIcon from "@src/social/assets/search.svg";
import styles from "@src/dvibd/styles/components/Panel.module.css";

function Panel(): JSX.Element {
  return (
    <div class={styles.panel}>
      <div class={styles.search}>
        <img class={styles.searchIcon} src={searchIcon} alt="" />
        <input class={styles.searchInput} type="search" placeholder="Search social" />
      </div>
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