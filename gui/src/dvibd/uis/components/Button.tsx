import type { JSX } from "solid-js";
import { A } from "@solidjs/router";

import styles from "@src/dvibd/styles/components/Button.module.css";

type ButtonClickHandler = JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
type AnchorClickHandler = JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>;

type ButtonProps = {
  variant?: "primary" | "ghost";
  href?: string;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: AnchorClickHandler | ButtonClickHandler;
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
      return;
    }
    if (typeof props.onClick === "function") {
      (props.onClick as (e: MouseEvent) => void)(event);
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

  if (props.href) {
    return (
      <a class={classes()} href={props.href!} onClick={props.onClick}>
        {props.children}
      </a>
    );
  }

  return (
    <button
      class={classes()}
      type={props.type || "button"}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
