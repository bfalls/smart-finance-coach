const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${rawBaseUrl}${normalizedPath}`;
};

const parseJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      (data as any)?.message ??
      (data as any)?.error ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return (data ?? {}) as T;
};

export const endpoints = {
  personas: "/personas",
  personaSummary: (id: string) => `/personas/${id}/summary`,
  chat: "/chat",
};

export const apiUrl = buildUrl;

export const getJson = async <T>(path: string, init?: RequestInit) => {
  const url = buildUrl(path);
  const response = init ? await fetch(url, init) : await fetch(url);
  return handleResponse<T>(response);
};

export const postJson = async <T>(path: string, body: unknown, init?: RequestInit) => {
  const response = await fetch(buildUrl(path), {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
};
