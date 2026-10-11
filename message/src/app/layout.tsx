import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Message",
  description: "dvibd messaging",
};

export default function RootLayout(props: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <body>
        <div id="app">
          <AuthProvider>{props.children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
