"use client";

import { useState, useCallback } from "react";
import { sdk } from "@/lib/farcaster-sdk";
import { Search, Trophy, Inbox, Ghost } from "lucide-react";
import type { MiniAppContextData } from "@/app/page";
import SearchBar from "./SearchBar";
import UserCard from "./UserCard";
import PokeButton from "./PokeButton";
import GhostAnimation from "./GhostAnimation";
import Leaderboard from "./Leaderboard";
import PokeHistory from "./PokeHistory";

export type SearchUser = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  followerCount: number;
  bio: string;
};

type Tab = "search" | "leaderboard" | "inbox";

export default function GhostPokeApp({
  context,
}: {
  context: MiniAppContextData;
}) {
  const [tab, setTab] = useState<Tab>("search");
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [poking, setPoking] = useState(false);
  const [showBlast, setShowBlast] = useState(false);
  const [lastStreak, setLastStreak] = useState(0);

  const appUrl = process.env.NEXT_PUBLIC_URL || "https://ghost-poke.vercel.app";

  const handlePoke = useCallback(async () => {
    if (!selectedUser || poking) return;

    setPoking(true);

    try {
      // Haptic feedback
      if (context.isInMiniApp) {
        try {
          await sdk.haptics.impactOccurred("heavy");
        } catch {}
      }

      // Record poke in backend
      const res = await fetch("/api/poke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pokerFid: context.user.fid,
          pokerUsername: context.user.username || "anon",
          targetFid: selectedUser.fid,
          targetUsername: selectedUser.username,
        }),
      });

      const data = await res.json();
      if (data.streak) setLastStreak(data.streak);

      // Show blast animation
      setShowBlast(true);
      setTimeout(() => setShowBlast(false), 1500);

      // Compose cast via SDK
      if (context.isInMiniApp) {
        const streakText =
          data.streak > 2 ? ` 🔥 Haunting streak: ${data.streak}x!` : "";

        await sdk.actions.composeCast({
          text: `@${selectedUser.username} just got ghost-poked! 👻${streakText}\n\nStrike back:`,
          embeds: [appUrl],
        });
      }

      // Clear selection after poke
      setTimeout(() => {
        setSelectedUser(null);
      }, 2000);
    } catch (err) {
      console.error("Poke failed:", err);
    } finally {
      setPoking(false);
    }
  }, [selectedUser, poking, context, appUrl]);

  const handleSelectUser = (user: SearchUser) => {
    if (user.fid === context.user.fid) return; // Can't poke yourself
    setSelectedUser(user);
  };

  const handleViewProfile = async (fid: number) => {
    if (context.isInMiniApp) {
      try {
        await sdk.actions.viewProfile({ fid });
      } catch {}
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto px-4 pb-24 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-ghost-float">👻</div>
          <div>
            <h1 className="text-xl font-bold neon-text font-display tracking-tight">
              Ghost Poke
            </h1>
            <p className="text-ghost-muted text-xs font-mono">
              @{context.user.username || "guest"}
            </p>
          </div>
        </div>
        {context.user.pfpUrl && (
          <button
            onClick={() => handleViewProfile(context.user.fid)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-ghost-neon/30 hover:ring-ghost-neon/60 transition-all"
          >
            <img
              src={context.user.pfpUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </header>

      {/* Ghost blast overlay */}
      {showBlast && <GhostAnimation streak={lastStreak} />}

      {/* Tab content */}
      <main className="flex-1 animate-slide-up">
        {tab === "search" && (
          <div className="space-y-4">
            <SearchBar
              onSelect={handleSelectUser}
              currentUserFid={context.user.fid}
            />

            {selectedUser ? (
              <div className="space-y-4 animate-slide-up">
                <UserCard
                  user={selectedUser}
                  onViewProfile={() => handleViewProfile(selectedUser.fid)}
                />
                <PokeButton
                  onPoke={handlePoke}
                  loading={poking}
                  blasting={showBlast}
                  targetUsername={selectedUser.username}
                />
              </div>
            ) : (
              <div className="mt-8 text-center">
                <div className="text-5xl mb-4 opacity-30 animate-ghost-float">
                  👻
                </div>
                <p className="text-ghost-muted text-sm font-display">
                  Search someone and ghost-poke them
                </p>
                <p className="text-ghost-border text-xs font-mono mt-2">
                  Leave your mark on the feed, build your streak
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "leaderboard" && (
          <Leaderboard onViewProfile={handleViewProfile} />
        )}

        {tab === "inbox" && (
          <PokeHistory
            fid={context.user.fid}
            onViewProfile={handleViewProfile}
            onPokeBack={(user) => {
              setSelectedUser(user);
              setTab("search");
            }}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-ghost-bg/90 backdrop-blur-xl border-t border-ghost-border/50">
        <div className="max-w-lg mx-auto flex">
          {(
            [
              { id: "search", icon: Search, label: "Poke" },
              { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
              { id: "inbox", icon: Inbox, label: "Inbox" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${
                tab === id
                  ? "text-ghost-neon"
                  : "text-ghost-muted hover:text-ghost-text"
              }`}
            >
              <Icon
                size={20}
                className={tab === id ? "drop-shadow-[0_0_6px_#b366ff]" : ""}
              />
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {label}
              </span>
              {tab === id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-ghost-neon rounded-full shadow-[0_0_8px_#b366ff]" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
