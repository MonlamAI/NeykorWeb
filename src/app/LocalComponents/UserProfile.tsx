"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="w-[160px] h-[40px] bg-neutral-200 rounded-full animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center">
        <p>Hi <span className="font-bold">{user.name}</span> , you are logged in</p>
      <div className=" flex items-center space-x-6">
      <button
        type="button"
        onClick={() => signOut()}
        className=" border px-4 py-2 rounded-md"
      >
        Logout
      </button>
        <Link href="/admin" className=" border px-4 py-2 rounded-md">Check User List</Link>
      </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p>Please login to continue</p>
    <button
      type="button"
      onClick={() => signIn("google")}
      className="h-[40px] border w-[120px] rounded inline-flex items-center justify-center"
    >
      Login
    </button>
    </div>
  );
}
