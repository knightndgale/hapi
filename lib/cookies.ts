"use server";
/* eslint-disable import/no-anonymous-default-export */
import { AuthenticationData } from "@directus/sdk";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { convertTimeToMilliseconds } from "@/helpers/timeConverter";

export const get: () => Promise<AuthenticationData | null> = async () => {
  const ac = (await cookies()).get("access_token")?.value;
  const decoded = ac ? jwtDecode(ac) : null;

  const accessToken = (await cookies()).get("access_token")?.value || null;
  const refreshToken = (await cookies()).get("refresh_token")?.value || null;

  // Calculate expiration times
  const expiresInSeconds = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 0;
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + convertTimeToMilliseconds(process.env.ACCESS_TOKEN_TTL || "15m");

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires: expiresInSeconds,
    expires_at: expiresAt,
  };
};

export const set: (value: AuthenticationData | null) => Promise<unknown> | unknown = async (value: AuthenticationData | null) => {
  if (!value || !value.access_token || !value.refresh_token) {
    (await cookies()).delete("access_token");
    (await cookies()).delete("refresh_token");
    return;
  }

  const accessTokenTTL = process.env.ACCESS_TOKEN_TTL || "15m";
  const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || "1d";

  const accessTokenExpires = new Date(Date.now() + convertTimeToMilliseconds(accessTokenTTL));
  const refreshTokenExpires = new Date(Date.now() + convertTimeToMilliseconds(refreshTokenTTL));

  (await cookies()).set({
    name: "access_token",
    value: value.access_token,
    expires: accessTokenExpires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  (await cookies()).set({
    name: "refresh_token",
    value: value.refresh_token,
    expires: refreshTokenExpires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
