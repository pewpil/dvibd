import { JSXElement } from "solid-js";
import { ParentProps } from "solid-js";

export default function HomeLayout({ children }: ParentProps): JSXElement {
  return (
    <div>
      hello from home layout
      {children}
    </div>
  );
}
