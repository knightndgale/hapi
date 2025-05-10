import { createDirectusClient } from "@/lib/directus";
import { readFile, uploadFiles } from "@directus/sdk";

export const upload = async (form: FormData) => {
  try {
    const client = createDirectusClient();

    const response = await client.request(uploadFiles(form));
    return { success: true, data: response };
  } catch (e) {
    return { success: false, message: "Failed to upload file or File too large!" };
  }
};

export const read = async (id: string) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readFile(id))) as DirectusFileType;
    response.filename_disk = `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${response.filename_disk}`;
    return { success: true, data: response };
  } catch (e) {
    return { success: false, message: "Failed to read file" };
  }
};
