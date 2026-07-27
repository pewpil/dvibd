import type { JSX } from "solid-js";
import { MetaProvider, Link } from "@solidjs/meta";

import { AuthProvider } from "@src/dvibd/contexts/AuthContext";

function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <MetaProvider>
      <Link rel="icon" type="image/x-icon" href="/social.ico" />
      <Link rel="shortcut icon" href="/social.ico" />
      <AuthProvider>
        {props.children}
      </AuthProvider>
    </MetaProvider>
  );
}

export default App;
