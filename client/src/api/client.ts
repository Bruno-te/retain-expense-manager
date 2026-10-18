const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";
const TOKEN_KEY = "retain_token";

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let unauthorizedHandler: (() => void) | null = null;

// AuthContext registers a callback here so an expired token logs the user out
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);

  if (options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection.", 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token && unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new ApiError(data?.message ?? "Something went wrong", response.status);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
