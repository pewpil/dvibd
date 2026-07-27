import { Show, type JSX } from "solid-js";

import linkIcon from "@src/social/assets/link.svg";
import styles from "@src/social/styles/components/profile/card/Bio.module.css";

type BioProps = {
  text: string;
  website?: string;
};

function Bio(props: BioProps): JSX.Element {
  return (
    <div class={styles.bio}>
      <p class={styles.text}>{props.text}</p>
      <Show when={props.website}>
        <a class={styles.website} href={props.website!} target="_blank" rel="noopener">
          <img class={styles.icon} src={linkIcon} alt="" />
          {props.website!.replace(/^https?:\/\//, "")}
        </a>
      </Show>
    </div>
  );
}

export default Bio;
