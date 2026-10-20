import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { THEME_KEY, resolveThemeCookie, type ThemeName } from "../theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Message",
  description: "dvibd messaging",
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout(props: {
  children: ReactNode;
}): Promise<ReactNode> {
  const cookieTheme: ThemeName | null = resolveThemeCookie(
    (await cookies()).get(THEME_KEY)?.value,
  );

  return (
    <html lang="en">
      <body>
        <div id="app" data-theme={cookieTheme ?? undefined}>
          <ThemeProvider initialTheme={cookieTheme ?? "light"}>
            <AuthProvider>{props.children}</AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
