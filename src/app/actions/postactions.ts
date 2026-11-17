"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { apiWriteHeaders, assertCmsAdmin } from "@/lib/cmsAuth";
import {
  actionFail,
  actionOk,
  type ActionResult,
} from "@/lib/actionResult";
import { proxyFileToApiUpload, uploadErrorMessage } from "@/lib/cmsMediaUpload";

const url = process.env.API_URL;

function writeApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail) {
      return detail;
    }
    console.error("API Error:", error.response?.data || error.message);
    return fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

/**
 * @deprecated Use client `uploadCmsMediaFile` → `/api/cms/upload` instead.
 * Kept for backward compatibility; still subject to server action body limits.
 */
export async function createS3UploadUrl(formData: FormData) {
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    throw new Error("File is required");
  }
  await assertCmsAdmin();
  try {
    return await proxyFileToApiUpload(file);
  } catch (error) {
    throw new Error(uploadErrorMessage(error));
  }
}

export async function postfestival(data: unknown): Promise<ActionResult<unknown>> {
  try {
    await assertCmsAdmin();
    const response = await axios.post(`${url}/festival`, data, {
      headers: apiWriteHeaders(),
    });
    revalidatePath("/[locale]/Festival");
    revalidatePath("/[locale]/(mainroutes)/Festival");
    return actionOk(response.data);
  } catch (error) {
    return actionFail(
      writeApiErrorMessage(error, "Failed to create festival")
    );
  }
}

export async function postStatue(data: unknown): Promise<ActionResult<unknown>> {
  try {
    await assertCmsAdmin();
    const response = await axios.post(`${url}/statue`, data, {
      headers: apiWriteHeaders(),
    });
    return actionOk(response.data);
  } catch (error) {
    return actionFail(writeApiErrorMessage(error, "Failed to create statue"));
  }
}

export async function createUser(userData: unknown) {
  try {
    const response = await axios.post(`${url}/user`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("User creation failed:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw error;
  }
}

export async function creategonpa(
  data: unknown
): Promise<ActionResult<unknown>> {
  try {
    await assertCmsAdmin();
    const response = await axios.post(`${url}/gonpa`, data, {
      headers: apiWriteHeaders(),
    });
    return actionOk(response.data);
  } catch (error) {
    return actionFail(
      writeApiErrorMessage(error, "Failed to create monastery")
    );
  }
}

export async function createcontact(
  data: unknown
): Promise<ActionResult<string>> {
  try {
    await assertCmsAdmin();
    const response = await axios.post(`${url}/contact`, data, {
      headers: apiWriteHeaders(),
    });
    return actionOk(response.data.id as string);
  } catch (error) {
    return actionFail(writeApiErrorMessage(error, "Failed to create contact"));
  }
}

export async function createSacred(
  data: unknown
): Promise<ActionResult<unknown>> {
  try {
    await assertCmsAdmin();
    const response = await axios.post(`${url}/pilgrim`, data, {
      headers: apiWriteHeaders(),
    });
    revalidatePath("/[locale]/Sacred");
    revalidatePath("/[locale]/(mainroutes)/Sacred");
    return actionOk(response.data);
  } catch (error) {
    return actionFail(
      writeApiErrorMessage(error, "Failed to create pilgrim site")
    );
  }
}