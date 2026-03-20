"use client";

const suggestions = [
  { icon: "⚫", text: "How do black holes form and what happens inside them?", tag: "BLACK HOLES" },
  { icon: "🌌", text: "How big is the observable universe and what lies beyond?", tag: "COSMOLOGY" },
  { icon: "🪐", text: "Could life exist on Europa or Enceladus?", tag: "ASTROBIOLOGY" },
  { icon: "🚀", text: "What would a human mission to Mars actually look like?", tag: "EXPLORATION" },
  { icon: "✨", text: "What is dark matter and why can't we see it?", tag: "PHYSICS" },
  { icon: "🔭", text: "What has the James Webb Space Telescope discovered?", tag: "TELESCOPES" },
];

export default function SuggestedQuestions({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="px-4 pb-4">
      <p className="text-center mb-4" style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.6rem", letterSpacing: "0.2em",
        color: "#6c3fc5", opacity: 0.6,
      }}>
        TRANSMISSION PROMPTS
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onSelect(s.text)}
            className="text-left p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(13,11,36,0.6)",
              border: "1px solid rgba(139,92,246,0.12)",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(139,92,246,0.4)";
              el.style.background = "rgba(45,27,105,0.25)";
              el.style.boxShadow = "0 0 20px rgba(139,92,246,0.1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(139,92,246,0.12)";
              el.style.background = "rgba(13,11,36,0.6)";
              el.style.boxShadow = "none";
            }}>
            <div className="flex items-start gap-2">
              <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
              <div>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.55rem", letterSpacing: "0.2em", color: "#6c3fc5",
                }}>{s.tag}</span>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem", color: "#c4b5fd",
                  lineHeight: 1.5, marginTop: "0.125rem",
                }}>{s.text}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}