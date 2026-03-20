# 🪐 COSMOS — Space Intelligence Chatbot

> *Your AI assistant for space, coding, research, images, and everything else.*

A purpose-built AI chatbot with a cinematic cosmic UI. Built as a frontend engineering assignment for Thinkly Labs.

---

## 🚀 Live Demo

**[cosmos-chatbot.vercel.app](https://cosmos-chatbot.vercel.app)** ← Replace with your deployed URL

---

## 🌌 Why Space?

Space exploration is one of humanity's most profound pursuits — it pushes the boundaries of science, philosophy, and imagination. I chose it because:

- The **visual identity** writes itself — dark, cinematic, glowing, awe-inspiring
- It's **genuinely interesting** to talk about — black holes, dark matter, exoplanets, the Big Bang
- The topic allows the **AI personality** to shine — COSMOS speaks with wonder and scientific depth
- The **cosmic aesthetic** naturally justifies every design decision — stars, nebulae, glows, dark backgrounds

---

## ✨ Features

### 🤖 AI Capabilities
- **COSMOS AI** — powered by Groq (LLaMA 3.3 70B) with a distinct space-expert personality
- **Image Analysis** — Gemini 1.5 Flash analyzes uploaded images
- **Image Generation** — Hugging Face FLUX.1 generates real AI images
- **Streaming responses** — real-time token streaming via Vercel AI SDK
- **Markdown rendering** — formatted responses with lists, bold, code blocks

### 💬 Chat Features
- **Suggested questions** — 6 curated space prompts on welcome screen
- **Chat history** — saved to localStorage, searchable sidebar
- **New chat** — fresh conversation anytime
- **Auto-scroll** — follows conversation, detects manual scroll-up

### 🎨 Feature Pages
- **Images page** — generate AI images, upload for analysis, style cards
- **Apps page** — connect with favorite apps (Photoshop, Spotify, Canva etc.)
- **Deep Research** — comprehensive research reports
- **Codex** — coding help in Python, JS, TypeScript, SQL etc.
- **Projects** — create, edit, delete personal projects

### 📎 File Support
- Images (JPG, PNG, WEBP) — AI analysis
- PDF — document help
- TXT, CSV, JS, TS, PY, JSON — content reading & analysis

### 🛠️ Feature Menu (+ button)
- Add photos & files
- Create image
- Thinking (step-by-step reasoning)
- Deep research
- Shopping research
- Web search
- Study and learn
- Canvas (document writing)
- Quizzes (MCQ generation)

### 🎨 Frontend Design
- ⭐ Canvas-based animated star field (200 twinkling stars)
- 🌫️ Layered nebula orbs with blur effects
- 🪐 Animated planet with orbital ring on welcome screen
- 🔡 Orbitron + Space Mono + Inter fonts
- 📟 CRT scanlines overlay
- 💎 Glassmorphism panels with violet glow borders
- ⌛ "COSMOS COMPUTING" typing indicator
- 🌊 Streaming cursor during AI responses
- 📱 Fully responsive — mobile, tablet, desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Primary AI | Groq — LLaMA 3.3 70B |
| Image Analysis | Google Gemini 1.5 Flash |
| Image Generation | Hugging Face FLUX.1-schnell |
| Streaming | Vercel AI SDK |
| Fonts | Google Fonts (Orbitron, Space Mono, Inter) |
| Markdown | react-markdown + remark-gfm |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Project Structure
```
space-chatbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts        # Chat API — Groq + Gemini
│   │   │   └── image/
│   │   │       └── route.ts        # Image generation — HuggingFace
│   │   ├── globals.css             # Cosmic design system
│   │   ├── layout.tsx              # Root layout with fonts
│   │   └── page.tsx                # Main app with all pages
│   └── components/
│       ├── StarField.tsx           # Canvas star field animation
│       ├── NebulaBackground.tsx    # Ambient nebula layers
│       ├── Header.tsx              # Brand + status bar
│       ├── WelcomeScreen.tsx       # Empty state with planet
│       ├── SuggestedQuestions.tsx  # 6 topic prompt cards
│       ├── ChatMessage.tsx         # Message bubbles + image gen
│       ├── ChatInput.tsx           # Textarea + feature menu
│       ├── TypingIndicator.tsx     # Loading animation
│       └── ErrorState.tsx          # Error with retry
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Setup & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/space-chatbot.git
cd space-chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Groq API (free) — https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx

# Google Gemini (free) — https://aistudio.google.com
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxx

# Hugging Face (free) — https://huggingface.co/settings/tokens
HF_API_KEY=hf_xxxxxxxxxxxxxxxx
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI
```bash
npx vercel --prod
```

### Option B — GitHub Integration

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Add environment variables:
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
   - `HF_API_KEY`
5. Deploy ✅

---

## 🔑 API Keys (All Free)

| Service | Get Key | Used For |
|---|---|---|
| **Groq** | [console.groq.com](https://console.groq.com) | Main AI chat |
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com) | Image analysis |
| **Hugging Face** | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | Image generation |

---

## 💡 AI Usage

Built with the help of Claude (Anthropic) for:
- Generating the cosmic UI design system
- Writing Tailwind config with custom keyframes
- Drafting the COSMOS system prompt personality
- Debugging API integration issues

All prompting, code review, integration, and feature decisions were done manually.

---

## 🎯 Assignment Checklist

- ✅ Chatbot trained on a specific topic (Space + general AI)
- ✅ UI reflects the topic (cosmic dark theme)
- ✅ Functional and deployed on Vercel
- ✅ Responsive design
- ✅ Loading states — "COSMOS COMPUTING" indicator
- ✅ Error states — "Signal Lost" with retry
- ✅ Empty states — welcome screen with planet animation
- ✅ Small details — streaming cursor, scanlines, star field
- ✅ GitHub repo with README
- ✅ Built using AI tools (Claude, Cursor)

---

## 📬 Contact

Built by **[Avinash Kumar]** for Thinkly Labs Software Engineering Assignment — March 2026.

GitHub: [@yourusername](https://github.com/yourusername)