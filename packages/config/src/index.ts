export type AppEnvironment = "development" | "staging" | "production";

export type ApiConfig = {
  environment: AppEnvironment;
  baseUrl: string;
  timeoutMs: number;
};

/**
 * Resolve API config from Expo public env vars.
 * Never hard-code localhost inside feature screens — pass this config.
 */
export function createApiConfig(input?: {
  environment?: AppEnvironment;
  baseUrl?: string;
  timeoutMs?: number;
}): ApiConfig {
  const environment = input?.environment ?? "development";
  const defaults: Record<AppEnvironment, string> = {
    development: "http://localhost:3000",
    staging: "https://staging-api.curevanta.example",
    production: "https://api.curevanta.example",
  };

  return {
    environment,
    baseUrl: (input?.baseUrl ?? defaults[environment]).replace(/\/$/, ""),
    timeoutMs: input?.timeoutMs ?? 15_000,
  };
}
