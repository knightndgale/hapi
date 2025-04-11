import { AuthenticationData } from "@directus/sdk";
import { refreshAuthentication } from "@/requests/auth.request";
import { convertTimeToMilliseconds } from "@/helpers/timeConverter";

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
    // If we've exceeded max attempts, return null and clear user data
    if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
      localStorage.removeItem("user");
      return null;
    }

    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshAttempts++;

    try {
      this.refreshPromise = (async () => {
        const response = await refreshAuthentication(refreshToken);

        if (!response.success || !response.data?.access_token || !response.data?.refresh_token) {
          // Only clear user data if we're sure the refresh failed
          if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
            localStorage.removeItem("user");
          }
          return null;
        }

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
      // Only clear user data if we're sure the refresh failed
      if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
        localStorage.removeItem("user");
      }
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  public async getValidTokens(accessToken: string | null, refreshToken: string | null): Promise<AuthenticationData | null> {
    // If we have a valid access token, use it
    if (accessToken) {
      return {
        access_token: accessToken,
        refresh_token: refreshToken || "",
        expires: 0,
        expires_at: 0,
      };
    }

    // If we have a refresh token but no access token, try to refresh
    if (refreshToken) {
      return this.refreshTokens(refreshToken);
    }

    return null;
  }

  public getTokenExpiration(ttl: string): Date {
    const expiration = new Date(Date.now() + convertTimeToMilliseconds(ttl));
    return expiration;
  }

  public resetRefreshAttempts(): void {
    this.refreshAttempts = 0;
  }
}
