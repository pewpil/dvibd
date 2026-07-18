import type { Component } from "solid-js";

import NavBar from "@src/dvibd/uis/components/NavBar";

import Home from "./home/Home";

const App: Component = () => {
  return (
    <>
      <NavBar />
      <Home />
    </>
  );
};

export default App;
