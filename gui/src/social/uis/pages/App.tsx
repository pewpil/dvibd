import type { JSX } from "solid-js";

function App(props: { children?: JSX.Element }): JSX.Element {
  return <div>{props.children}</div>;
}

export default App;