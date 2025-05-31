"use server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMe } from "@/requests/auth.request";
import { TokenManager } from "@/lib/tokenManager";

const debug = (message: string, data?: any) => {
  console.log(`🔐 [Middleware] ${message}`, data ? data : "");
};

/**
 * Middleware Documentation
 *
 * This middleware handles authentication and authorization for protected routes in the application.
 * It manages token validation, refresh, and redirection based on authentication status.
 *
 * Key Features:
 * - Protects specified routes from unauthorized access
 * - Handles cookie-based authentication
 * - Provides debug logging for development
 * - Implements automatic token refresh for both public and protected routes
 * - Maintains session continuity by refreshing tokens when possible
 *
 * Route Protection:
 * - Protected routes require valid authentication
 * - Public routes remain accessible without authentication
 * - Token refresh is attempted on all routes where tokens exist
 * - Redirects to login only occur for protected routes when authentication fails
 *
 * Token Management:
 * - Validates access tokens
 * - Refreshes expired tokens using refresh tokens
 * - Sets new tokens in cookies with appropriate TTL
 * - Attempts token refresh on all routes where tokens exist
 * - Clears invalid tokens and redirects to login for protected routes
 *
 * Environment Variables:
 * - ACCESS_TOKEN_TTL: Access token time-to-live (default: "2m")
 * - REFRESH_TOKEN_TTL: Refresh token time-to-live (default: "1d")
 *
 * @module middleware
 * @function middleware
 * @param {NextRequest} request - The incoming request object
 * @returns {NextResponse} The response object with appropriate headers and redirects
 */

// Paths that require authentication
const protectedPaths = ["/dashboard", "/profile", "/api/guests", "/events/create", "/events/[id]/guests", "/invite/[eventId]/[guestId]"];

// Helper function to handle token refresh
async function handleTokenRefresh(request: NextRequest, refreshToken: string | undefined) {
  if (!refreshToken) return null;

  const tokenManager = TokenManager.getInstance();
  try {
    const validTokens = await tokenManager.refreshTokens(refreshToken);
    if (!validTokens) return null;

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
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenManager = TokenManager.getInstance();
  // Debug logging
  debug("Processing request", { pathname });

  // Get tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  debug("Token check", { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

  // Check if the path requires authentication (startsWith match)
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path.replace(/\[.*?\]/g, "")));

  // If no tokens exist and route requires auth, redirect to login
  if (!accessToken && !refreshToken && requiresAuth) {
    debug("No tokens and route requires auth, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If access token exists, check if it's expired
  if (accessToken) {
    try {
      const response = await getMe();
      if (!response.success) {
        debug("getMe failed, trying refresh");
        const refreshResponse = await handleTokenRefresh(request, refreshToken);
        if (refreshResponse) return refreshResponse;

        // If refresh failed and route requires auth, redirect to login
        if (requiresAuth) {
          debug("Token refresh failed and route requires auth, redirecting to login");
          const response = NextResponse.redirect(new URL("/login", request.url));
          response.cookies.delete("access_token");
          response.cookies.delete("refresh_token");
          return response;
        }
      }
      debug("Access token valid");
      return NextResponse.next();
    } catch (error) {
      debug("Access token invalid, trying refresh");
      const refreshResponse = await handleTokenRefresh(request, refreshToken);
      if (refreshResponse) return refreshResponse;

      // If refresh failed and route requires auth, redirect to login
      if (requiresAuth) {
        debug("Token refresh failed and route requires auth, redirecting to login");
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    }
  }

  // Try to refresh the token if we have a refresh token
  if (refreshToken) {
    const refreshResponse = await handleTokenRefresh(request, refreshToken);
    if (refreshResponse) return refreshResponse;

    // If refresh failed and route requires auth, redirect to login
    if (requiresAuth) {
      debug("Token refresh failed and route requires auth, redirecting to login");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // If we get here and route requires auth, redirect to login
  if (requiresAuth) {
    debug("No valid tokens and route requires auth, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For public routes or if we have valid tokens, proceed
  return NextResponse.next();
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
