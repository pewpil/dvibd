import { currentUser, unauthorized } from "../../../../server/api";
import { prisma } from "../../../../server/db";
import { getStorage } from "../../../../server/storage";

// GET /api/uploads/[id]
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;

  const upload = await prisma.upload.findUnique({
    where: { id: id },
    select: {
      id: true,
      userId: true,
      storageKey: true,
      mimeType: true,
      sizeBytes: true,
      attachments: {
        select: { message: { select: { conversationId: true } } },
      },
    },
  });
  if (upload === null) {
    return Response.json({ error: "File not found." }, { status: 404 });
  }

  let allowed: boolean = upload.userId === user.id;
  if (!allowed) {
    const conversationIds: string[] = upload.attachments.map(
      (row): string => row.message.conversationId,
    );
    if (conversationIds.length > 0) {
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          userId: user.id,
          leftAt: null,
          conversationId: { in: conversationIds },
        },
        select: { conversationId: true },
      });
      allowed = participant !== null;
    }
  }
  if (!allowed) {
    return Response.json(
      { error: "You do not have access to this file." },
      { status: 403 },
    );
  }

  let bytes: Uint8Array | null;
  try {
    bytes = await getStorage(upload.storageKey);
  } catch (error) {
    console.error("Upload bytes could not be read.", error);
    return Response.json(
      { error: "The file could not be read." },
      { status: 500 },
    );
  }
  if (bytes === null) {
    return Response.json({ error: "File not found." }, { status: 404 });
  }

  const headers: Headers = new Headers({
    "content-type": upload.mimeType,
    "content-length": String(upload.sizeBytes),
    "cache-control": "private, max-age=3600",
    "x-content-type-options": "nosniff",
  });
  if (upload.mimeType === "image/svg+xml") {
    headers.set(
      "content-security-policy",
      "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    );
  }
  const buffer: ArrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Response(buffer, { status: 200, headers: headers });
}
