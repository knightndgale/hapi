import { createDirectusClient } from "../lib/directus";
import { errorHandler } from "../helpers/errorHandler";
import { AuthenticationData, createUser, DirectusRole, DirectusUser, readMe, refresh } from "@directus/sdk";
import { User } from "@/types/schema/User.schema";
import { TDefaultFieldFilter } from "@/types/index.types";
import { Roles } from "@/constants/roles.enum";
import { getRoles } from "./roles.request";

export const getMe = async (
  props: Partial<TDefaultFieldFilter<Pick<DirectusRole, "name" | "id">>> = {
    fields: ["first_name", "last_name", "email", "role.*"],
  }
) => {
  try {
    const client = createDirectusClient();
    const user = (await client.request(readMe(props))) as unknown as DirectusUser;
    if (!user.email || !user.first_name || !user.last_name) throw Error("Failed to get user details");
    return { data: user, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
export const login = async (email: string, password: string) => {
  const client = createDirectusClient();

  try {
    const response = await client.login(email, password);
    // Get user details after successful login

    const user = await getMe({ fields: ["first_name", "last_name", "email", "role.*"] });
    if (!user.success) throw Error("Failed to get user details");

    // Store user details in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        first_name: user.data?.first_name,
        last_name: user.data?.last_name,
        email: user.data?.email,
      })
    );
    return { data: response, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const logout = async () => {
  const client = createDirectusClient();
  localStorage.removeItem("user");
  try {
    await client.logout();
    return { data: { message: "Logged out successfully" }, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const refreshAuthentication = async (refresh_token: string) => {
  const client = createDirectusClient();

  try {
    const response = (await client.request(refresh("json", refresh_token))) as AuthenticationData;
    if (!response?.access_token || !response?.refresh_token) {
      throw new Error("Invalid refresh response");
    }
    return { data: response, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const signup = async (userDetails: User & { password: string }) => {
  const client = createDirectusClient();

  try {
    const roles = await getRoles({
      filter: {
        name: Roles.User,
      },
      fields: ["id"],
    });
    if (!roles.success || !roles.data?.[0]) throw Error("Failed to get roles");
    const response = await client.request(createUser({ ...userDetails, role: roles.data?.[0] }));
    return { data: response, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
