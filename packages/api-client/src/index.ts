import { createApiConfig, type ApiConfig } from "@curevanta/config";
import type { ApiErrorBody, BookingSummary } from "@curevanta/types";

export type TokenStore = {
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => Promise<void>;
  clear: () => Promise<void>;
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = body.code;
    this.requestId = body.requestId;
  }
}

export type CreateApiClientOptions = {
  config?: Partial<ApiConfig> & { baseUrl?: string };
  tokenStore?: TokenStore;
  fetchImpl?: typeof fetch;
};

export function createApiClient(options: CreateApiClientOptions = {}) {
  const config = createApiConfig(options.config);
  const fetchImpl = options.fetchImpl ?? fetch;

  async function request<T>(
    path: string,
    init: RequestInit & { idempotencyKey?: string } = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (init.idempotencyKey) {
      headers.set("Idempotency-Key", init.idempotencyKey);
    }

    const token = await options.tokenStore?.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const res = await fetchImpl(`${config.baseUrl}${path}`, {
        ...init,
        headers,
        signal: init.signal ?? controller.signal,
      });

      if (!res.ok) {
        let body: ApiErrorBody = {
          code: "HTTP_ERROR",
          message: `Request failed (${res.status})`,
        };
        try {
          body = (await res.json()) as ApiErrorBody;
        } catch {
          /* keep default */
        }
        throw new ApiClientError(res.status, body);
      }

      if (res.status === 204) {
        return undefined as T;
      }

      return (await res.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    config,
    request,
    auth: {
      login: (body: { email: string; password: string }) =>
        request<{
          accessToken: string;
          refreshToken: string;
          expiresAt: string;
          account: { id: string; email: string; name: string; role: string };
        }>("/api/mobile/auth/login", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      logout: () =>
        request<{ ok: boolean }>("/api/mobile/auth/logout", { method: "POST" }),
    },
    bookings: {
      list: () =>
        request<{ items: BookingSummary[] }>("/api/mobile/bookings").then(
          (r) => r.items,
        ),
      get: (id: string) => request<BookingSummary>(`/api/mobile/bookings/${id}`),
      create: (body: unknown, idempotencyKey: string) =>
        request<BookingSummary>("/api/mobile/bookings", {
          method: "POST",
          body: JSON.stringify(body),
          idempotencyKey,
        }),
      accept: (id: string) =>
        request<BookingSummary>(`/api/mobile/bookings/${id}/accept`, {
          method: "POST",
        }),
    },
    provider: {
      setOnline: (isOnline: boolean) =>
        request<{ isOnline: boolean }>("/api/mobile/provider/online", {
          method: "POST",
          body: JSON.stringify({ isOnline }),
        }),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
