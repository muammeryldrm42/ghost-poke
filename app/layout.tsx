import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://ghost-poke.vercel.app";

export const metadata: Metadata = {
  title: "Ghost Poke 👻",
  description: "Ghost-poke your friends and leave your mark — Farcaster Mini App",
  openGraph: {
    title: "Ghost Poke 👻",
    description: "Ghost-poke your friends and leave your mark",
    images: [`${appUrl}/images/og.png`],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/images/feed.png`,
      button: {
        title: "👻 Ghost Poke",
        action: {
          type: "launch_frame",
          name: "Ghost Poke",
          url: appUrl,
          splashImageUrl: `${appUrl}/images/splash.png`,
          splashBackgroundColor: "#0a0a0f",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="ghost-gradient scanlines min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
