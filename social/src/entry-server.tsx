// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";

const THEME_KEY = "dvibd-theme";

function getServerTheme(): "light" | "dark" | undefined {
  const cookie = getRequestEvent()?.request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${THEME_KEY}=([^;]+)`));
  return match?.[1] === "dark" ? "dark" : match?.[1] === "light" ? "light" : undefined;
}

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app" data-theme={getServerTheme()}>
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
