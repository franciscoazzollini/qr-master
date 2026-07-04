const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const callback = `${appUrl.replace(/\/$/, "")}/auth/callback`;

console.log("Add these URLs in Supabase Dashboard → Authentication → URL Configuration:\n");
console.log(`  Site URL: ${appUrl}`);
console.log(`  Redirect URL: ${callback}`);
console.log("\nFor production, also add your Netlify URL, e.g.:");
console.log("  https://your-site.netlify.app/auth/callback");
