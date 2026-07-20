import type { JSX } from "solid-js";

import styles from "@src/dvibd/styles/components/Tag.module.css";

type TagProps = {
  label: string;
};

function Tag(props: TagProps): JSX.Element {
  return <span class={styles.tag}>{props.label}</span>;
}

export default Tag;
