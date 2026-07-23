import type { JSX } from "solid-js";

import { AuthProvider } from "@src/dvibd/contexts/AuthContext";
import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";

function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <AuthProvider>
      <div>
        <ThemeToggle />
        {props.children}
      </div>
    </AuthProvider>
  );
}

export default App;
