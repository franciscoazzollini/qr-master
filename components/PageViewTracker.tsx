"use client";

import { usePageView } from "@/components/usePageView";

export function PageViewTracker({
  restaurantId,
  path,
}: {
  restaurantId: string;
  path: string;
}) {
  usePageView(restaurantId, path);
  return null;
}
