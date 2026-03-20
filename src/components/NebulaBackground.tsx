"use client";

export default function NebulaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="nebula-orb absolute" style={{
        width: "600px", height: "500px",
        background: "radial-gradient(ellipse, rgba(45,27,105,0.4) 0%, transparent 70%)",
        top: "-100px", left: "-100px",
        animation: "nebulaPulse 12s ease-in-out infinite",
      }} />
      <div className="nebula-orb absolute" style={{
        width: "500px", height: "600px",
        background: "radial-gradient(ellipse, rgba(108,63,197,0.2) 0%, transparent 65%)",
        bottom: "-150px", right: "-100px",
        animation: "nebulaPulse 15s ease-in-out infinite",
        animationDelay: "-5s",
      }} />
      <div className="nebula-orb absolute" style={{
        width: "350px", height: "300px",
        background: "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 65%)",
        top: "40%", right: "20%",
        animation: "nebulaPulse 18s ease-in-out infinite",
        animationDelay: "-9s",
      }} />
    </div>
  );
}