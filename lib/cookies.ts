"use server";
/* eslint-disable import/no-anonymous-default-export */
import { AuthenticationData } from "@directus/sdk";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const get: () => Promise<AuthenticationData | null> = async () => {
  const ac = (await cookies()).get("access_token")?.value;
  const decoded = ac ? jwtDecode(ac) : null;

  const accessToken = (await cookies()).get("access_token")?.value || null;
  const refreshToken = (await cookies()).get("refresh_token")?.value || null;

  const expiresInSeconds = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 0;
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 15 * 60 * 1000;

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires: expiresInSeconds,
    expires_at: expiresAt,
  };
};

export const set: (value: AuthenticationData | null) => Promise<unknown> | unknown = async (value: AuthenticationData | null) => {
  if (!value || !value.access_token || !value.refresh_token || !value.expires) {
    (await cookies()).delete("access_token");
    (await cookies()).delete("refresh_token");
    return;
  }
  const expiresAtDate = new Date(Date.now() + value.expires);

  (await cookies()).set({
    name: "access_token",
    value: value.access_token,
    expires: expiresAtDate,
  });
  (await cookies()).set({
    name: "refresh_token",
    value: value.refresh_token,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};
