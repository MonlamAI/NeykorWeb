"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 h-[40px] w-[160px]"
          >
            <img
              src={user.picture || ""}
              alt={user.name || ""}
              className="w-8 h-8 rounded-full"
            />
            <span>{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-44" align="center">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className=" flex items-center justify-between">
            <Link href="/api/auth/logout">Logout</Link> <LogOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href="/api/auth/login"
      className="h-[40px] w-[160px] inline-flex items-center justify-center"
    >
      Login
    </Link>
  );
}
