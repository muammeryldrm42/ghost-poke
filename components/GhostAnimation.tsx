"use client";

import { useEffect, useState } from "react";

export default function GhostAnimation({ streak }: { streak: number }) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; emoji: string; delay: number }[]
  >([]);

  useEffect(() => {
    const ghostEmojis = ["👻", "🌫️", "💀", "🦇", "✨", "🔮"];
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 30,
      emoji: ghostEmojis[Math.floor(Math.random() * ghostEmojis.length)],
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      {/* Radial flash */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(179,102,255,0.15) 0%, transparent 60%)",
          animationDuration: "0.3s",
        }}
      />

      {/* Center ghost */}
      <div className="text-8xl animate-poke-blast drop-shadow-[0_0_30px_#b366ff]">
        👻
      </div>

      {/* Streak badge */}
      {streak > 2 && (
        <div
          className="absolute top-1/2 mt-16 bg-ghost-streak/90 text-white px-4 py-1.5 rounded-full
                      font-mono text-sm font-bold animate-slide-up shadow-lg shadow-ghost-streak/30"
        >
          🔥 Streak x{streak}
        </div>
      )}

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute ghost-particle text-2xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
