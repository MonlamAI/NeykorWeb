import axios from "axios";
import { apiBearerHeaders } from "@/lib/cmsAuth";

export async function proxyFileToApiUpload(file: File | Blob): Promise<string> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }

  const apiFormData = new FormData();
  apiFormData.append("file", file);

  const response = await axios.post(`${apiUrl}/api/upload`, apiFormData, {
    headers: {
      ...apiBearerHeaders(),
      Accept: "application/json",
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  if (!response.data?.file_url) {
    throw new Error("Invalid response format: missing file_url");
  }

  return response.data.file_url as string;
}

export function uploadErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const detail = error.response?.data?.detail;
    const detailText =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => (typeof d === "object" && d && "msg" in d ? String((d as { msg: string }).msg) : String(d))).join(", ")
          : error.message;

    if (statusCode === 401 || statusCode === 403) {
      return "Authentication failed — check API key and admin access";
    }
    if (statusCode === 413) {
      return "File size too large";
    }
    return detailText ? `Upload failed: ${detailText}` : `Upload failed: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }
  return "Upload failed";
}