import { createMemo, type JSX } from "solid-js";
import { A } from "@solidjs/router";

import styles from "@src/dvibd/styles/components/Button.module.css";

type ButtonProps = {
  variant?: "primary" | "ghost";
  href?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: (e: MouseEvent) => void;
  children: JSX.Element;
};

function isInternal(href?: string): boolean {
  return !!href && href.startsWith("/");
}

function Button(props: ButtonProps): JSX.Element {
  const classes = createMemo(() => {
    let c = `${styles.button} ${props.variant === "ghost" ? styles.ghost : styles.primary}`;
    if (props.disabled) c += ` ${styles.disabled}`;
    return c;
  });

  if (props.type === "submit") {
    return (
      <button class={classes()} type="submit" disabled={props.disabled} onClick={props.onClick}>
        {props.children}
      </button>
    );
  }

  if (isInternal(props.href)) {
    return (
      <A class={classes()} href={props.href!} aria-disabled={props.disabled} onClick={props.disabled ? (e) => e.preventDefault() : props.onClick}>
        {props.children}
      </A>
    );
  }

  if (props.href) {
    return (
      <a class={classes()} href={props.href!} aria-disabled={props.disabled} onClick={props.disabled ? (e) => e.preventDefault() : props.onClick}>
        {props.children}
      </a>
    );
  }

  return (
    <button class={classes()} type="button" disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
