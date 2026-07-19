import type { Component, JSX } from "solid-js";

import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";

const App: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <div>
      <ThemeToggle />
      {props.children}
    </div>
  );
};

export default App;
