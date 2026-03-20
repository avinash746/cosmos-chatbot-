"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: MessageProps) {
  const isUser = role === "user";
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isUser || isStreaming) return;
    const match = content.match(/IMAGE_GENERATE:\s*(.+)/);
    if (match && !generatedImage && !imageLoading) {
      generateImage(match[1].trim());
    }
  }, [content, isStreaming]);

  const generateImage = async (prompt: string) => {
    setImageLoading(true);
    setImageError(false);
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        setImageError(true);
      }
    } catch {
      setImageError(true);
    } finally {
      setImageLoading(false);
    }
  };

  const cleanContent = content.replace(/IMAGE_GENERATE:.*$/m, "").trim();
  const isImageRequest = content.includes("IMAGE_GENERATE:");

  return (
    <div className={`flex items-start gap-3 fade-in ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #2d1b69, #1a0f3d)", border: "1px solid rgba(139,92,246,0.4)" }}>
          <User size={14} style={{ color: "#c4b5fd" }} />
        </div>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle at 35% 35%, #6c3fc5, #1a0f3d)", boxShadow: "0 0 15px rgba(139,92,246,0.5)" }}>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#c4b5fd" }}>C</span>
        </div>
      )}

      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? "user-bubble rounded-tr-sm" : "ai-bubble rounded-tl-sm"}`}
        style={isUser ? {} : { backdropFilter: "blur(12px)" }}>

        {isUser ? (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#ede9fe", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {content}
          </p>
        ) : (
          <div>
            {cleanContent && (
              <div className="prose-cosmos">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
                {isStreaming && !isImageRequest && (
                  <span className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                    style={{ background: "#8b5cf6", animation: "blink 1s step-end infinite", boxShadow: "0 0 6px rgba(139,92,246,0.8)" }} />
                )}
              </div>
            )}

            {isImageRequest && (
              <div className="mt-3">
                {imageLoading && (
                  <div className="flex items-center gap-2 py-3 px-4 rounded-xl"
                    style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Loader2 size={16} className="animate-spin" style={{ color: "#8b5cf6" }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#8b5cf6" }}>
                      GENERATING IMAGE...
                    </span>
                  </div>
                )}

                {generatedImage && (
                  <div className="mt-2">
                    <img src={generatedImage} alt="AI Generated" className="rounded-xl w-full max-w-sm"
                      style={{ border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 0 20px rgba(139,92,246,0.2)" }} />
                    <a href={generatedImage} download="cosmos-image.jpg"
                      style={{ marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.375rem",
                        padding: "0.375rem 0.75rem", borderRadius: "0.5rem",
                        background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                        color: "#c4b5fd", fontFamily: "'Space Mono', monospace",
                        fontSize: "0.6rem", letterSpacing: "0.15em", textDecoration: "none" }}>
                      ⬇ DOWNLOAD IMAGE
                    </a>
                  </div>
                )}

                {imageError && (
                  <div className="mt-2 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#f87171" }}>
                      Image generation failed. Try{" "}
                      <a href="https://ideogram.ai" target="_blank" rel="noopener noreferrer"
                        style={{ color: "#a78bfa", textDecoration: "underline" }}>
                        ideogram.ai
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "0.375rem", fontSize: "0.6rem", opacity: 0.3,
          fontFamily: "'Space Mono', monospace", color: isUser ? "#c4b5fd" : "#6c3fc5",
          textAlign: isUser ? "right" : "left" }}>
          {isUser ? "YOU" : "COSMOS · AI"}
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}