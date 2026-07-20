// index.ts
// Application entry point: build the server and start listening. Env is loaded
// via config/env (which imports dotenv). Graceful shutdown will be wired here.

import { env } from "./config/env.ts";
import { createServer } from "./server.ts";

const app = createServer();

app.listen(env.PORT, function (): void {
  console.log(`dvibd api listening on http://localhost:${env.PORT}`);
});

// TODO: handle SIGINT/SIGTERM to close the server and DB pool gracefully.
