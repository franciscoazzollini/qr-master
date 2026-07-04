import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const checks = [
  {
    name: "restaurants.owner_id",
    run: () => supabase.from("restaurants").select("owner_id").limit(1),
  },
  {
    name: "restaurants.slug",
    run: () => supabase.from("restaurants").select("slug").limit(1),
  },
  {
    name: "restaurants.settings",
    run: () => supabase.from("restaurants").select("settings").limit(1),
  },
  {
    name: "reservations table",
    run: () => supabase.from("reservations").select("id").limit(1),
  },
  {
    name: "page_views table",
    run: () => supabase.from("page_views").select("id").limit(1),
  },
];

let failed = 0;

for (const check of checks) {
  const { error } = await check.run();
  if (error) {
    console.error(`FAIL  ${check.name}: ${error.message}`);
    failed += 1;
  } else {
    console.log(`OK    ${check.name}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed. Run: npm run db:migrate`);
  process.exit(1);
}

console.log("\nDatabase schema looks good.");
