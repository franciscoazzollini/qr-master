import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Restaurant creation is temporarily disabled" },
    { status: 403 },
  );
}
