import { serve } from "@hono/node-server";
import type { AddressInfo } from "node:net";
import app from "./app.ts";
import { config } from "./config.ts";

serve(
  {
    fetch: app.fetch,
    port: config.port,
  },
  (info: AddressInfo): void => {
    console.log(`dvibd api listening on http://localhost:${info.port}`);
  },
);
