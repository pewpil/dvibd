// index.ts
// Application entry point: build the server and start listening. Env is loaded
// via config/env (which imports dotenv). Graceful shutdown will be wired here.

import { createServer } from "./server.ts";

const PORT = Number(process.env.PORT ?? 3001);

const app = createServer();

app.listen(PORT, function (): void {
  console.log(`dvibd api listening on http://localhost:${PORT}`);
});

// TODO: handle SIGINT/SIGTERM to close the server and DB pool gracefully.
