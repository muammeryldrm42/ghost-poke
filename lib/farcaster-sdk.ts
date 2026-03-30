"use client";

type AppUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type MiniAppContext = {
  user?: AppUser;
};

type CastPayload = {
  text: string;
  embeds?: string[];
};

type FrameSdk = {
  isInMiniApp: () => boolean;
  context: Promise<MiniAppContext>;
  actions: {
    ready: () => Promise<void>;
    composeCast: (payload: CastPayload) => Promise<void>;
    viewProfile: (payload: { fid: number }) => Promise<void>;
  };
  haptics: {
    impactOccurred: (style: "light" | "medium" | "heavy") => Promise<void>;
  };
};

declare global {
  interface Window {
    farcaster?: Partial<FrameSdk>;
  }
}

const noop = async () => {};
const fallbackContext: Promise<MiniAppContext> = Promise.resolve({});
const getFarcaster = () =>
  typeof window !== "undefined" ? window.farcaster : undefined;

export const sdk: FrameSdk = {
  isInMiniApp: () => Boolean(getFarcaster()),
  context: getFarcaster()?.context ?? fallbackContext,
  actions: {
    ready: getFarcaster()?.actions?.ready ?? noop,
    composeCast: getFarcaster()?.actions?.composeCast ?? noop,
    viewProfile: getFarcaster()?.actions?.viewProfile ?? noop,
  },
  haptics: {
    impactOccurred: getFarcaster()?.haptics?.impactOccurred ?? noop,
  },
};
