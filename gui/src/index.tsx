import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import App from "~/dvibd/uis/pages/app/App";
import Home from "~/dvibd/uis/pages/app/Home";
import Products from "~/dvibd/uis/pages/app/Products";
import About from "~/dvibd/uis/pages/app/About";
import Contact from "~/dvibd/uis/pages/app/Contact";
import Login from "~/dvibd/uis/pages/app/auth/Login";
import Signup from "~/dvibd/uis/pages/app/auth/Signup";
import "~/index.css";

const root: HTMLElement | null = document.getElementById("root");

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Router>
  ),
  root!,
);
