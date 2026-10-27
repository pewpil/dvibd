import type {
  ConversationDTO,
  ConversationInfoDTO,
  MessageDTO,
  MessagesResponse,
  UploadDTO,
  WorkspaceDTO,
} from "../types/message";

const JSON_HEADERS: Record<string, string> = {
  "content-type": "application/json",
};

const DEFAULT_ERROR: string = "Something went wrong.";

interface ErrorBody {
  error: string;
}

interface MessageEnvelope {
  message: MessageDTO;
}

interface ConversationEnvelope {
  conversation: ConversationDTO;
}

interface DirectEnvelope {
  conversationId: string;
}

async function toError(response: Response): Promise<Error> {
  try {
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as ErrorBody).error === "string"
    ) {
      return new Error((data as ErrorBody).error);
    }
  } catch {
    return new Error(DEFAULT_ERROR);
  }
  return new Error(DEFAULT_ERROR);
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const requestInit: RequestInit = { ...init, cache: "no-store" };
  const response: Response = await fetch(path, requestInit);
  if (!response.ok) {
    throw await toError(response);
  }
  return (await response.json()) as T;
}

function conversationPath(id: string): string {
  return `/api/conversations/${encodeURIComponent(id)}`;
}

export async function fetchWorkspace(): Promise<WorkspaceDTO> {
  return await requestJson<WorkspaceDTO>("/api/conversations");
}

export async function fetchMessages(id: string): Promise<MessagesResponse> {
  return await requestJson<MessagesResponse>(`${conversationPath(id)}/messages`);
}

export async function fetchInfo(id: string): Promise<ConversationInfoDTO> {
  return await requestJson<ConversationInfoDTO>(`${conversationPath(id)}/info`);
}

export async function sendMessage(
  id: string,
  text: string,
  uploadIds: string[],
): Promise<MessageDTO> {
  const envelope: MessageEnvelope = await requestJson<MessageEnvelope>(
    `${conversationPath(id)}/messages`,
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ text: text, uploadIds: uploadIds }),
    },
  );
  return envelope.message;
}

export async function markRead(id: string): Promise<void> {
  await requestJson<{ ok: boolean }>(`${conversationPath(id)}/read`, {
    method: "POST",
  });
}

export async function joinConversation(id: string): Promise<ConversationDTO> {
  const envelope: ConversationEnvelope = await requestJson<ConversationEnvelope>(
    `${conversationPath(id)}/join`,
    { method: "POST" },
  );
  return envelope.conversation;
}

export async function leaveConversation(id: string): Promise<void> {
  await requestJson<{ ok: boolean }>(`${conversationPath(id)}/leave`, {
    method: "POST",
  });
}

export async function setMute(id: string, isMuted: boolean): Promise<void> {
  await requestJson<{ ok: boolean }>(conversationPath(id), {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ isMuted: isMuted }),
  });
}

export async function createDirectConversation(
  username: string,
): Promise<string> {
  const envelope: DirectEnvelope = await requestJson<DirectEnvelope>(
    "/api/conversations/direct",
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ username: username }),
    },
  );
  return envelope.conversationId;
}

export async function uploadFile(file: File): Promise<UploadDTO> {
  const form: FormData = new FormData();
  form.append("file", file);
  return await requestJson<UploadDTO>("/api/uploads", {
    method: "POST",
    body: form,
  });
}
