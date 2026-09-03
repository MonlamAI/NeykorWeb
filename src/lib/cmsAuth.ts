import { auth } from "@/auth";
import axios from "axios";

export function apiBearerHeaders() {
  const key = process.env.API_ACCESS_KEY;
  if (!key) {
    throw new Error("API_ACCESS_KEY is not set");
  }
  return { Authorization: `Bearer ${key}` };
}

export function apiWriteHeaders(extra: Record<string, string> = {}) {
  return {
    ...apiBearerHeaders(),
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function assertCmsAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    throw new Error("Sign in required");
  }

  const apiUrl = process.env.API_URL;
  const response = await axios.get(
    `${apiUrl}/user/${encodeURIComponent(email)}`,
    { headers: apiWriteHeaders() }
  );
  if (response.data?.role !== "ADMIN") {
    throw new Error("Admin only");
  }
  return email;
}
