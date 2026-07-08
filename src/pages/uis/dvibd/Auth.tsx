import type { Component } from "solid-js";
import type { RouteSectionProps } from "@solidjs/router";
import style from "../../styles/dvibd/Auth.module.css";

const Auth: Component<RouteSectionProps> = (props) => {
  return (
    <div class={style.auth}>
      {props.children}
    </div>
  );
};

export default Auth;
