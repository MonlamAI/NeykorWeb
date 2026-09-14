import React, { Suspense } from "react";
import { getGonpa } from "@/app/actions/getactions";
import { BACKGROUND_IMAGES } from "@/lib/utils";
import LoadingSkeleton from "./Skeleton";
import MonasteryDashboardClient from "./MonasteryDashboardClient";

export default function MonasteryDashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MonasteryDashboardContent />
    </Suspense>
  );
}

async function MonasteryDashboardContent() {
  const gonpadata = await getGonpa();
  return (
    <MonasteryDashboardClient
      monasteries={gonpadata as never[]}
      backgroundImages={BACKGROUND_IMAGES}
    />
  );
}
