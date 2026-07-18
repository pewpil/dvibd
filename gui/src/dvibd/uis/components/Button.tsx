import type { Component, JSX } from "solid-js";

import styles from "@src/dvibd/styles/components/Button.module.css";

type ButtonProps = {
  variant?: "primary" | "ghost";
  href?: string;
  disabled?: boolean;
  children: JSX.Element;
};

const Button: Component<ButtonProps> = (props) => {
  const classes = () =>
    props.variant === "ghost" ? styles.ghost : styles.primary;

  return (
    <a
      class={`${styles.button} ${classes()}`}
      classList={{ [styles.disabled]: props.disabled }}
      href={props.disabled ? undefined : props.href ?? "#"}
      aria-disabled={props.disabled}
      onClick={(e) => props.disabled && e.preventDefault()}
    >
      {props.children}
    </a>
  );
};

export default Button;
