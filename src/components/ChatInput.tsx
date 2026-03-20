"use client";

import { SendHorizonal, Plus, X, Paperclip } from "lucide-react";
import { useRef, useEffect, KeyboardEvent, useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const features = [
  { icon: "🖼️", label: "Add photos & files", action: "photo", desc: "Upload image, PDF or file" },
  { icon: "🎨", label: "Create image", action: "image", desc: "Generate an AI image" },
  { icon: "💡", label: "Thinking", action: "thinking", desc: "Deep step-by-step reasoning" },
  { icon: "🔬", label: "Deep research", action: "research", desc: "Thorough multi-step research" },
  { icon: "🛒", label: "Shopping research", action: "shopping", desc: "Find best products & deals" },
  { icon: "🌐", label: "Web search", action: "websearch", desc: "Search the internet" },
  { icon: "📚", label: "Study and learn", action: "study", desc: "Learn any topic deeply" },
  { icon: "🖊️", label: "Canvas", action: "canvas", desc: "Write & edit documents" },
  { icon: "📝", label: "Quizzes", action: "quiz", desc: "Test your knowledge" },
];

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
    preview?: string;
  } | null>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isText =
      file.type === "text/plain" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".py") ||
      file.name.endsWith(".json");

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedFile({
          name: file.name,
          type: file.type,
          preview: ev.target?.result as string,
        });
        onChange(
          `I have uploaded an image: ${file.name}. ` +
          `Please describe what's in this image and help me analyze it. ` +
          `The image appears to be a screenshot/photo. What can you tell me about it?`
        );
      };
      reader.readAsDataURL(file);

    } else if (isPDF) {
      setUploadedFile({
        name: file.name,
        type: file.type,
        preview: "PDF",
      });
      onChange(
        `I have uploaded a PDF file: "${file.name}". ` +
        `Please help me analyze, summarize, or answer questions about this PDF document.`
      );

    } else if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setUploadedFile({ name: file.name, type: file.type });
        onChange(
          `I have uploaded a file "${file.name}". Here is its content:\n\n${content}\n\nPlease analyze this.`
        );
      };
      reader.readAsText(file);

    } else {
      setUploadedFile({ name: file.name, type: file.type });
      onChange(`I have uploaded a file: "${file.name}". Please help me with this document.`);
    }

    textareaRef.current?.focus();
  };

  const handleFeatureClick = (feature: (typeof features)[0]) => {
    setMenuOpen(false);

    if (feature.action === "photo") {
      fileInputRef.current?.click();
      return;
    }

    setActiveFeature(feature.action);

    const prompts: Record<string, string> = {
      image: "Create an image of: ",
      thinking: "Think step by step about: ",
      research: "Do deep research on: ",
      shopping: "Help me find the best product for: ",
      websearch: "Search the web for: ",
      study: "Help me study and learn about: ",
      canvas: "Help me write a document about: ",
      quiz: "Create a quiz for me on: ",
    };

    onChange(prompts[feature.action] || "");
    textareaRef.current?.focus();
  };

  const canSend = !isLoading && value.trim().length > 0 && !disabled;

  return (
    <div className="flex-shrink-0 px-4 pb-4 pt-2 max-w-3xl mx-auto w-full">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt,.csv,.js,.ts,.py,.json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Active feature badge */}
      {activeFeature && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "#8b5cf6",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.3)",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
          }}>
            {features.find(f => f.action === activeFeature)?.icon}{" "}
            {features.find(f => f.action === activeFeature)?.label}
          </span>
          <button
            onClick={() => setActiveFeature(null)}
            style={{ color: "#6c3fc5" }}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Uploaded file preview */}
      {uploadedFile && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(13,11,36,0.8)",
              border: "1px solid rgba(139,92,246,0.25)",
            }}>
            {uploadedFile.preview && uploadedFile.preview !== "PDF" ? (
              <img
                src={uploadedFile.preview}
                alt="preview"
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : uploadedFile.preview === "PDF" ? (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}>
                <span style={{
                  fontSize: "0.55rem",
                  fontFamily: "'Space Mono', monospace",
                  color: "#f87171",
                  fontWeight: 700,
                }}>PDF</span>
              </div>
            ) : (
              <Paperclip size={14} style={{ color: "#8b5cf6" }} />
            )}

            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              color: "#c4b5fd",
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {uploadedFile.name}
            </span>

            <button
              onClick={() => {
                setUploadedFile(null);
                onChange("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              style={{ color: "#6c3fc5" }}>
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Input container */}
      <div
        className="relative rounded-2xl overflow-visible"
        style={{
          background: "rgba(8,6,24,0.9)",
          border: "1px solid rgba(139,92,246,0.2)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}>

        {/* Feature Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-0 mb-2 rounded-2xl overflow-hidden z-50"
            style={{
              background: "rgba(8,6,24,0.98)",
              border: "1px solid rgba(139,92,246,0.25)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
              width: "260px",
            }}>
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => handleFeatureClick(feature)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{
                  borderBottom: i < features.length - 1
                    ? "1px solid rgba(139,92,246,0.08)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}>
                <span className="text-xl flex-shrink-0 w-8 text-center">
                  {feature.icon}
                </span>
                <div>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    color: "#ede9fe",
                    fontWeight: 500,
                  }}>
                    {feature.label}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.65rem",
                    color: "#6c3fc5",
                    marginTop: "0.1rem",
                  }}>
                    {feature.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-end gap-2 p-2">

          {/* Plus button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: menuOpen
                ? "rgba(139,92,246,0.2)"
                : "rgba(139,92,246,0.08)",
              border: `1px solid ${menuOpen
                ? "rgba(139,92,246,0.5)"
                : "rgba(139,92,246,0.15)"}`,
              color: "#8b5cf6",
            }}>
            <Plus size={16} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask COSMOS anything about the universe..."
            rows={1}
            disabled={isLoading || disabled}
            style={{
              flex: 1,
              background: "transparent",
              resize: "none",
              padding: "0.5rem 0",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.875rem",
              color: "#ede9fe",
              outline: "none",
              caretColor: "#8b5cf6",
              maxHeight: "140px",
              lineHeight: 1.6,
            }}
            className="placeholder:opacity-30 disabled:opacity-50"
          />

          {/* Send button */}
          <div className="flex-shrink-0 flex items-center gap-1.5">
            {value.length > 50 && (
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                opacity: 0.3,
                color: "#8b5cf6",
              }}>
                {value.length}
              </span>
            )}
            <button
              onClick={onSubmit}
              disabled={!canSend}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={canSend ? {
                background: "linear-gradient(135deg, #6c3fc5, #1a0f3d)",
                border: "1px solid rgba(139,92,246,0.5)",
                boxShadow: "0 0 15px rgba(139,92,246,0.4)",
                cursor: "pointer",
              } : {
                background: "rgba(139,92,246,0.05)",
                border: "1px solid rgba(139,92,246,0.1)",
                cursor: "not-allowed",
              }}>
              {isLoading ? (
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "#6c3fc5",
                    borderTopColor: "#8b5cf6",
                  }}
                />
              ) : (
                <SendHorizonal
                  size={15}
                  style={{ color: canSend ? "#c4b5fd" : "#3d2a6e" }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center mt-2" style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.2em",
        opacity: 0.25,
        color: "#6c3fc5",
      }}>
        ENTER TO TRANSMIT · SHIFT+ENTER FOR NEW LINE
      </p>
    </div>
  );
}