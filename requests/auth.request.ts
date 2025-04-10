import { createDirectusClient } from "../lib/directus";
import { errorHandler } from "../helpers/errorHandler";

export const login = async (email: string, password: string) => {
  const client = createDirectusClient();

  try {
    const response = await client.login(email, password);
    return { data: response, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const logout = async () => {
  const client = createDirectusClient();

  try {
    await client.logout();
    return { data: null, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const refresh = async () => {
  const client = createDirectusClient();

  try {
    const response = await client.refresh();
    return { data: response, success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
