/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "../styles/index.css";
import App from "./pages/dvibd/App.tsx";
import Home from "./pages/dvibd/home/Home.tsx";
import Landing from "./pages/dvibd/home/Landing.tsx";
import Products from "./pages/dvibd/home/Products.tsx";
import About from "./pages/dvibd/home/About.tsx";
import Contact from "./pages/dvibd/home/Contact.tsx";
import NotFound from "./pages/dvibd/home/NotFound.tsx";
import Auth from "./components/dvibd/auth/Auth.tsx";
import Login from "./components/dvibd/auth/Login.tsx";
import Signup from "./components/dvibd/auth/Signup.tsx";
import { ThemeProvider } from "./contexts/dvibd/ThemeContext.tsx";
import { AuthProvider } from "./contexts/dvibd/AuthContext.tsx";

const root: HTMLElement | null = document.getElementById("root");

render(
  () => (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Route path="/" component={App}>
            <Route path="/" component={Home}>
              <Route path="/" component={Landing} />
              <Route path="/products" component={Products} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="*" component={NotFound} />
            </Route>
            <Route component={Auth}>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
            </Route>
          </Route>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  ),
  root!,
);
