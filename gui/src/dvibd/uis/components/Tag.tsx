import type { Component } from "solid-js";

import styles from "@src/dvibd/styles/components/Tag.module.css";

type TagProps = {
  label: string;
};

const Tag: Component<TagProps> = (props) => {
  return <span class={styles.tag}>{props.label}</span>;
};

export default Tag;
