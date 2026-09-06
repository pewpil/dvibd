import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Message",
  description: "dvibd messaging",
};

export default function RootLayout(props: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <body>
        <div id="app">{props.children}</div>
      </body>
    </html>
  );
}
