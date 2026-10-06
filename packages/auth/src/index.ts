import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "curevanta.accessToken";
const REFRESH_KEY = "curevanta.refreshToken";

/**
 * Platform-backed secure token storage.
 * Do NOT use AsyncStorage for auth tokens.
 */
export const secureTokenStore = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_KEY);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_KEY);
  },
  async setTokens(tokens: { accessToken: string; refreshToken?: string }) {
    await SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken);
    if (tokens.refreshToken) {
      await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken);
    }
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};
