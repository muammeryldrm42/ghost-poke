import { kv } from "@vercel/kv";

export type PokeRecord = {
  pokerFid: number;
  pokerUsername: string;
  targetFid: number;
  targetUsername: string;
  timestamp: number;
};

export type PokeStats = {
  fid: number;
  username: string;
  pokesSent: number;
  pokesReceived: number;
  ghostLevel: string;
};

// Record a poke
export async function recordPoke(poke: PokeRecord): Promise<void> {
  const id = `poke:${poke.pokerFid}:${poke.targetFid}:${poke.timestamp}`;

  // Store the poke record
  await kv.set(id, poke, { ex: 60 * 60 * 24 * 90 }); // 90 days TTL

  // Increment sent/received counters
  await kv.hincrby(`stats:${poke.pokerFid}`, "sent", 1);
  await kv.hincrby(`stats:${poke.targetFid}`, "received", 1);

  // Store username mappings
  await kv.hset(`stats:${poke.pokerFid}`, { username: poke.pokerUsername });
  await kv.hset(`stats:${poke.targetFid}`, { username: poke.targetUsername });

  // Add to recent pokes list (keep last 100)
  await kv.lpush("recent_pokes", JSON.stringify(poke));
  await kv.ltrim("recent_pokes", 0, 99);

  // Add to target's inbox
  await kv.lpush(`inbox:${poke.targetFid}`, JSON.stringify(poke));
  await kv.ltrim(`inbox:${poke.targetFid}`, 0, 49);

  // Track streak
  await updateStreak(poke.pokerFid, poke.targetFid);

  // Update leaderboard sorted sets
  await kv.zincrby("leaderboard:sent", 1, `${poke.pokerFid}`);
  await kv.zincrby("leaderboard:received", 1, `${poke.targetFid}`);
}

// Get inbox for a user
export async function getInbox(fid: number, limit = 20): Promise<PokeRecord[]> {
  try {
    const raw = await kv.lrange(`inbox:${fid}`, 0, limit - 1);
    return raw.map((item: unknown) =>
      typeof item === "string" ? JSON.parse(item) : (item as PokeRecord)
    );
  } catch {
    return [];
  }
}

// Get recent pokes
export async function getRecentPokes(limit = 20): Promise<PokeRecord[]> {
  try {
    const raw = await kv.lrange("recent_pokes", 0, limit - 1);
    return raw.map((item: unknown) =>
      typeof item === "string" ? JSON.parse(item) : (item as PokeRecord)
    );
  } catch {
    return [];
  }
}

// Get leaderboard
export async function getLeaderboard(
  type: "sent" | "received",
  limit = 10
): Promise<{ fid: number; score: number; username: string }[]> {
  try {
    const results = await kv.zrange(`leaderboard:${type}`, 0, limit - 1, {
      rev: true,
      withScores: true,
    });

    const entries: { fid: number; score: number; username: string }[] = [];
    for (let i = 0; i < results.length; i += 2) {
      const fid = parseInt(results[i] as string, 10);
      const score = results[i + 1] as number;
      const stats = await kv.hgetall(`stats:${fid}`);
      entries.push({
        fid,
        score,
        username: (stats?.username as string) || `fid:${fid}`,
      });
    }
    return entries;
  } catch {
    return [];
  }
}

// Streak tracking
async function updateStreak(pokerFid: number, targetFid: number) {
  const key = `streak:${pokerFid}:${targetFid}`;
  const now = Date.now();
  const lastPoke = await kv.get<number>(`${key}:last`);

  if (lastPoke) {
    const diff = now - lastPoke;
    const oneDay = 24 * 60 * 60 * 1000;
    if (diff < oneDay * 2) {
      // Within 2 days, increment streak
      await kv.incr(key);
    } else {
      // Streak broken, reset
      await kv.set(key, 1);
    }
  } else {
    await kv.set(key, 1);
  }
  await kv.set(`${key}:last`, now);
}

export async function getStreak(
  pokerFid: number,
  targetFid: number
): Promise<number> {
  try {
    const streak = await kv.get<number>(`streak:${pokerFid}:${targetFid}`);
    return streak || 0;
  } catch {
    return 0;
  }
}

// Ghost level based on total pokes sent
export function getGhostLevel(pokesSent: number): {
  name: string;
  emoji: string;
} {
  if (pokesSent >= 100) return { name: "Phantom Lord", emoji: "💀" };
  if (pokesSent >= 50) return { name: "Shadow Specter", emoji: "🌑" };
  if (pokesSent >= 25) return { name: "Night Wraith", emoji: "🦇" };
  if (pokesSent >= 10) return { name: "Haunting Ghost", emoji: "👻" };
  if (pokesSent >= 5) return { name: "Whispering Shade", emoji: "🌫️" };
  return { name: "Baby Boo", emoji: "🫧" };
}
