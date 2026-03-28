import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/kv";

export async function GET(request: NextRequest) {
  const type =
    (request.nextUrl.searchParams.get("type") as "sent" | "received") || "sent";

  try {
    const leaderboard = await getLeaderboard(type, 10);
    return NextResponse.json({ leaderboard });
  } catch {
    return NextResponse.json({ leaderboard: [] });
  }
}
