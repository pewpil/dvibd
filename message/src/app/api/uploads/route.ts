import { currentUser, unauthorized } from "../../../server/api";
import { prisma } from "../../../server/db";
import { deleteStorage, putStorage } from "../../../server/storage";
import type { UploadDTO } from "../../../types/message";

const MAX_UPLOAD_BYTES: number = 5 * 1024 * 1024;
const MAX_MULTIPART_OVERHEAD_BYTES: number = 1024 * 1024;
const MAX_NAME_LENGTH: number = 200;
const MAX_EXTENSION_LENGTH: number = 10;
const FALLBACK_NAME: string = "file";

const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/json",
  "text/plain",
  "text/markdown",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
  "video/mp4",
  "application/sketch",
]);

function sanitizeName(name: string): string {
  const trimmed: string = name.trim().slice(0, MAX_NAME_LENGTH).trim();
  return trimmed.length === 0 ? FALLBACK_NAME : trimmed;
}

function extensionOf(name: string): string | null {
  const trimmed: string = name.trim();
  const dot: number = trimmed.lastIndexOf(".");
  if (dot <= 0 || dot === trimmed.length - 1) {
    return null;
  }
  const cleaned: string = trimmed
    .slice(dot + 1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, MAX_EXTENSION_LENGTH);
  return cleaned.length === 0 ? null : `.${cleaned}`;
}

// POST /api/uploads
export async function POST(request: Request): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }

  const contentLength: string | null =
    request.headers.get("content-length");
  if (contentLength !== null) {
    const declared: number = Number(contentLength);
    if (
      Number.isFinite(declared) &&
      declared > MAX_UPLOAD_BYTES + MAX_MULTIPART_OVERHEAD_BYTES
    ) {
      return Response.json(
        { error: "The file must be 5 MB or smaller." },
        { status: 413 },
      );
    }
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload payload." }, { status: 400 });
  }

  const entry: FormDataEntryValue | null = form.get("file");
  if (!(entry instanceof File)) {
    return Response.json({ error: "A file is required." }, { status: 400 });
  }
  if (entry.size === 0) {
    return Response.json({ error: "The file is empty." }, { status: 400 });
  }
  if (entry.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: "The file must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const mimeType: string = entry.type.trim().toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return Response.json(
      { error: "This file type is not supported." },
      { status: 400 },
    );
  }

  const originalName: string = entry.name.length === 0 ? FALLBACK_NAME : entry.name;
  const name: string = sanitizeName(originalName);
  const extension: string | null = extensionOf(originalName);
  const storageKey: string = `${user.id}/${crypto.randomUUID()}${extension ?? ""}`;
  const bytes: Uint8Array = new Uint8Array(await entry.arrayBuffer());

  try {
    await putStorage(storageKey, bytes);
  } catch (error) {
    console.error("Upload bytes could not be stored.", error);
    return Response.json(
      { error: "The file could not be stored." },
      { status: 500 },
    );
  }

  try {
    const upload = await prisma.upload.create({
      data: {
        userId: user.id,
        storageKey: storageKey,
        name: name,
        mimeType: mimeType,
        sizeBytes: entry.size,
        extension: extension === null ? null : extension.slice(1).toUpperCase(),
      },
      select: {
        id: true,
        name: true,
        mimeType: true,
        sizeBytes: true,
        extension: true,
      },
    });
    const dto: UploadDTO = {
      id: upload.id,
      url: `/api/uploads/${upload.id}`,
      name: upload.name,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      extension: upload.extension,
    };
    return Response.json(dto, { status: 201 });
  } catch (error) {
    console.error("Upload record could not be created.", error);
    try {
      await deleteStorage(storageKey);
    } catch (cleanupError) {
      console.error("Orphaned upload bytes could not be removed.", cleanupError);
    }
    return Response.json(
      { error: "The file could not be stored." },
      { status: 500 },
    );
  }
}
