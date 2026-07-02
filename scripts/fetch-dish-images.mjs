#!/usr/bin/env node
/**
 * Downloads curated Pexels food/drink images into public/demo/dishes/.
 * Run: node scripts/fetch-dish-images.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/demo/dishes");

const PEXELS = {
  burrata: "1435904/pexels-photo-1435904",
  carpaccio: "361184/asparagus-steak-veal-steak-veal-361184",
  paella: "5560763/pexels-photo-5560763",
  salmon: "46239/salmon-dish-food-meal-46239",
  ribeye: "3535383/pexels-photo-3535383",
  tiramisu: "6880219/pexels-photo-6880219",
  "panna-cotta": "1126359/pexels-photo-1126359",
  cheesecake: "291528/pexels-photo-291528",
  sangria: "1283219/pexels-photo-1283219",
  espresso: "302899/pexels-photo-302899",
  "category-mains": "1640777/pexels-photo-1640777",
  "category-desserts": "4553622/pexels-photo-4553622",
};

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

async function download(name, slug) {
  const url = `https://images.pexels.com/photos/${slug}.jpeg?auto=compress&cs=tinysrgb&w=900`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Failed ${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(outDir, `${name}.jpg`), buf);
  console.log(`ok ${name}.jpg`);
}

await mkdir(outDir, { recursive: true });
for (const [name, slug] of Object.entries(PEXELS)) {
  await download(name, slug);
}
console.log("Done.");
