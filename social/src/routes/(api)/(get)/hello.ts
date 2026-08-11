import type { APIEvent } from "@solidjs/start/server";

export async function GET({ params }: APIEvent) {
  return Response.json({ message: "hello" });
}
