"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import StarField from "@/components/StarField";
import NebulaBackground from "@/components/NebulaBackground";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import WelcomeScreen from "@/components/WelcomeScreen";
import ErrorState from "@/components/ErrorState";
import {
  Trash2, MessageSquare, ChevronLeft, ChevronRight,
  Search, Image, AppWindow, FlaskConical, Code2,
  FolderOpen, Plus, X, ArrowUpRight, Upload,
} from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
}

interface Project {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
}

interface App {
  name: string;
  desc: string;
  emoji: string;
}

const sidebarMenu = [
  { icon: <Plus size={15} />, label: "New chat", action: "new" },
  { icon: <Search size={15} />, label: "Search chats", action: "search" },
  { icon: <Image size={15} />, label: "Images", action: "images" },
  { icon: <AppWindow size={15} />, label: "Apps", action: "apps" },
  { icon: <FlaskConical size={15} />, label: "Deep research", action: "research" },
  { icon: <Code2 size={15} />, label: "Codex", action: "codex" },
  { icon: <FolderOpen size={15} />, label: "Projects", action: "projects" },
];

const imageStyles = [
  { label: "Caricature Trend", emoji: "🎨" },
  { label: "Flower petals", emoji: "🌸" },
  { label: "Gold", emoji: "✨" },
  { label: "Crayon", emoji: "🖍️" },
  { label: "Paparazzi", emoji: "📸" },
  { label: "Anime Style", emoji: "🎌" },
];

const discoverImages = [
  { label: "Me as an emperor", emoji: "👑" },
  { label: "Create a coloring page", emoji: "🖍️" },
  { label: "Reimagine my pet as a human", emoji: "🐾" },
  { label: "Turn into a keychain", emoji: "🔑" },
  { label: "Give them a bowl cut", emoji: "✂️" },
  { label: "What would I look like as a K-Pop star?", emoji: "🎤" },
];

const apps: App[] = [
  { name: "Adobe Photoshop", desc: "Edit & transform your images", emoji: "🎨" },
  { name: "Airtable", desc: "Add structured data", emoji: "📊" },
  { name: "Apple Music", desc: "Build playlists and find music", emoji: "🎵" },
  { name: "Booking.com", desc: "Find hotels, homes and more", emoji: "🏨" },
  { name: "Canva", desc: "Search, create, edit designs", emoji: "✏️" },
  { name: "Expedia", desc: "Plan trips, flights and hotels", emoji: "✈️" },
  { name: "Spotify", desc: "Find music & podcasts", emoji: "🎧" },
  { name: "YouTube", desc: "Search & explore videos", emoji: "▶️" },
];

const researchTopics = [
  { title: "Compare Housing Options", desc: "Analyze renting vs buying across regions..." },
  { title: "Track Climate Impacts", desc: "Analyze climate and environmental data..." },
  { title: "Evaluate Food Affordability", desc: "Analyze food prices across regions..." },
  { title: "Compare Language Learning", desc: "Analyze language learning demand..." },
];

