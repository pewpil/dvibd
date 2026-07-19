import type { Component, JSX } from "solid-js";

const App: Component<{ children?: JSX.Element }> = (props) => {
  return <div>{props.children}</div>;
};

export default App;
