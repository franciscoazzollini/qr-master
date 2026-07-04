import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "supabase", "migrations");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const dbUrl = process.env.SUPABASE_DB_URL;
const password = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in environment.");
  process.exit(1);
}

const ref = supabaseUrl.replace("https://", "").replace(".supabase.co", "");

const files = readdirSync(migrationsDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();

async function migrateViaManagementApi(file, query) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${file}: ${response.status} ${body}`);
  }
}

async function migrateViaPostgres(query) {
  const sql = dbUrl
    ? postgres(dbUrl, { max: 1 })
    : postgres({
        host:
          process.env.SUPABASE_POOLER_HOST ||
          "aws-1-ap-southeast-1.pooler.supabase.com",
        port: Number(process.env.SUPABASE_DB_PORT || 5432),
        database: "postgres",
        username: `postgres.${ref}`,
        password,
        ssl: "require",
        max: 1,
      });

  try {
    await sql.unsafe(query);
  } finally {
    await sql.end();
  }
}

if (!accessToken && !dbUrl && !password) {
  console.error(
    "Add one of these to .env.local:\n" +
      "  SUPABASE_DB_PASSWORD — Dashboard → Project Settings → Database → password\n" +
      "  SUPABASE_DB_URL — full postgres URI from the same page\n" +
      "  SUPABASE_ACCESS_TOKEN — Dashboard → Account → Access Tokens (starts with sbp_, NOT sb_secret_)\n\n" +
      "Note: sb_secret_ keys are project API keys (like service_role). They cannot run SQL migrations.\n" +
      "Alternatively, paste supabase/apply-pending.sql into the SQL Editor and run it manually.",
  );
  process.exit(1);
}

if (accessToken?.startsWith("sb_secret_")) {
  console.error(
    "SUPABASE_ACCESS_TOKEN looks like a project secret key (sb_secret_...).\n" +
      "Migrations need a personal access token (sbp_...) from Account → Access Tokens,\n" +
      "or use SUPABASE_DB_PASSWORD instead.",
  );
  process.exit(1);
}

console.log(`Applying ${files.length} migration file(s) to ${ref}...\n`);

for (const file of files) {
  const query = readFileSync(join(migrationsDir, file), "utf8");
  console.log(`→ ${file}`);

  try {
    if (accessToken) {
      await migrateViaManagementApi(file, query);
    } else {
      await migrateViaPostgres(query);
    }
    console.log("  done");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("already exists")) {
      console.log("  skipped (already applied)");
      continue;
    }
    console.error(`  failed: ${message}`);
    process.exit(1);
  }
}

console.log("\nMigrations applied successfully. Run: npm run db:verify");
