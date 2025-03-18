"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { LogOut } from "lucide-react";
import Link from "next/link";

export default function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (error) return <div>{error.message}</div>;

  if (isLoading) {
    return (
      <div className="w-[160px] h-[40px] bg-neutral-200 rounded-full animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center">
        <p>Hi <span className="font-bold">{user.name}</span> , you are logged in</p>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 h-[40px] w-[160px]"
          >
            <img
              src={user.picture || ""}
              className="w-8 h-8 rounded-full"
            />
            <span>{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-44" align="center">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className=" flex items-center justify-between">
            <a href="/api/auth/logout">Logout</a> <LogOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}


      <div className=" flex items-center space-x-6">
      <a href="/api/auth/logout" className=" border px-4 py-2 rounded-md">Logout</a> 
        <Link href="/admin" className=" border px-4 py-2 rounded-md">Check User List</Link>
      </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p>Please login to continue</p>
    <a
      href="/api/auth/login"
      className="h-[40px] border w-[120px] rounded inline-flex items-center justify-center"
    >
      Login
    </a>
    </div>
  );
}
