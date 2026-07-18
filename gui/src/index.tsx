import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import DvibdApp from "~/dvibd/uis/pages/app/App";
import Home from "~/dvibd/uis/pages/app/Home";
import Products from "~/dvibd/uis/pages/app/Products";
import About from "~/dvibd/uis/pages/app/About";
import Contact from "~/dvibd/uis/pages/app/Contact";
import DvibdLogin from "~/dvibd/uis/pages/app/auth/Login";
import DvibdSignup from "~/dvibd/uis/pages/app/auth/Signup";
import SocialApp from "~/social/uis/pages/app/App";
import Feed from "~/social/uis/pages/app/Feed";
import Explore from "~/social/uis/pages/app/Explore";
import Profile from "~/social/uis/pages/app/Profile";
import SocialLogin from "~/social/uis/pages/app/auth/Login";
import SocialSignup from "~/social/uis/pages/app/auth/Signup";
import "~/index.css";

const root: HTMLElement | null = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/" component={DvibdApp}>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={DvibdLogin} />
        <Route path="/signup" component={DvibdSignup} />
      </Route>

      <Route path="/social" component={SocialApp}>
        <Route path="/" component={Feed} />
        <Route path="/explore" component={Explore} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={SocialLogin} />
        <Route path="/signup" component={SocialSignup} />
      </Route>
    </Router>
  ),
  root!,
);
