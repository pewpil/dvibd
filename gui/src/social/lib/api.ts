// social/lib/api.ts
// Typed fetch helpers for the dvibd API. Each function handles the HTTP call,
// authorization, and error extraction so components stay focused on the UI.

type ApiAuthor = {
  id: string;
  email: string;
  username: string;
};

type ApiStatus = {
  id: string;
  content: string;
  media: unknown;
  replyToId: string | null;
  createdAt: string;
  author: ApiAuthor | null;
};

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken: string | null = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
  }

  const response: Response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data: { error?: string } = await response.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function createStatus(content: string): Promise<ApiStatus> {
  return request<ApiStatus>("/api/status", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function fetchStatuses(
  page: number,
  limit: number,
): Promise<ApiStatus[]> {
  return request<ApiStatus[]>(`/api/status?page=${page}&limit=${limit}`);
}

export async function fetchStatusById(id: string): Promise<ApiStatus> {
  return request<ApiStatus>(`/api/status/${id}`);
}

export type { ApiStatus, ApiAuthor };
