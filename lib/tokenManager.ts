import { AuthenticationData } from "@directus/sdk";
import { refreshAuthentication } from "@/requests/auth.request";
import { convertTimeToMilliseconds } from "@/helpers/timeConverter";

const debug = (message: string, data?: any) => {
  console.log(`🔐 [TokenManager] ${message}`, data ? data : "");
};

export class TokenManager {
  private static instance: TokenManager;
  private isRefreshing = false;
  private refreshPromise: Promise<AuthenticationData | null> | null = null;
  private refreshAttempts = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 3;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public async refreshTokens(refreshToken: string): Promise<AuthenticationData | null> {
    debug("Starting token refresh process", { attempts: this.refreshAttempts });

    // If we've exceeded max attempts, return null
    if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
      debug("Max refresh attempts reached");
      return null;
    }

    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      debug("Token refresh already in progress, returning existing promise");
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshAttempts++;
    debug("Setting refresh in progress flag");

    try {
      this.refreshPromise = (async () => {
        debug("Attempting to refresh tokens");
        const response = await refreshAuthentication(refreshToken);

        if (!response.success || !response.data?.access_token || !response.data?.refresh_token) {
          debug("Token refresh failed", response);
          return null;
        }

        debug("Token refresh successful");
        this.resetRefreshAttempts();
        return {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires: 0,
          expires_at: 0,
        };
      })();

      const result = await this.refreshPromise;
      return result;
    } catch (error) {
      debug("Token refresh error", error);
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
      debug("Cleared refresh flags");
    }
  }

  public async getValidTokens(accessToken: string | null, refreshToken: string | null): Promise<AuthenticationData | null> {
    debug("Getting valid tokens", { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

    // If we have a valid access token, use it
    if (accessToken) {
      debug("Access token exists, returning it");
      return {
        access_token: accessToken,
        refresh_token: refreshToken || "",
        expires: 0,
        expires_at: 0,
      };
    }

    // If we have a refresh token but no access token, try to refresh
    if (refreshToken) {
      debug("No access token but refresh token exists, attempting refresh");
      return this.refreshTokens(refreshToken);
    }

    debug("No valid tokens available");
    return null;
  }

  public getTokenExpiration(ttl: string): Date {
    const expiration = new Date(Date.now() + convertTimeToMilliseconds(ttl));
    debug("Calculated token expiration", { ttl, expiration });
    return expiration;
  }

  public resetRefreshAttempts(): void {
    this.refreshAttempts = 0;
    debug("Reset refresh attempts");
  }
}
