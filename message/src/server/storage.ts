import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const LOCAL_UPLOAD_DIR: string = path.resolve(process.cwd(), ".uploads");
const STORE_NAME: string = "message-uploads";
const MISSING_FILE_CODE: string = "ENOENT";

function hasBlobsContext(): boolean {
  const globalContext: unknown = globalThis.netlifyBlobsContext;
  if (typeof globalContext === "string" && globalContext.length > 0) {
    return true;
  }
  const envContext: string | undefined = process.env.NETLIFY_BLOBS_CONTEXT;
  return typeof envContext === "string" && envContext.length > 0;
}

function isLocalStorage(): boolean {
  return process.env.LOCAL_ENV === "1" || !hasBlobsContext();
}

function localPathOf(storageKey: string): string {
  const resolved: string = path.resolve(LOCAL_UPLOAD_DIR, storageKey);
  const prefix: string = `${LOCAL_UPLOAD_DIR}${path.sep}`;
  if (resolved === LOCAL_UPLOAD_DIR || !resolved.startsWith(prefix)) {
    throw new Error("Invalid storage key");
  }
  return resolved;
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === MISSING_FILE_CODE
  );
}

export async function putStorage(
  storageKey: string,
  data: Uint8Array,
): Promise<void> {
  if (isLocalStorage()) {
    const target: string = localPathOf(storageKey);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
    return;
  }
  const store = getStore(STORE_NAME);
  const buffer: ArrayBuffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(data);
  await store.set(storageKey, buffer);
}

export async function getStorage(
  storageKey: string,
): Promise<Uint8Array | null> {
  if (isLocalStorage()) {
    try {
      const file: Buffer = await readFile(localPathOf(storageKey));
      return new Uint8Array(file);
    } catch (error) {
      if (isMissingFile(error)) {
        return null;
      }
      throw error;
    }
  }
  const store = getStore(STORE_NAME);
  const bytes: ArrayBuffer | null = await store.get(storageKey, {
    type: "arrayBuffer",
  });
  return bytes === null ? null : new Uint8Array(bytes);
}

export async function deleteStorage(storageKey: string): Promise<void> {
  if (isLocalStorage()) {
    await rm(localPathOf(storageKey), { force: true });
    return;
  }
  const store = getStore(STORE_NAME);
  await store.delete(storageKey);
}
