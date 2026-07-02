import { getSupabase } from "../supabase";
import type { ViewCounts } from "../types";

export async function recordPageView(
  restaurantId: string,
  path: string,
): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from("page_views").insert({
    restaurant_id: restaurantId,
    path: path.slice(0, 200),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getViewCounts(
  restaurantId: string,
): Promise<ViewCounts> {
  const supabase = getSupabase();
  const now = new Date();
  const days7 = new Date(now);
  days7.setDate(days7.getDate() - 7);
  const days30 = new Date(now);
  days30.setDate(days30.getDate() - 30);

  const { data: views30d, error } = await supabase
    .from("page_views")
    .select("path, created_at")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", days30.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  const rows = views30d ?? [];
  const cutoff7 = days7.getTime();

  let total7d = 0;
  const pathCounts = new Map<string, number>();

  for (const row of rows) {
    const created = new Date(row.created_at as string).getTime();
    if (created >= cutoff7) total7d += 1;
    const path = row.path as string;
    pathCounts.set(path, (pathCounts.get(path) ?? 0) + 1);
  }

  const topPaths = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  return {
    total7d,
    total30d: rows.length,
    topPaths,
  };
}
