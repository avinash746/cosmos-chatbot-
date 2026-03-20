"use client";

import { Radio } from "lucide-react";

export default function Header({ messageCount }: { messageCount: number }) {
  return (
    <header className="relative z-10 flex-shrink-0 px-4 pt-4 pb-3"
      style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
      <div className="flex items-center justify-between max-w-3xl mx-auto">

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 35% 30%, #6c3fc5, #1a0f3d)",
                boxShadow: "0 0 20px rgba(139,92,246,0.6)",
              }}>
              <span className="text-base">🪐</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 8px rgba(52,211,153,0.8)" }}>
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </div>
          <div>
            <h1 className="font-black text-lg glow-text"
              style={{ fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.15em", color: "#ede9fe" }}>
              COSMOS
            </h1>
            <p style={{ fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem", letterSpacing: "0.25em",
              opacity: 0.5, color: "#8b5cf6" }}>
              SPACE INTELLIGENCE v2.4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {messageCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(13,11,36,0.8)",
                border: "1px solid rgba(139,92,246,0.2)" }}>
              <Radio size={10} style={{ color: "#8b5cf6" }} />
              <span style={{ fontFamily: "'Space Mono', monospace",
                fontSize: "0.6rem", letterSpacing: "0.2em", color: "#8b5cf6" }}>
                {messageCount} MSG
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(13,11,36,0.8)",
              border: "1px solid rgba(52,211,153,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
            <span style={{ fontFamily: "'Space Mono', monospace",
              fontSize: "0.6rem", letterSpacing: "0.2em", color: "#34d399" }}>
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}