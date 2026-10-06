import { createApiClient } from "@curevanta/api-client";
import { secureTokenStore } from "@curevanta/auth";
import { createApiConfig, type AppEnvironment } from "@curevanta/config";
import Constants from "expo-constants";

function resolveEnvironment(): AppEnvironment {
  const raw =
    process.env.EXPO_PUBLIC_APP_ENV ??
    (Constants.expoConfig?.extra?.appEnv as string | undefined) ??
    "development";
  if (raw === "staging" || raw === "production") return raw;
  return "development";
}

export const apiClient = createApiClient({
  config: createApiConfig({
    environment: resolveEnvironment(),
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  }),
  tokenStore: secureTokenStore,
});
