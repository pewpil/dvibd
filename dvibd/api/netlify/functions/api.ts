import type { Config } from "@netlify/functions";
import app from "../../src/app.ts";

export const config: Config = {
  path: "/*",
};

export default async function handler(request: Request): Promise<Response> {
  return app.fetch(request);
}
