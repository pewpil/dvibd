import type { Component } from "solid-js";
import { RouteSectionProps, useLocation } from "@solidjs/router";
import style from "../../styles/dvibd/App.module.css";
import NavBar from "@components/uis/dvibd/NavBar";

const App: Component<RouteSectionProps> = (props) => {
  return (
    <div class={style.app}>
      <NavBar />
      <div class={style.content}>{props.children}</div>
    </div>
  );
};

export default App;
