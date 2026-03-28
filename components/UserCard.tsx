"use client";

import { ExternalLink } from "lucide-react";
import type { SearchUser } from "./GhostPokeApp";

export default function UserCard({
  user,
  onViewProfile,
}: {
  user: SearchUser;
  onViewProfile: () => void;
}) {
  return (
    <div className="neon-border rounded-2xl p-5 bg-ghost-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onViewProfile}
          className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-ghost-neon/40 hover:ring-ghost-neon/80 transition-all flex-shrink-0 group"
        >
          {user.pfpUrl ? (
            <img
              src={user.pfpUrl}
              alt={user.displayName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-ghost-surface flex items-center justify-center text-2xl">
              👻
            </div>
          )}
          {/* Ghost overlay on hover */}
          <div className="absolute inset-0 bg-ghost-neon/0 group-hover:bg-ghost-neon/20 transition-colors flex items-center justify-center">
            <ExternalLink
              size={16}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-ghost-text font-display truncate">
            {user.displayName}
          </h3>
          <p className="text-sm text-ghost-neon font-mono">@{user.username}</p>
          {user.bio && (
            <p className="text-xs text-ghost-muted mt-1 line-clamp-2 font-display">
              {user.bio}
            </p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-ghost-text font-mono">
            {user.followerCount > 1000
              ? `${(user.followerCount / 1000).toFixed(1)}k`
              : user.followerCount}
          </p>
          <p className="text-[10px] text-ghost-muted font-mono uppercase tracking-wider">
            followers
          </p>
        </div>
      </div>
    </div>
  );
}
