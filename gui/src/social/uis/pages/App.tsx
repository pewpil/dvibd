import type { JSX } from "solid-js";
import { MetaProvider, Link } from "@solidjs/meta";

import { AuthProvider } from "@src/dvibd/contexts/AuthContext";
import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";

function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <MetaProvider>
      <Link rel="icon" type="image/x-icon" href="/social.ico" />
      <Link rel="shortcut icon" href="/social.ico" />
      <AuthProvider>
        <ThemeToggle />
        {props.children}
      </AuthProvider>
    </MetaProvider>
  );
}

export default App;
