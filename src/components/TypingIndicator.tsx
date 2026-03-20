"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 35% 35%, #6c3fc5, #1a0f3d)",
          boxShadow: "0 0 15px rgba(139,92,246,0.5)",
        }}>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.75rem", fontWeight: 700, color: "#c4b5fd",
        }}>C</span>
      </div>
      <div className="ai-bubble rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span style={{
            marginLeft: "0.5rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem", letterSpacing: "0.2em",
            color: "#6c3fc5", opacity: 0.6,
          }}>
            COSMOS COMPUTING
          </span>
        </div>
      </div>
    </div>
  );
}