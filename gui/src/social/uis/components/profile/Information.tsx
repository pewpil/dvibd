import type { JSX } from "solid-js";

import styles from "@src/social/styles/components/profile/Information.module.css";

type InformationProps = {
  name: string;
  handle: string;
  active: string;
};

function Information(props: InformationProps): JSX.Element {
  return (
    <div class={styles.information}>
      <h1 class={styles.name}>{props.name}</h1>
      <span class={styles.handle}>@{props.handle}</span>
      <div class={styles.active}>Active {props.active}</div>
    </div>
  );
}

export default Information;
