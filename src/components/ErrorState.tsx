"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-start gap-3 fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, #7c2d12, #450a0a)",
          border: "1px solid rgba(239,68,68,0.4)",
          boxShadow: "0 0 15px rgba(239,68,68,0.3)",
        }}>
        <AlertTriangle size={14} style={{ color: "#f87171" }} />
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{
        background: "rgba(60,10,10,0.5)",
        border: "1px solid rgba(239,68,68,0.2)",
        backdropFilter: "blur(12px)",
      }}>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.6rem", letterSpacing: "0.2em",
          color: "#f87171", marginBottom: "0.25rem",
        }}>SIGNAL LOST</p>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem", color: "#fca5a5", marginBottom: "0.75rem",
        }}>
          Transmission interrupted. The cosmos is vast — sometimes signals get lost.
        </p>
        <button onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem", letterSpacing: "0.2em",
            cursor: "pointer",
          }}>
          <RefreshCw size={10} />
          RETRY TRANSMISSION
        </button>
      </div>
    </div>
  );
}