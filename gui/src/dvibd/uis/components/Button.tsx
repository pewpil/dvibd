import type { JSX } from "solid-js";
import { A } from "@solidjs/router";

import styles from "@src/dvibd/styles/components/Button.module.css";

type AnchorClickHandler = JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>;

type ButtonProps = {
  variant?: "primary" | "ghost";
  href?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: AnchorClickHandler;
  children: JSX.Element;
};

function isInternal(href?: string): boolean {
  return !!href && href.startsWith("/");
}

function Button(props: ButtonProps): JSX.Element {
  function classes(): string {
    return `${styles.button} ${props.variant === "ghost" ? styles.ghost : styles.primary}`;
  }

  function handleClick(event: MouseEvent): void {
    if (props.type === "submit" && !props.disabled) {
      event.preventDefault();
      const form = (event.currentTarget as HTMLElement).closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
    if (props.onClick) {
      props.onClick(event);
    }
  }

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
      <A class={classes()} href={props.href!} onClick={props.onClick}>
        {props.children}
      </A>
    );
  }

  const buttonType = props.type || "button";
  return (
    <a
      class={classes()}
      href={props.href ?? "#"}
      onClick={handleClick}
      type={buttonType}
    >
      {props.children}
    </a>
  );
}

export default Button;
