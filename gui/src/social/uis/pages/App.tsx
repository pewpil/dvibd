import type { JSX } from "solid-js";
import { MetaProvider, Link } from "@solidjs/meta";

function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <MetaProvider>
      <Link rel="icon" type="image/x-icon" href="/social.ico" />
      <Link rel="shortcut icon" href="/social.ico" />
      {props.children}
    </MetaProvider>
  );
}

export default App;