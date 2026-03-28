"use client";

import { Loader2 } from "lucide-react";

export default function PokeButton({
  onPoke,
  loading,
  blasting,
  targetUsername,
}: {
  onPoke: () => void;
  loading: boolean;
  blasting: boolean;
  targetUsername: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onPoke}
        disabled={loading || blasting}
        className={`poke-btn w-full py-4 rounded-2xl text-white font-bold text-lg font-display
                    tracking-wide uppercase transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95
                    ${blasting ? "animate-poke-blast" : "hover:scale-[1.02]"}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Dürtülüyor...
            </>
          ) : blasting ? (
            <>
              <span className="text-2xl">👻</span>
              Dürtüldü!
            </>
          ) : (
            <>
              <span className="text-2xl">👻</span>
              Ghost Poke
            </>
          )}
        </span>
      </button>

      <p className="text-ghost-muted text-xs font-mono text-center">
        @{targetUsername} feed&apos;ine hayalet bırakacaksın
      </p>
    </div>
  );
}
