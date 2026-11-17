import axios from "axios";
import { NextResponse } from "next/server";
import { assertCmsAdmin, apiBearerHeaders } from "@/lib/cmsAuth";

export const runtime = "nodejs";

type PresignBody = {
  contentType: string;
  fileExtension: string;
};

export async function POST(request: Request) {
  try {
    await assertCmsAdmin();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sign in required";
    const status = message === "Admin only" ? 403 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }

  let body: PresignBody;
  try {
    body = (await request.json()) as PresignBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.contentType?.trim() || !body.fileExtension?.trim()) {
    return NextResponse.json(
      { ok: false, error: "contentType and fileExtension are required" },
      { status: 400 }
    );
  }

  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { ok: false, error: "API_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.post(
      `${apiUrl}/api/upload/presign`,
      {
        content_type: body.contentType,
        file_extension: body.fileExtension,
      },
      { headers: apiBearerHeaders() }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : `Presign failed (${error.response?.status ?? 500})`;
      return NextResponse.json(
        { ok: false, error: message },
        { status: error.response?.status ?? 500 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Presign failed" },
      { status: 500 }
    );
  }
}