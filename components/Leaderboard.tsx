"use client";

import { useState, useEffect } from "react";
import { Trophy, Zap, Target, Loader2 } from "lucide-react";

type LeaderEntry = {
  fid: number;
  score: number;
  username: string;
};

export default function Leaderboard({
  onViewProfile,
}: {
  onViewProfile: (fid: number) => void;
}) {
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [data, setData] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${tab}`)
      .then((r) => r.json())
      .then((d) => setData(d.leaderboard || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Trophy size={20} className="text-ghost-neon" />
        <h2 className="text-lg font-bold font-display neon-text">
          Leaderboard
        </h2>
      </div>

      {/* Tab toggle */}
      <div className="flex bg-ghost-card rounded-xl p-1 gap-1">
        <button
          onClick={() => setTab("sent")}
          className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            tab === "sent"
              ? "bg-ghost-neon/20 text-ghost-neon"
              : "text-ghost-muted hover:text-ghost-text"
          }`}
        >
          <Zap size={14} />
          En Çok Dürten
        </button>
        <button
          onClick={() => setTab("received")}
          className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            tab === "received"
              ? "bg-ghost-accent/20 text-ghost-accent"
              : "text-ghost-muted hover:text-ghost-text"
          }`}
        >
          <Target size={14} />
          En Çok Dürtülen
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="text-ghost-neon animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 opacity-30">🏆</div>
          <p className="text-ghost-muted text-sm font-display">
            Henüz kimse poke atmamış
          </p>
          <p className="text-ghost-border text-xs font-mono mt-1">
            İlk sen ol!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((entry, i) => (
            <button
              key={entry.fid}
              onClick={() => onViewProfile(entry.fid)}
              className="w-full flex items-center gap-3 bg-ghost-card/60 hover:bg-ghost-card border border-ghost-border/30
                         rounded-xl px-4 py-3 transition-all animate-slide-up text-left"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-lg w-8 text-center flex-shrink-0">
                {i < 3 ? medals[i] : (
                  <span className="text-ghost-muted font-mono text-sm">
                    #{i + 1}
                  </span>
                )}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ghost-text font-display truncate">
                  @{entry.username}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm font-bold font-mono ${
                    tab === "sent" ? "text-ghost-neon" : "text-ghost-accent"
                  }`}
                >
                  {entry.score}
                </span>
                <span className="text-[10px] text-ghost-muted font-mono">
                  {tab === "sent" ? "poke" : "hit"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
