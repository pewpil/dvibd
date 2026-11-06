import type { RouteDefinition } from "@solidjs/router";
import type { JSX, ParentProps } from "solid-js";

export const route: RouteDefinition = {
  matchFilters: { handle: /^@.+$/ },
};

export default function HandleLayout(props: ParentProps): JSX.Element {
  return props.children;
}
