/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "solid-devtools";

import "@src/dvibd/styles/theme.css";

import App from "./dvibd/uis/pages/App";
import About from "./dvibd/uis/pages/home/About";
import Home from "./dvibd/uis/pages/home/Home";
import Landing from "./dvibd/uis/pages/home/Landing";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home}>
        <Route path="" component={Landing} />
        <Route path="/about" component={About} />
      </Route>
    </Router>
  ),
  root!,
);
