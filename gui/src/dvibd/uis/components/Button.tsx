import type { Component, JSX } from "solid-js";
import { A } from "@solidjs/router";

import styles from "@src/dvibd/styles/components/Button.module.css";

type ButtonProps = {
  variant?: "primary" | "ghost";
  href?: string;
  disabled?: boolean;
  children: JSX.Element;
};

const isInternal = (href?: string) => !!href && href.startsWith("/");

const Button: Component<ButtonProps> = (props) => {
  const classes = () =>
    `${styles.button} ${props.variant === "ghost" ? styles.ghost : styles.primary}`;

  if (props.disabled) {
    return (
      <a
        class={`${classes()} ${styles.disabled}`}
        aria-disabled={true}
        onClick={(e) => e.preventDefault()}
      >
        {props.children}
      </a>
    );
  }

  if (isInternal(props.href)) {
    return (
      <A class={classes()} href={props.href!}>
        {props.children}
      </A>
    );
  }

  return (
    <a class={classes()} href={props.href ?? "#"}>
      {props.children}
    </a>
  );
};

export default Button;
