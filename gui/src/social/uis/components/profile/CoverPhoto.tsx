import type { JSX } from "solid-js";

import imageIcon from "@src/social/assets/image.svg";
import styles from "@src/social/styles/components/profile/CoverPhoto.module.css";

function CoverPhoto(): JSX.Element {
  return (
    <div class={styles.coverPhoto}>
      <div class={styles.inner}>
        <img class={styles.icon} src={imageIcon} alt="" />
      </div>
    </div>
  );
}

export default CoverPhoto;
