import { authentication, AuthenticationData, createDirectus, rest } from "@directus/sdk";
import { get as getServerCookie, set as setServerCookie } from "./cookies";
import { convertTimeToMilliseconds } from "@/helpers/timeConverter";
import { refreshAuthentication } from "@/requests/auth.request";

// Utility function for client-side cookie access
const getClientCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setClientCookie = (name: string, value: string, timeString: string): void => {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + convertTimeToMilliseconds(timeString));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};

// Determine if the code is running on the server or client
const isServer = typeof window === "undefined";

// Function to create a new Directus client instance
export const createDirectusClient = () => {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL;

  if (!directusUrl) {
    throw new Error("NEXT_PUBLIC_DIRECTUS_BASE_URL is not defined");
  }

  // Use the appropriate storage functions based on the environment
  const storage = isServer
    ? { get: getServerCookie, set: setServerCookie }
    : {
        get: async () => {
          const accessToken = getClientCookie("access_token");
          const refreshToken = getClientCookie("refresh_token");

          // If access token exists, return it
          if (accessToken) {
            return {
              access_token: accessToken,
              refresh_token: refreshToken,
              expires: 0,
              expires_at: 0,
            };
          }

          // If refresh token exists, try to refresh
          if (refreshToken) {
            const response = await refreshAuthentication();
            if (!response.success || !response.data?.access_token || !response.data?.refresh_token) {
              await setServerCookie(null);
              return null;
            }

            const accessTokenTTL = process.env.ACCESS_TOKEN_TTL || "15m";
            const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || "1d";

            setClientCookie("access_token", response.data.access_token, accessTokenTTL);
            setClientCookie("refresh_token", response.data.refresh_token, refreshTokenTTL);

            return {
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
              expires: 0,
              expires_at: 0,
            };
          }

          // If we get here, no tokens exist
          await setServerCookie(null);
          return null;
        },
        set: async (value: AuthenticationData | null) => {
          if (!value || !value.access_token || !value.refresh_token) {
            await setServerCookie(null);
            return;
          }

          const accessTokenTTL = process.env.ACCESS_TOKEN_TTL || "15m";
          const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || "1d";

          setClientCookie("access_token", value.access_token, accessTokenTTL);
          setClientCookie("refresh_token", value.refresh_token, refreshTokenTTL);
        },
      };

  return createDirectus(directusUrl)
    .with(
      rest({
        onRequest: (options) => ({ ...options, cache: "no-store" }),
        credentials: "include",
      })
    )
    .with(
      authentication("json", {
        storage,
        credentials: "include",
      })
    );
};

// Export the function to create a new instance
export default createDirectusClient;
