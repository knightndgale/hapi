import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createDirectusClient } from "@/lib/directus";
import { convertTimeToMilliseconds } from "@/helpers/timeConverter";
import { getCurrentUser } from "@/requests/auth.request";
import { TokenManager } from "@/lib/tokenManager";

const debug = (message: string, data?: any) => {
  console.log(`🔐 [Middleware] ${message}`, data ? data : "");
};

// Paths that require authentication
const protectedPaths = ["/dashboard", "/profile", "/api/guests", "/events/create", "/events/[id]", "/events/[id]/guests", "/invite/[eventId]/[guestId]"];

// Paths that should be accessible without authentication
const publicPaths = ["/login", "/signup", "/", "/api/auth", "/about", "/faq", "/privacy"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenManager = TokenManager.getInstance();

  // Debug logging
  debug("Processing request", { pathname });

  // Check if the path is public (exact match)
  if (publicPaths.includes(pathname)) {
    debug("Path is public (exact match)");
    return NextResponse.next();
  }

  // Check if the path requires authentication (startsWith match)
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path.replace(/\[.*?\]/g, "")));

  if (!requiresAuth) {
    debug("Path does not require auth");
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  debug("Token check", { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

  // If no tokens exist, redirect to login
  if (!accessToken && !refreshToken) {
    debug("No tokens, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If access token exists, check if it's expired
  if (accessToken) {
    try {
      const response = await getCurrentUser();
      if (!response.success) {
        debug("getCurrentUser failed, trying refresh");
        // If getCurrentUser fails, try to refresh the token
        if (refreshToken) {
          const validTokens = await tokenManager.refreshTokens(refreshToken);
          if (!validTokens) {
            debug("Token refresh failed, redirecting to login");
            return NextResponse.redirect(new URL("/login", request.url));
          }

          const response = NextResponse.next();

          // Set new tokens in cookies
          const accessTokenTTL = process.env.ACCESS_TOKEN_TTL || "2m";
          const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || "1d";

          response.cookies.set({
            name: "access_token",
            value: String(validTokens.access_token),
            expires: tokenManager.getTokenExpiration(accessTokenTTL),
          });

          response.cookies.set({
            name: "refresh_token",
            value: String(validTokens.refresh_token),
            expires: tokenManager.getTokenExpiration(refreshTokenTTL),
          });

          debug("Token refresh successful");
          return response;
        }
        debug("No refresh token available, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }
      debug("Access token valid");
      return NextResponse.next();
    } catch (error) {
      debug("Access token invalid, trying refresh");
    }
  }

  // Try to refresh the token
  if (refreshToken) {
    try {
      const validTokens = await tokenManager.refreshTokens(refreshToken);
      if (!validTokens) {
        debug("Token refresh failed, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const response = NextResponse.next();

      // Set new tokens in cookies
      const accessTokenTTL = process.env.ACCESS_TOKEN_TTL || "2m";
      const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || "1d";

      response.cookies.set({
        name: "access_token",
        value: String(validTokens.access_token),
        expires: tokenManager.getTokenExpiration(accessTokenTTL),
      });

      response.cookies.set({
        name: "refresh_token",
        value: String(validTokens.refresh_token),
        expires: tokenManager.getTokenExpiration(refreshTokenTTL),
      });

      debug("Token refresh successful");
      return response;
    } catch (error) {
      debug("Token refresh failed with error", error);
      // Refresh failed, clear tokens and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // If we get here, redirect to login
  debug("No valid tokens, redirecting to login");
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
