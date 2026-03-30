"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/farcaster-sdk";
import GhostPokeApp from "@/components/GhostPokeApp";

export type FarcasterUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

export type MiniAppContextData = {
  user: FarcasterUser;
  isInMiniApp: boolean;
};

export default function Home() {
  const [context, setContext] = useState<MiniAppContextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const isInMiniApp = sdk.isInMiniApp();

        if (isInMiniApp) {
          const ctx = await sdk.context;
          await sdk.actions.ready();
          if (ctx?.user) {
            setContext({
              user: {
                fid: ctx.user.fid,
                username: ctx.user.username,
                displayName: ctx.user.displayName,
                pfpUrl: ctx.user.pfpUrl,
              },
              isInMiniApp: true,
            });
          }
        } else {
          // Fallback for browser testing
          setContext({
            user: {
              fid: 0,
              username: "guest",
              displayName: "Guest User",
              pfpUrl: undefined,
            },
            isInMiniApp: false,
          });
        }
      } catch (err) {
        console.error("Failed to initialize Mini App:", err);
        setContext({
          user: { fid: 0, username: "guest", displayName: "Guest" },
          isInMiniApp: false,
        });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl animate-ghost-float mb-4">👻</div>
          <p className="text-ghost-muted font-mono text-sm tracking-widest uppercase">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ghost-muted">Failed to load. Please try again.</p>
      </div>
    );
  }

  return <GhostPokeApp context={context} />;
}
