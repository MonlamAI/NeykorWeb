import { Suspense } from "react";
import {  getUser } from "@/app/actions/getactions";
import AccessClient from "./AccessClient";
import { AccessSkeleton } from "./AccessSkeleton";

function LoadingAccess() {
  return (
    <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AccessSkeleton />
    </div>
  );
}

export default function Access() {
  return (
    <Suspense fallback={<LoadingAccess />}>
      <AccessContent />
    </Suspense>
  );
}

async function AccessContent() {
  const users = await getUser();
  return <AccessClient users={users} />;
}