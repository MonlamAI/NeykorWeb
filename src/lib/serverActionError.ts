const GENERIC_SERVER_ACTION_PATTERNS = [
  /Server Components render/i,
  /omitted in production builds/i,
  /digest property is included/i,
];

export function isGenericServerActionError(message: string): boolean {
  return GENERIC_SERVER_ACTION_PATTERNS.some((pattern) => pattern.test(message));
}

export function formatActionError(error: unknown, fallback: string): string {
  if (error == null) {
    return fallback;
  }

  if (typeof error === "object" && "error" in error && typeof (error as { error: unknown }).error === "string") {
    const msg = (error as { error: string }).error;
    if (msg && !isGenericServerActionError(msg)) {
      return msg;
    }
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;

  if (!message || isGenericServerActionError(message)) {
    return fallback;
  }

  return message;
}