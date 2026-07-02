"use client";

import { useEffect } from "react";

export function usePageView(restaurantId: string, path: string) {
  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  }, [restaurantId, path]);
}
