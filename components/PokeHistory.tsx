"use client";

import { useState, useEffect } from "react";
import { Inbox, Reply, Loader2, Clock } from "lucide-react";
import type { SearchUser } from "./GhostPokeApp";

type PokeRecord = {
  pokerFid: number;
  pokerUsername: string;
  targetFid: number;
  targetUsername: string;
  timestamp: number;
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "şimdi";
  if (mins < 60) return `${mins}dk`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa`;
  const days = Math.floor(hours / 24);
  return `${days}g`;
}

export default function PokeHistory({
  fid,
  onViewProfile,
  onPokeBack,
}: {
  fid: number;
  onViewProfile: (fid: number) => void;
  onPokeBack: (user: SearchUser) => void;
}) {
  const [pokes, setPokes] = useState<PokeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fid) return;
    fetch(`/api/poke?type=inbox&fid=${fid}`)
      .then((r) => r.json())
      .then((d) => setPokes(d.pokes || []))
      .catch(() => setPokes([]))
      .finally(() => setLoading(false));
  }, [fid]);

  const handlePokeBack = (poke: PokeRecord) => {
    onPokeBack({
      fid: poke.pokerFid,
      username: poke.pokerUsername,
      displayName: poke.pokerUsername,
      pfpUrl: "",
      followerCount: 0,
      bio: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Inbox size={20} className="text-ghost-accent" />
        <h2 className="text-lg font-bold font-display">
          <span className="text-ghost-accent">Beni</span>{" "}
          <span className="text-ghost-text">Kim Dürttü?</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="text-ghost-neon animate-spin" />
        </div>
      ) : pokes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 opacity-30">📭</div>
          <p className="text-ghost-muted text-sm font-display">
            Henüz kimse seni dürtememiş
          </p>
          <p className="text-ghost-border text-xs font-mono mt-1">
            Ghost Poke&apos;u paylaşarak başla!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pokes.map((poke, i) => (
            <div
              key={`${poke.pokerFid}-${poke.timestamp}`}
              className="flex items-center gap-3 bg-ghost-card/60 border border-ghost-border/30
                         rounded-xl px-4 py-3 animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Ghost emoji */}
              <div className="text-2xl flex-shrink-0">👻</div>

              {/* Info */}
              <button
                onClick={() => onViewProfile(poke.pokerFid)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-sm font-medium text-ghost-text font-display truncate">
                  <span className="text-ghost-neon">@{poke.pokerUsername}</span>{" "}
                  seni dürttü!
                </p>
                <p className="text-[10px] text-ghost-muted font-mono flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {timeAgo(poke.timestamp)}
                </p>
              </button>

              {/* Poke back button */}
              <button
                onClick={() => handlePokeBack(poke)}
                className="flex items-center gap-1.5 bg-ghost-neon/10 hover:bg-ghost-neon/20
                           text-ghost-neon px-3 py-1.5 rounded-lg transition-all
                           text-xs font-mono uppercase tracking-wider flex-shrink-0"
              >
                <Reply size={12} />
                Karşılık
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
