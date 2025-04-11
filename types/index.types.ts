import React, { JSXElementConstructor } from "react";

import { z } from "zod";
import { AuthenticationClient, DirectusClient, ItemType, Query, QueryFilter, RestClient, WebSocketClient } from "@directus/sdk";

export interface IJwtPayload {
  iss?: string;
  sub?: string;
  role?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  id?: string;
}

export const NotificationFeedback = z.enum(["success", "info", "warning", "error"]);

export type NotificationType = z.infer<typeof NotificationFeedback>;

export const Status = z.enum(["archived", "draft", "published"]);

export type Directus = DirectusClient<any> & RestClient<any> & WebSocketClient<any> & AuthenticationClient<any>;

export type LabelValueKeyType = {
  key?: string;
  value: string;
  label: string;
};

export type TDefaultFieldFilter<T> = Query<any, T>;

export type TDefaultRemapper<T> = { remapper: (value: T) => any };

export type DefaultAPIResponse = { message: string; success: boolean };
