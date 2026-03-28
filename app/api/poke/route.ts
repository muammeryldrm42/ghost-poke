import { NextRequest, NextResponse } from "next/server";
import { recordPoke, getInbox, getRecentPokes, getStreak, getGhostLevel } from "@/lib/kv";

// POST — record a poke
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pokerFid, pokerUsername, targetFid, targetUsername } = body;

    if (!pokerFid || !targetFid) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (pokerFid === targetFid) {
      return NextResponse.json(
        { error: "You can't poke yourself, ghost!" },
        { status: 400 }
      );
    }

    const poke = {
      pokerFid,
      pokerUsername: pokerUsername || `fid:${pokerFid}`,
      targetFid,
      targetUsername: targetUsername || `fid:${targetFid}`,
      timestamp: Date.now(),
    };

    await recordPoke(poke);

    const streak = await getStreak(pokerFid, targetFid);
    const ghostLevel = getGhostLevel(streak);

    return NextResponse.json({
      success: true,
      poke,
      streak,
      ghostLevel,
    });
  } catch (err) {
    console.error("Poke error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET — fetch inbox or recent pokes
export async function GET(request: NextRequest) {
  const fid = request.nextUrl.searchParams.get("fid");
  const type = request.nextUrl.searchParams.get("type") || "recent";

  try {
    if (type === "inbox" && fid) {
      const inbox = await getInbox(parseInt(fid, 10));
      return NextResponse.json({ pokes: inbox });
    }

    const recent = await getRecentPokes();
    return NextResponse.json({ pokes: recent });
  } catch {
    return NextResponse.json({ pokes: [] });
  }
}
