"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import type { SearchUser } from "./GhostPokeApp";

export default function SearchBar({
  onSelect,
  currentUserFid,
}: {
  onSelect: (user: SearchUser) => void;
  currentUserFid: number;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.users || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const handleSelect = (user: SearchUser) => {
    onSelect(user);
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost-muted"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Kullanıcı ara... @vitalik"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="w-full bg-ghost-card border border-ghost-border rounded-2xl py-3.5 pl-11 pr-10
                     text-ghost-text placeholder:text-ghost-muted/50 font-display text-sm
                     focus:outline-none focus:border-ghost-neon/50 focus:shadow-[0_0_20px_#b366ff20]
                     transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ghost-muted hover:text-ghost-text p-1"
          >
            <X size={16} />
          </button>
        )}
        {loading && (
          <Loader2
            size={16}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-ghost-neon animate-spin"
          />
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-ghost-surface border border-ghost-border rounded-2xl overflow-hidden shadow-2xl shadow-black/50 animate-fade-in">
          {results.map((user) => (
            <button
              key={user.fid}
              onClick={() => handleSelect(user)}
              disabled={user.fid === currentUserFid}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all
                ${
                  user.fid === currentUserFid
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-ghost-neon/10 active:bg-ghost-neon/20"
                }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-ghost-card flex-shrink-0 ring-1 ring-ghost-border">
                {user.pfpUrl ? (
                  <img
                    src={user.pfpUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ghost-muted text-xs">
                    👻
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ghost-text truncate font-display">
                  {user.displayName}
                </p>
                <p className="text-xs text-ghost-muted font-mono">
                  @{user.username}
                </p>
              </div>
              <span className="text-[10px] text-ghost-muted font-mono">
                {user.followerCount > 1000
                  ? `${(user.followerCount / 1000).toFixed(1)}k`
                  : user.followerCount}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 1 && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-ghost-surface border border-ghost-border rounded-2xl p-6 text-center animate-fade-in">
          <p className="text-ghost-muted text-sm">Kimse bulunamadı 👻</p>
        </div>
      )}
    </div>
  );
}
