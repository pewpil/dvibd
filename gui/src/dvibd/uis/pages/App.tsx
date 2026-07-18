import type { Component } from "solid-js";

import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";

import Home from "./home/Home";

const App: Component = () => {
  return (
    <>
      <ThemeToggle />
      <Home />
    </>
  );
};

export default App;
