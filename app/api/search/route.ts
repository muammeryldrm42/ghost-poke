import { NextRequest, NextResponse } from "next/server";
import { searchUsers } from "@/lib/neynar";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 1) {
    return NextResponse.json({ users: [] });
  }

  const users = await searchUsers(q.replace("@", ""), 8);

  const cleaned = users.map((u) => ({
    fid: u.fid,
    username: u.username,
    displayName: u.display_name,
    pfpUrl: u.pfp_url,
    followerCount: u.follower_count,
    bio: u.profile?.bio?.text || "",
  }));

  return NextResponse.json({ users: cleaned });
}
