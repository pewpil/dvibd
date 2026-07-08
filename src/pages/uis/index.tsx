/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "solid-devtools";

import "../styles/index.css";
import App from "./dvibd/App";
import Home from "./dvibd/app/Home";
import Products from "./dvibd/app/Products";
import About from "./dvibd/app/About";
import Auth from "./dvibd/Auth";
import Login from "./dvibd/auth/Login";
import Signup from "./dvibd/auth/Signup";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router>
      <Route path="/" component={App}>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
      </Route>
      <Route component={Auth}>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Route>
    </Router>
  ),
  root!,
);
