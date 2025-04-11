import { errorHandler } from "@/helpers/errorHandler";
import { createDirectusClient } from "@/lib/directus";
import { readRoles } from "@directus/sdk";
import { TDefaultFieldFilter } from "@/types/index.types";
import { DirectusRole } from "@directus/sdk";

export const getRoles = async (props: Partial<TDefaultFieldFilter<Pick<DirectusRole, "name" | "id">>> = { fields: ["*"] }) => {
  try {
    const client = createDirectusClient();
    const roles = (await client.request(readRoles(props))) as unknown as DirectusRole[];
    return { data: roles, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
