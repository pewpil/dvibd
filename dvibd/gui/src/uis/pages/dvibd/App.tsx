import type { ParentProps } from "solid-js";
import { useTheme } from "../../contexts/dvibd/ThemeContext";
import layoutStyle from "../../../styles/pages/dvibd/layout.module.css";
import style from "../../../styles/pages/dvibd/App.module.css";

function App(props: ParentProps) {
  const theme = useTheme();

  return (
    <div id={style.app} data-theme={theme.theme()}>
      <a id={style.skipLink} href={`#${layoutStyle.mainContent}`}>
        Skip to content
      </a>
      {props.children}
    </div>
  );
}

export default App;
