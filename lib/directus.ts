import { authentication, AuthenticationData, createDirectus, rest } from "@directus/sdk";
import { get as getServerCookie, set as setServerCookie } from "./cookies";

// Utility function for client-side cookie access
const getClientCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null; // Check if running in browser
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setClientCookie = (name: string, value: string, days: number): void => {
  if (typeof document === "undefined") return; // Check if running in browser
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
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
          return { access_token: accessToken, refresh_token: refreshToken, expires: 0, expires_at: 0 };
        },
        set: async (value: AuthenticationData | null) => {
          if (!value) return;
          if (!value.access_token || !value.refresh_token) {
            await setServerCookie(null);
            return;
          }
          setClientCookie("access_token", value.access_token, 1); // 1 day expiry for access token
          setClientCookie("refresh_token", value.refresh_token, 7); // 7 days expiry for refresh token
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
