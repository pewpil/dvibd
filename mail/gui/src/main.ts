import { mount } from "svelte";
import App from "./App.svelte";
import "./styles/index.css";

const target: HTMLElement | null = document.getElementById("app");

if (target === null) {
  throw new Error("Mail GUI mount target #app is missing");
}

mount(App, { target: target });