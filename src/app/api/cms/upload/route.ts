import axios from "axios";
import { NextResponse } from "next/server";
import { assertCmsAdmin } from "@/lib/cmsAuth";
import { proxyFileToApiUpload, uploadErrorMessage } from "@/lib/cmsMediaUpload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await assertCmsAdmin();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sign in required";
    const status = message === "Admin only" ? 403 : 401;
    return NextResponse.json({ ok: false, error: message }, { status });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid upload request" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { ok: false, error: "File is required" },
      { status: 400 }
    );
  }

  try {
    const file_url = await proxyFileToApiUpload(file);
    return NextResponse.json({ ok: true, file_url });
  } catch (error) {
    const errorMessage = uploadErrorMessage(error);
    const status =
      axios.isAxiosError(error) && error.response?.status
        ? error.response.status
        : 500;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status }
    );
  }
}