const projectTemplates = [
  { emoji: "💰", label: "Investing" },
  { emoji: "🎓", label: "Homework" },
  { emoji: "✍️", label: "Writing" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "💼", label: "Work" },
  { emoji: "🔬", label: "Research" },
];

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState<string>("chat");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectEmoji, setNewProjectEmoji] = useState("📁");
  const [imagePrompt, setImagePrompt] = useState("");
  const [appSearch, setAppSearch] = useState("");
  const [researchQuery, setResearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState("");

  const {
    messages, input, handleInputChange, handleSubmit,
    isLoading, error, reload, setInput, setMessages,
  } = useChat({ api: "/api/chat" });

  useEffect(() => {
    const saved = localStorage.getItem("cosmos-sessions");
    if (saved) setChatSessions(JSON.parse(saved));
    const savedProjects = localStorage.getItem("cosmos-projects");
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const title = messages[0]?.content?.slice(0, 35) + "..." || "New Chat";
    setChatSessions((prev) => {
      const existing = prev.find((s) => s.id === currentSessionId);
      let updated;
      if (existing) {
        updated = prev.map((s) => s.id === currentSessionId ? { ...s, messages, title } : s);
      } else {
        const newSession: ChatSession = {
          id: currentSessionId || Date.now().toString(),
          title, messages, createdAt: Date.now(),
        };
        setCurrentSessionId(newSession.id);
        updated = [newSession, ...prev];
      }
      localStorage.setItem("cosmos-sessions", JSON.stringify(updated));
      return updated;
    });
  }, [messages]);

  useEffect(() => {
    if (!hasScrolledUp && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading, hasScrolledUp]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setHasScrolledUp(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const submitMsg = (text: string) => {
    setInput(text);
    setActivePage("chat");
    setActiveMenu("");
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
    }, 100);
  };

  const handleSuggestedQuestion = (question: string) => submitMsg(question);

  const handleManualSubmit = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
  };

  const handleNewChat = () => {
    setMessages([]); setInput(""); setHasScrolledUp(false);
    setCurrentSessionId(Date.now().toString());
    setActiveMenu(""); setActivePage("chat");
  };

  const handleLoadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setHasScrolledUp(false);
    setActivePage("chat");
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chatSessions.filter((s) => s.id !== id);
    setChatSessions(updated);
    localStorage.setItem("cosmos-sessions", JSON.stringify(updated));
    if (id === currentSessionId) { setMessages([]); setCurrentSessionId(""); }
  };

  const handleMenuClick = (action: string) => {
    if (action === "new") handleNewChat();
    else if (action === "search") setActiveMenu(action === activeMenu ? "" : action);
    else { setActivePage(action); setActiveMenu(action); }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const project: Project = {
      id: Date.now().toString(), name: newProjectName,
      emoji: newProjectEmoji, createdAt: Date.now(),
    };
    const updated = [project, ...projects];
    setProjects(updated);
    localStorage.setItem("cosmos-projects", JSON.stringify(updated));
    setShowCreateProject(false); setNewProjectName(""); setNewProjectEmoji("📁");
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    const updated = projects.map((p) =>
      p.id === editingProject.id
        ? { ...p, name: editProjectName, emoji: editingProject.emoji }
        : p
    );
    setProjects(updated);
    localStorage.setItem("cosmos-projects", JSON.stringify(updated));
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("cosmos-projects", JSON.stringify(updated));
    setEditingProject(null);
  };

  const handleImagePromptSubmit = (prompt?: string) => {
    const p = prompt || imagePrompt;
    if (!p.trim()) return;
    submitMsg(`Create an image of: ${p}`);
  };

  const handleResearchSubmit = (query?: string) => {
    const q = query || researchQuery;
    if (!q.trim()) return;
    submitMsg(`Do deep research on: ${q}`);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      submitMsg(`I have uploaded an image: ${file.name}. Please analyze and describe what you see in this image in detail.`);
    };
    reader.readAsDataURL(file);
  };

  const filteredSessions = chatSessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(appSearch.toLowerCase())
  );

  // ─── PAGES ────────────────────────────────────────────────────

  const renderImagesPage = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "thin" }}>
      <input ref={imageFileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileUpload} />

      <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "#ede9fe", marginBottom: "1.5rem" }}>
        🎨 Images
      </h1>

      <div className="flex gap-2 mb-4 p-3 rounded-2xl" style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.3)" }}>
        <span className="text-lg">🖼️</span>
        <input type="text" placeholder="Describe a new image..." value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleImagePromptSubmit()}
          className="flex-1 bg-transparent outline-none"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#ede9fe" }} />
        <button onClick={() => handleImagePromptSubmit()}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6c3fc5, #1a0f3d)", border: "1px solid rgba(139,92,246,0.5)" }}>
          <ArrowUpRight size={16} style={{ color: "#c4b5fd" }} />
        </button>
      </div>

      <button onClick={() => imageFileRef.current?.click()}
        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl mb-8 transition-all"
        style={{ background: "rgba(45,27,105,0.2)", border: "2px dashed rgba(139,92,246,0.35)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.4)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.7)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.2)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.35)"; }}>
        <Upload size={20} style={{ color: "#8b5cf6" }} />
        <div className="text-left">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#ede9fe", fontWeight: 500 }}>Upload an image to analyze</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "#6c3fc5" }}>Click to browse — JPG, PNG, WEBP supported</p>
        </div>
      </button>

      <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#ede9fe", marginBottom: "1rem" }}>Try a style on an image</h2>
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {imageStyles.map((style, i) => (
          <button key={i} onClick={() => handleImagePromptSubmit(style.label)}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-105"
            style={{ background: "rgba(45,27,105,0.3)", border: "1px solid rgba(139,92,246,0.2)", minWidth: "100px" }}>
            <span className="text-3xl">{style.emoji}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#c4b5fd" }}>{style.label}</span>
          </button>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#ede9fe", marginBottom: "1rem" }}>Discover something new</h2>
      <div className="grid grid-cols-2 gap-3">
        {discoverImages.map((item, i) => (
          <button key={i} onClick={() => handleImagePromptSubmit(item.label)}
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(13,11,36,0.8)"; }}>
            <span className="text-2xl">{item.emoji}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#c4b5fd", textAlign: "left" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAppsPage = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "thin" }}>

      {/* App Detail Modal - ChatGPT style */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ background: "rgba(8,6,24,0.99)", border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 0 60px rgba(139,92,246,0.2)", maxHeight: "90vh", overflowY: "auto" }}>

            {/* Breadcrumb */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3"
              style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
              <div className="flex items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6c3fc5" }}>
                <button onClick={() => setSelectedApp(null)} style={{ color: "#8b5cf6" }}>Apps</button>
                <span>›</span>
                <span style={{ color: "#ede9fe" }}>{selectedApp.name}</span>
              </div>
              <button onClick={() => setSelectedApp(null)} style={{ color: "#6c3fc5" }}>
                <X size={16} />
              </button>
            </div>

            <div className="px-6 pt-6 pb-6">
              {/* App header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                    style={{ background: "linear-gradient(135deg, #1a0f3d, #2d1b69)", border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}>
                    {selectedApp.emoji}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.4rem", color: "#ede9fe", fontWeight: 800 }}>
                      {selectedApp.name}
                    </h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#6c3fc5", marginTop: "0.2rem" }}>
                      {selectedApp.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedApp(null); submitMsg(`Help me use ${selectedApp.name}: `); }}
                  className="px-5 py-2 rounded-full transition-all hover:opacity-90"
                  style={{ background: "#ede9fe", color: "#1a0f3d", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Connect
                </button>
              </div>

              {/* Preview cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { prompt: `what can you do?`, preview: "See all available features" },
                  { prompt: `help me get started`, preview: "Step by step guide" },
                  { prompt: `show me examples`, preview: "Real world usage" },
                ].map((card, i) => (
                  <button key={i}
                    onClick={() => { setSelectedApp(null); submitMsg(`@${selectedApp.name} ${card.prompt}`); }}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{ background: `linear-gradient(135deg, hsl(${260 + i * 15}, 60%, 15%), hsl(${260 + i * 15}, 50%, 10%))`, border: "1px solid rgba(139,92,246,0.2)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)"; }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", marginBottom: "0.4rem" }}>
                      <span style={{ color: "#c4b5fd", fontWeight: 600 }}>@{selectedApp.name}</span>
                      <span style={{ color: "#8b5cf6" }}> {card.prompt}</span>
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "#6c3fc5" }}>
                      {card.preview}
                    </p>
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl mb-5"
                style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#a78bfa", lineHeight: 1.7 }}>
                  {selectedApp.name} for COSMOS makes powerful tools simple and accessible for everyone.
                  Just type your request and COSMOS will help you accomplish your goals using {selectedApp.name}.
                  Intuitive AI assistance helps you bring your vision to life with no prior experience required.
                </p>
              </div>

              {/* Quick actions */}
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#6c3fc5", opacity: 0.6, marginBottom: "0.75rem" }}>
                QUICK ACTIONS
              </p>
              <div className="space-y-2 mb-5">
                {[
                  `How do I use ${selectedApp.name}?`,
                  `Best features of ${selectedApp.name}`,
                  `Help me get started with ${selectedApp.name}`,
                  `${selectedApp.name} tips and tricks`,
                ].map((q, i) => (
                  <button key={i}
                    onClick={() => { setSelectedApp(null); submitMsg(q); }}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between"
                    style={{ background: "rgba(45,27,105,0.2)", border: "1px solid rgba(139,92,246,0.15)", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#c4b5fd" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.2)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)"; }}>
                    <span>{q}</span>
                    <ArrowUpRight size={13} style={{ color: "#6c3fc5", flexShrink: 0 }} />
                  </button>
                ))}
              </div>

              {/* Open Chat */}
              <button
                onClick={() => { setSelectedApp(null); setInput(`Help me use ${selectedApp.name}: `); setActivePage("chat"); setActiveMenu(""); }}
                className="w-full py-3 rounded-xl transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6c3fc5, #1a0f3d)", border: "1px solid rgba(139,92,246,0.5)", color: "#ede9fe", fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                OPEN {selectedApp.name.toUpperCase()} CHAT →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "#ede9fe" }}>
            🔧 Apps{" "}
            <span style={{ fontSize: "0.6rem", color: "#8b5cf6", background: "rgba(139,92,246,0.1)", padding: "0.2rem 0.5rem", borderRadius: "999px", border: "1px solid rgba(139,92,246,0.3)", verticalAlign: "middle" }}>BETA</span>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#6c3fc5", marginTop: "0.3rem" }}>
            Chat with your favorite apps in COSMOS
          </p>
        </div>
        <input type="text" placeholder="Search apps..." value={appSearch}
          onChange={(e) => setAppSearch(e.target.value)}
          className="px-4 py-2 rounded-xl outline-none"
          style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#ede9fe", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", width: "180px" }} />
      </div>

      <div className="p-5 rounded-2xl mb-6 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #1a0f3d, #2d1b69)", border: "1px solid rgba(139,92,246,0.4)" }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎨</span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem", color: "#ede9fe", fontWeight: 700 }}>Edit with Photoshop</span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#a78bfa" }}>Edit and enhance images</p>
          <button
            onClick={() => setSelectedApp({ name: "Adobe Photoshop", desc: "Edit & transform your images", emoji: "🎨" })}
            className="mt-3 px-4 py-1.5 rounded-lg"
            style={{ background: "#ede9fe", color: "#1a0f3d", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>
            View
          </button>
        </div>
        <span className="text-6xl opacity-30">Ps</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredApps.map((app, i) => (
          <button key={i} onClick={() => setSelectedApp(app)}
            className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
            style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(13,11,36,0.8)"; }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ background: "rgba(139,92,246,0.1)" }}>
              {app.emoji}
            </div>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#ede9fe", fontWeight: 500 }}>{app.name}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#6c3fc5" }}>{app.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderResearchPage = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "thin" }}>
      <div className="flex flex-col items-center justify-center py-8">
        <span className="text-5xl mb-4">🔬</span>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#ede9fe", marginBottom: "0.5rem", textAlign: "center" }}>
          {"What's on your mind today?"}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#6c3fc5", marginBottom: "2rem", textAlign: "center" }}>
          Ask a complex question. Get a full report, with sources.
        </p>
        <div className="w-full max-w-2xl mb-8">
          <div className="flex gap-2 p-3 rounded-2xl"
            style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <input type="text" placeholder="Get a detailed report..." value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResearchSubmit()}
              className="flex-1 bg-transparent outline-none"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#ede9fe" }} />
            <button onClick={() => handleResearchSubmit()}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6c3fc5, #1a0f3d)", border: "1px solid rgba(139,92,246,0.5)" }}>
              <ArrowUpRight size={16} style={{ color: "#c4b5fd" }} />
            </button>
          </div>
        </div>
        <div className="w-full max-w-2xl space-y-3">
          {researchTopics.map((topic, i) => (
            <button key={i} onClick={() => handleResearchSubmit(topic.title)}
              className="w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all"
              style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(13,11,36,0.8)"; }}>
              <ArrowUpRight size={16} style={{ color: "#8b5cf6", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#ede9fe", fontWeight: 500 }}>{topic.title}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#6c3fc5", marginTop: "0.2rem" }}>{topic.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCodexPage = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "thin" }}>
      <div className="flex flex-col items-center justify-center py-8">
        <span className="text-5xl mb-4">💻</span>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#ede9fe", marginBottom: "0.5rem" }}>COSMOS Codex</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#6c3fc5", marginBottom: "2rem", textAlign: "center" }}>Write, debug, and explain code in any language</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
          {[
            { emoji: "🐍", label: "Python", desc: "Scripts, ML, automation" },
            { emoji: "⚡", label: "JavaScript", desc: "Web, React, Node.js" },
            { emoji: "☕", label: "Java", desc: "Backend, Android" },
            { emoji: "🦀", label: "Rust", desc: "Systems programming" },
            { emoji: "🔷", label: "TypeScript", desc: "Type-safe JS" },
            { emoji: "🗄️", label: "SQL", desc: "Database queries" },
          ].map((lang, i) => (
            <button key={i}
              onClick={() => { setInput(`Help me write ${lang.label} code: `); setActivePage("chat"); setActiveMenu(""); }}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
              style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)"; (e.currentTarget as HTMLElement).style.background = "rgba(13,11,36,0.8)"; }}>
              <span className="text-2xl">{lang.emoji}</span>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#ede9fe", fontWeight: 500 }}>{lang.label}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#6c3fc5" }}>{lang.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjectsPage = () => (
    <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "thin" }}>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="p-6 rounded-2xl w-full max-w-sm"
            style={{ background: "rgba(13,11,36,0.98)", border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 0 40px rgba(139,92,246,0.3)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem", color: "#ede9fe", fontWeight: 700 }}>Edit Project</h2>
              <button onClick={() => setEditingProject(null)} style={{ color: "#6c3fc5" }}><X size={16} /></button>
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6c3fc5", marginBottom: "0.5rem" }}>Project name</p>
            <input type="text" value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveProject()}
              className="w-full px-3 py-2.5 rounded-xl outline-none mb-4"
              style={{ background: "rgba(45,27,105,0.3)", border: "1px solid rgba(139,92,246,0.3)", color: "#ede9fe", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }} />

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6c3fc5", marginBottom: "0.5rem" }}>Emoji</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {projectTemplates.map((t, i) => (
                <button key={i}
                  onClick={() => setEditingProject({ ...editingProject, emoji: t.emoji })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: editingProject.emoji === t.emoji ? "rgba(139,92,246,0.3)" : "rgba(45,27,105,0.2)",
                    border: `1px solid ${editingProject.emoji === t.emoji ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.2)"}`,
                    color: "#c4b5fd", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
                  }}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            <button onClick={handleSaveProject} className="w-full py-2.5 rounded-xl mb-2"
              style={{ background: "linear-gradient(135deg, #6c3fc5, #1a0f3d)", border: "1px solid rgba(139,92,246,0.5)", color: "#ede9fe", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
              ✅ Save Changes
            </button>

            <button onClick={() => handleDeleteProject(editingProject.id)} className="w-full py-2.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
              🗑️ Delete Project
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "#ede9fe" }}>📁 Projects</h1>
        <button onClick={() => setShowCreateProject(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
          style={{ background: "linear-gradient(135deg, #6c3fc5, #1a0f3d)", border: "1px solid rgba(139,92,246,0.5)", color: "#c4b5fd", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
          <Plus size={14} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-5xl mb-4">📂</span>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#6c3fc5" }}>No projects yet — create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {projects.map((project) => (
            <div key={project.id} className="group flex items-center gap-3 p-4 rounded-xl relative"
              style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <span className="text-2xl">{project.emoji}</span>
              <p className="flex-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "#ede9fe", fontWeight: 500 }}>
                {project.name}
              </p>
              <button
                onClick={() => { setEditingProject(project); setEditProjectName(project.name); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", fontSize: "0.8rem" }}>
                ✏️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="p-6 rounded-2xl w-full max-w-sm"
            style={{ background: "rgba(13,11,36,0.98)", border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 0 40px rgba(139,92,246,0.3)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1rem", color: "#ede9fe", fontWeight: 700 }}>Create project</h2>
              <button onClick={() => setShowCreateProject(false)} style={{ color: "#6c3fc5" }}><X size={16} /></button>
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6c3fc5", marginBottom: "0.5rem" }}>Project name</p>
            <input type="text" placeholder="My awesome project..." value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
              className="w-full px-3 py-2.5 rounded-xl outline-none mb-4"
              style={{ background: "rgba(45,27,105,0.3)", border: "1px solid rgba(139,92,246,0.3)", color: "#ede9fe", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }} />

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6c3fc5", marginBottom: "0.5rem" }}>Template</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {projectTemplates.map((t, i) => (
                <button key={i} onClick={() => setNewProjectEmoji(t.emoji)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: newProjectEmoji === t.emoji ? "rgba(139,92,246,0.3)" : "rgba(45,27,105,0.2)",
                    border: `1px solid ${newProjectEmoji === t.emoji ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.2)"}`,
                    color: "#c4b5fd", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
                  }}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#6c3fc5", marginBottom: "1rem", lineHeight: 1.5 }}>
              💡 Projects keep chats, files, and custom instructions in one place.
            </p>

            <button onClick={handleCreateProject} disabled={!newProjectName.trim()}
              className="w-full py-2.5 rounded-xl transition-all"
              style={{
                background: newProjectName.trim() ? "linear-gradient(135deg, #6c3fc5, #1a0f3d)" : "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.4)",
                color: newProjectName.trim() ? "#ede9fe" : "#6c3fc5",
                fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600,
              }}>
              Create project
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ─── MAIN RENDER ──────────────────────────────────────────────

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ background: "#03020a" }}>
      <StarField />
      <NebulaBackground />
      <div className="fixed inset-0 pointer-events-none z-0 scanlines" />

      {/* SIDEBAR */}
      <div className="relative z-20 flex-shrink-0 flex flex-col transition-all duration-300"
        style={{ width: sidebarOpen ? "260px" : "0px", overflow: "hidden", borderRight: sidebarOpen ? "1px solid rgba(139,92,246,0.15)" : "none", background: "rgba(8,6,24,0.97)", backdropFilter: "blur(20px)" }}>

        <div className="flex-shrink-0 px-4 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🪐</span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", color: "#ede9fe" }}>COSMOS</span>
          </div>
        </div>

        <div className="flex-shrink-0 px-2 pt-3 pb-2">
          {sidebarMenu.map((item, i) => (
            <button key={i} onClick={() => handleMenuClick(item.action)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-0.5"
              style={{ background: activeMenu === item.action ? "rgba(45,27,105,0.5)" : "transparent", border: activeMenu === item.action ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent", color: activeMenu === item.action ? "#c4b5fd" : "#8b5cf6" }}
              onMouseEnter={(e) => { if (activeMenu !== item.action) { (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.2)"; (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; } }}
              onMouseLeave={(e) => { if (activeMenu !== item.action) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8b5cf6"; } }}>
              <span className="flex-shrink-0">{item.icon}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}>{item.label}</span>
            </button>
          ))}
        </div>

        {activeMenu === "search" && (
          <div className="px-3 pb-2">
            <input type="text" placeholder="Search chats..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl outline-none"
              style={{ background: "rgba(13,11,36,0.8)", border: "1px solid rgba(139,92,246,0.3)", color: "#ede9fe", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }} />
          </div>
        )}

        <div style={{ height: "1px", background: "rgba(139,92,246,0.08)", margin: "0 12px 8px" }} />
        <div className="px-4 pb-2">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#6c3fc5", opacity: 0.6 }}>RECENT CHATS</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5" style={{ scrollbarWidth: "thin" }}>
          {(activeMenu === "search" ? filteredSessions : chatSessions).length === 0 ? (
            <p className="text-center px-4 py-6" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#6c3fc5", opacity: 0.5 }}>
              {activeMenu === "search" ? "NO RESULTS" : "NO CHATS YET"}
            </p>
          ) : (
            (activeMenu === "search" ? filteredSessions : chatSessions).map((session) => (
              <div key={session.id} onClick={() => handleLoadSession(session)}
                className="group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                style={{ background: session.id === currentSessionId ? "rgba(45,27,105,0.5)" : "transparent", border: session.id === currentSessionId ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent" }}
                onMouseEnter={(e) => { if (session.id !== currentSessionId) (e.currentTarget as HTMLElement).style.background = "rgba(45,27,105,0.2)"; }}
                onMouseLeave={(e) => { if (session.id !== currentSessionId) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <MessageSquare size={11} style={{ color: "#6c3fc5", flexShrink: 0 }} />
                <p className="flex-1 truncate" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#a78bfa" }}>{session.title}</p>
                <button onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ color: "#6c3fc5" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6c3fc5"; }}>
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-5 h-10 flex items-center justify-center rounded-r-lg"
          style={{ background: "rgba(45,27,105,0.8)", border: "1px solid rgba(139,92,246,0.3)", borderLeft: "none", color: "#c4b5fd" }}>
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {activePage === "chat" && (
          <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
            <Header messageCount={messages.length} />
            <div ref={scrollRef} onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
              {messages.length === 0 && <WelcomeScreen />}
              {messages.length === 0 && <SuggestedQuestions onSelect={handleSuggestedQuestion} />}
              {messages.map((message, i) => (
                <ChatMessage key={message.id}
                  role={message.role as "user" | "assistant"}
                  content={message.content}
                  isStreaming={isLoading && i === messages.length - 1 && message.role === "assistant"} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
              {error && <ErrorState onRetry={reload} />}
              <div className="h-2" />
            </div>

            {hasScrolledUp && messages.length > 0 && (
              <button
                onClick={() => { setHasScrolledUp(false); scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: "rgba(45,27,105,0.9)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", backdropFilter: "blur(12px)" }}>
                ↓ NEW TRANSMISSIONS
              </button>
            )}

            <ChatInput
              value={input}
              onChange={(val) => handleInputChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)}
              onSubmit={handleManualSubmit}
              isLoading={isLoading}
              disabled={!!error}
            />
          </div>
        )}

        {activePage === "images" && renderImagesPage()}
        {activePage === "apps" && renderAppsPage()}
        {activePage === "research" && renderResearchPage()}
        {activePage === "codex" && renderCodexPage()}
        {activePage === "projects" && renderProjectsPage()}
      </div>
    </div>
  );
}