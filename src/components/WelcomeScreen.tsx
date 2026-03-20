"use client";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full" style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          transform: "scale(2.5)",
        }} />
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 35% 30%, #6c3fc5 0%, #2d1b69 40%, #1a0f3d 70%, #080618 100%)",
            boxShadow: "0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)",
          }}>
          <div className="absolute top-3 left-4 w-8 h-5 rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.8), transparent)" }} />
          <div className="absolute" style={{
            width: "140%", height: "20px",
            border: "2px solid rgba(196,181,253,0.25)",
            borderRadius: "50%",
            transform: "rotateX(70deg)",
          }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "orbit 8s linear infinite" }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{
            background: "#f59e0b",
            boxShadow: "0 0 8px rgba(245,158,11,0.8)",
            transform: "translateX(52px)",
          }} />
        </div>
      </div>

      <h2 className="text-center mb-2" style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 900, fontSize: "2rem",
        letterSpacing: "0.1em",
        background: "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 50%, #8b5cf6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        EXPLORE THE COSMOS
      </h2>

      <p className="text-center mb-1" style={{
        fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
        color: "#a78bfa", maxWidth: "24rem",
      }}>
        Your AI astrophysicist, ready to navigate the universe with you.
      </p>

      <p className="mb-8" style={{
        fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
        letterSpacing: "0.25em", color: "#6c3fc5", opacity: 0.6,
      }}>
        BLACK HOLES · GALAXIES · DARK MATTER · EXOPLANETS
      </p>

      <div className="flex items-center gap-6">
        {[
          { value: "2T+", label: "GALAXIES" },
          { value: "∞", label: "QUESTIONS" },
          { value: "13.8B", label: "YRS OF DATA" },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="glow-text" style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900, fontSize: "1.25rem", color: "#c4b5fd",
            }}>{stat.value}</div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.5rem", letterSpacing: "0.2em",
              color: "#6c3fc5", opacity: 0.5,
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}