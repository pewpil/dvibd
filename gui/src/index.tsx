/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "solid-devtools";

import "@src/dvibd/styles/theme.css";

import { AuthProvider } from "@src/dvibd/contexts/AuthContext";

import App from "./dvibd/uis/pages/App";
import About from "./dvibd/uis/pages/home/About";
import Home from "./dvibd/uis/pages/home/Home";
import Landing from "./dvibd/uis/pages/home/Landing";
import Products from "./dvibd/uis/pages/home/Products";
import Contact from "./dvibd/uis/pages/home/Contact";
import Auth from "./dvibd/uis/pages/auth/Auth";
import LogIn from "./dvibd/uis/pages/auth/LogIn";
import SignUp from "./dvibd/uis/pages/auth/SignUp";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <AuthProvider>
      <Router root={App}>
        <Route path="/" component={Home}>
          <Route path="" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/products" component={Products} />
          <Route path="/contact" component={Contact} />
        </Route>
        <Route path="/auth" component={Auth}>
          <Route path="/login" component={LogIn} />
          <Route path="/signup" component={SignUp} />
        </Route>
      </Router>
    </AuthProvider>
  ),
  root!,
);
