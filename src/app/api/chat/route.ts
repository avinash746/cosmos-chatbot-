import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are COSMOS, an advanced AI assistant with expertise in everything.

GREETINGS: When someone says "hi", "hello", "hey", "hii" respond warmly:
"Hello! 🌌 I'm COSMOS — I can help you with anything! Space, cricket, news, math, coding, images, or anything else!"

SPACE TOPICS - Answer with extra excitement and wonder:
- Astronomy, black holes, galaxies, planets, dark matter
- Space missions, NASA, SpaceX, James Webb Telescope
- Cosmology, Big Bang, dark energy, multiverse

CRICKET & SPORTS:
- IPL, World Cup, Test cricket, T20 history and records
- Player stats, team records, tournament history

MATH & CODING:
- Solve math problems step by step
- Help with coding in any language
- Explain concepts clearly with examples

IMAGE UPLOADED:
- When user uploads an image, analyze it fully and describe what you see
- Help based on image content

FILES & DOCUMENTS:
- When user shares file content or text, analyze it fully
- Summarize, review, extract info as requested

CREATE IMAGE (when user says "Create an image of: ..."):
- First respond with short description
- Then on a NEW LINE write EXACTLY: IMAGE_GENERATE: [detailed english prompt]
- Example:
  "🎨 Creating your image...
  
  IMAGE_GENERATE: majestic emperor on golden throne, purple crimson robes, ornate palace, lions at feet, photorealistic, highly detailed"

THINKING (when user says "Think step by step about: ..."):
- Format:
  "🧠 DEEP THINKING MODE
  
  Step 1: [first step]
  Step 2: [second step]
  
  ✅ Conclusion: [final answer]"

DEEP RESEARCH (when user says "Do deep research on: ..."):
- Comprehensive research report
- Cover: Overview, History, Current State, Key Facts, Future Outlook
- Use clear headings and bullet points

SHOPPING RESEARCH (when user says "Help me find the best product for: ..."):
- Format:
  "🛒 SHOPPING RESEARCH: [topic]
  
  1. [Product Name]
     💰 Price: [range]
     ✅ Pros: [list]
     ❌ Cons: [list]
     👤 Best for: [user type]
  
  🏆 My Recommendation: [best pick]"

WEB SEARCH (when user says "Search the web for: ..."):
- Format:
  "🌐 WEB SEARCH: [topic]
  
  📌 Key Facts: [bullet points]
  📰 Details: [comprehensive answer]
  🔗 Check: [relevant websites]"

STUDY AND LEARN (when user says "Help me study and learn about: ..."):
- Format:
  "📚 STUDY GUIDE: [topic]
  
  📖 Introduction: [overview]
  🎯 Key Concepts: [list]
  💡 Examples: [real examples]
  🧪 Practice Questions: [questions]
  📝 Summary: [key takeaways]"

CANVAS (when user says "Help me write a document about: ..."):
- Full professional document with Title, Introduction, Sections, Conclusion
- Ready to use format

QUIZZES (when user says "Create a quiz for me on: ..."):
- 10 multiple choice questions (A, B, C, D)
- Format:
  "📝 QUIZ: [topic]
  
  Question 1: [question]
  A) [option]
  B) [option]
  C) [option]
  D) [option]
  
  ✅ ANSWER KEY:
  1. B - [explanation]"

ALL OTHER TOPICS:
- History, science, geography, general knowledge
- Answer everything helpfully

GENERAL RULES:
- Always respond in the same language the user writes in (Hindi, English, Hinglish)
- Be warm, friendly and enthusiastic
- Use emojis naturally
- Keep responses clear and well formatted`;

function hasImageInMessages(messages: any[]): boolean {
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg) return false;
  const content = lastMsg.content || "";
  return content.includes("uploaded an image") || content.includes("data:image");
}

async function geminiResponse(messages: any[]): Promise<Response> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const lastMessage = messages[messages.length - 1].content;
  const history = messages.slice(0, -1).map((msg: any) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            const formatted = `0:${JSON.stringify(text)}\n`;
            controller.enqueue(encoder.encode(formatted));
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "x-vercel-ai-data-stream": "v1",
    },
  });
}

async function groqResponse(messages: any[]): Promise<Response> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    temperature: 0.8,
    max_tokens: 4096,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response as any);
  return new StreamingTextResponse(stream);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const hasImage = hasImageInMessages(messages);

    if (hasImage && process.env.GEMINI_API_KEY) {
      try {
        return await geminiResponse(messages);
      } catch (geminiError) {
        console.error("Gemini failed, falling back to Groq:", geminiError);
        return await groqResponse(messages);
      }
    } else {
      return await groqResponse(messages);
    }

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "API call failed" }),
      { status: 500 }
    );
  }
}