import type { JSX } from "solid-js";

import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";

function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <div>
      <ThemeToggle />
      {props.children}
    </div>
  );
}

export default App;
