const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || "";
const NEYNAR_BASE = "https://api.neynar.com/v2/farcaster";

export type NeynarUser = {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
  profile?: {
    bio?: {
      text?: string;
    };
  };
};

export async function searchUsers(query: string, limit = 8): Promise<NeynarUser[]> {
  if (!query || query.length < 1) return [];

  try {
    const res = await fetch(
      `${NEYNAR_BASE}/user/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          "x-api-key": NEYNAR_API_KEY,
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      console.error("Neynar search error:", res.status);
      return [];
    }

    const data = await res.json();
    return data.result?.users || [];
  } catch (err) {
    console.error("Neynar search failed:", err);
    return [];
  }
}

export async function getUserByFid(fid: number): Promise<NeynarUser | null> {
  try {
    const res = await fetch(
      `${NEYNAR_BASE}/user/bulk?fids=${fid}`,
      {
        headers: {
          "x-api-key": NEYNAR_API_KEY,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.users?.[0] || null;
  } catch {
    return null;
  }
}
