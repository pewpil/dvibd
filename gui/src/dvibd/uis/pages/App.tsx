import type { JSX } from "solid-js";
import { MetaProvider, Link } from "@solidjs/meta";

import { AuthProvider } from "@src/dvibd/contexts/AuthContext";
import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";

function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <MetaProvider>
      <Link rel="icon" type="image/x-icon" href="/dvibd.ico" />
      <Link rel="shortcut icon" href="/dvibd.ico" />
      <AuthProvider>
        <div>
          <ThemeToggle />
          {props.children}
        </div>
      </AuthProvider>
    </MetaProvider>
  );
}

export default App;
