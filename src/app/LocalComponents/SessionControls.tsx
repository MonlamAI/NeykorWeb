"use client";
import { signOut, useSession } from "next-auth/react";

export default function SessionControls() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm border px-3 py-1.5 rounded-md"
    >
      Sign out
    </button>
  );
}
