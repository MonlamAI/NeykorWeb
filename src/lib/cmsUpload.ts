const PROXY_UPLOAD_MAX_BYTES = 4 * 1024 * 1024;

type UploadResponse =
  | { ok: true; file_url: string }
  | { ok: false; error: string };

type PresignResponse =
  | {
      ok: true;
      file_url: string;
      upload_url: string;
      fields: Record<string, string>;
    }
  | { ok: false; error: string };

function fileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "bin";
}

async function uploadViaProxy(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/cms/upload", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  let body: UploadResponse;
  try {
    body = (await response.json()) as UploadResponse;
  } catch {
    throw new Error(
      response.status === 413
        ? "File is too large for the server. Try a smaller file (under 4MB on Vercel)."
        : "Upload failed. Please try again."
    );
  }

  if (!response.ok || !body.ok) {
    const message =
      body.ok === false ? body.error : `Upload failed (${response.status})`;
    throw new Error(message);
  }

  if (!body.file_url) {
    throw new Error("Upload succeeded but no file URL was returned");
  }

  return body.file_url;
}

async function uploadViaPresignedPost(file: File): Promise<string> {
  const presignResponse = await fetch("/api/cms/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      contentType: file.type || "application/octet-stream",
      fileExtension: fileExtension(file.name),
    }),
  });

  let presign: PresignResponse;
  try {
    presign = (await presignResponse.json()) as PresignResponse;
  } catch {
    throw new Error("Could not prepare direct upload. Try again.");
  }

  if (!presignResponse.ok || presign.ok === false) {
    const message =
      presign.ok === false ? presign.error : "Could not prepare direct upload";
    throw new Error(message);
  }

  const s3Form = new FormData();
  Object.entries(presign.fields).forEach(([key, value]) => {
    s3Form.append(key, value);
  });
  s3Form.append("file", file);

  const s3Response = await fetch(presign.upload_url, {
    method: "POST",
    body: s3Form,
  });

  if (!s3Response.ok) {
    throw new Error(
      `Direct upload to storage failed (${s3Response.status}). The file may be too large (max 10MB).`
    );
  }

  return presign.file_url;
}

/**
 * Upload CMS media (images/MP3). Uses proxy for small files; direct S3 presigned POST for larger files (Vercel-safe).
 */
export async function uploadCmsMediaFile(file: File): Promise<string> {
  if (file.size <= PROXY_UPLOAD_MAX_BYTES) {
    return uploadViaProxy(file);
  }
  return uploadViaPresignedPost(file);
}