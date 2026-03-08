"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type MessageRole = "user" | "ai";
type Language = "en" | "bn";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    area?: string;
    confidence?: "high" | "medium" | "low";
    escalate?: boolean;
    knowledgeMatched?: boolean;
  };
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lawArea?: string;
}

const MAX_QUESTIONS = 10;

const UI_TEXT = {
  en: {
    active: "Online",
    freeLeft: (n: number) => `${n} free`,
    quickTopics: "Where would you like to start?",
    limitTitle: `You've reached your free limit`,
    limitSub: "Subscribe for unlimited access with human legal assistance",
    subscribeBtn: "Subscribe Now",
    placeholder: "Describe your situation...",
    placeholderLimit: "Subscribe to continue...",
    footer: "Legal information only — not legal advice. Enter to send.",
    listenBtn: "Voice",
    stopListenBtn: "Stop",
    speakBtn: "Listen",
    stopSpeakBtn: "Stop",
    langToggle: "বাংলা",
    newChat: "New Chat",
    history: "Recent",
    today: "Today",
    yesterday: "Yesterday",
    greeting: `Hello. I'm **JesAI** — your Bangladesh legal literacy companion.\n\nDescribe your situation in plain language. I'll identify the relevant laws, explain your rights, and walk you through your options.\n\n_What's your legal question today?_`,
  },
  bn: {
    active: "সক্রিয়",
    freeLeft: (n: number) => `${n} বাকি`,
    quickTopics: "কোথায় শুরু করতে চান?",
    limitTitle: "বিনামূল্যে সীমা শেষ",
    limitSub: "সীমাহীন অ্যাক্সেসের জন্য সাবস্ক্রাইব করুন",
    subscribeBtn: "সাবস্ক্রাইব করুন",
    placeholder: "আপনার পরিস্থিতি বলুন...",
    placeholderLimit: "চালিয়ে যেতে সাবস্ক্রাইব করুন...",
    footer: "শুধুমাত্র আইনি তথ্য — পরামর্শ নয়। পাঠাতে Enter চাপুন।",
    listenBtn: "ভয়েস",
    stopListenBtn: "বন্ধ",
    speakBtn: "শুনুন",
    stopSpeakBtn: "বন্ধ",
    langToggle: "English",
    newChat: "নতুন চ্যাট",
    history: "সাম্প্রতিক",
    today: "আজ",
    yesterday: "গতকাল",
    greeting: `আসসালামুয়ালাইকুম। আমি **JesAI** — আপনার বাংলাদেশ আইনি সাক্ষরতার সহায়ক।\n\nআপনার পরিস্থিতি সহজ ভাষায় বলুন। আমি প্রাসঙ্গিক আইন চিহ্নিত করব এবং আপনার অধিকার ও পদক্ষেপ ব্যাখ্যা করব।\n\n_আজ আপনার আইনি প্রশ্ন কী?_`,
  },
};

const QUICK_TOPICS = {
  en: [
    { icon: "🏠", label: "Land & Property" },
    { icon: "👨‍👩‍👧", label: "Family & Marriage" },
    { icon: "🚔", label: "Police & Criminal" },
    { icon: "💼", label: "Employment" },
    { icon: "📝", label: "Contracts" },
    { icon: "💰", label: "Tax & VAT" },
    { icon: "🏢", label: "Company & RJSC" },
    { icon: "✈️", label: "NRB Investment" },
  ],
  bn: [
    { icon: "🏠", label: "জমি ও সম্পত্তি" },
    { icon: "👨‍👩‍👧", label: "পরিবার ও বিবাহ" },
    { icon: "🚔", label: "পুলিশ ও ফৌজদারি" },
    { icon: "💼", label: "চাকরি" },
    { icon: "📝", label: "চুক্তি" },
    { icon: "💰", label: "কর ও ভ্যাট" },
    { icon: "🏢", label: "কোম্পানি ও RJSC" },
    { icon: "✈️", label: "প্রবাসী বিনিয়োগ" },
  ],
};

function formatMessage(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      return <p key={i} className="font-semibold text-white mt-3 mb-1 text-[13px] tracking-wide">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return <p key={i} className="my-0.5 text-[13px] leading-relaxed">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{p}</strong> : p)}</p>;
    }
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return <p key={i} className="pl-3 my-0.5 flex gap-2 text-[13px] leading-relaxed"><span className="text-[#4ade80] mt-1 flex-shrink-0 text-[10px]">▸</span><span>{line.slice(2)}</span></p>;
    }
    if (/^\d+\./.test(line)) return <p key={i} className="pl-3 my-0.5 text-[13px] leading-relaxed">{line}</p>;
    if (line.startsWith("---")) return <hr key={i} className="border-white/10 my-3" />;
    if (line.startsWith("_") && line.endsWith("_")) return <p key={i} className="italic text-slate-400 my-0.5 text-[13px]">{line.replace(/_/g, "")}</p>;
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="my-0.5 text-[13px] leading-relaxed">{line}</p>;
  });
}

function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }

function getConvTitle(messages: Message[]): string {
  const first = messages.find(m => m.role === "user");
  if (!first) return "New conversation";
  return first.content.slice(0, 36) + (first.content.length > 36 ? "…" : "");
}

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [lang, setLang] = useState<Language>("en");
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const t = UI_TEXT[lang];
  const freeRemaining = Math.max(0, MAX_QUESTIONS - questionCount);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Init greeting
  useEffect(() => {
    startNewChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function startNewChat() {
    const id = genId();
    const greeting: Message = {
      id: "greeting-" + id,
      role: "ai",
      content: t.greeting,
      timestamp: new Date(),
    };
    setMessages([greeting]);
    setActiveConvId(id);
    setQuestionCount(0);
    setInput("");
    setApiError(null);
    setSidebarOpen(false);
  }

  function saveCurrentConversation(msgs: Message[]) {
    if (msgs.filter(m => m.role === "user").length === 0) return;
    setConversations(prev => {
      const existing = prev.find(c => c.id === activeConvId);
      if (existing) {
        return prev.map(c => c.id === activeConvId ? { ...c, messages: msgs, title: getConvTitle(msgs) } : c);
      }
      return [{ id: activeConvId, title: getConvTitle(msgs), messages: msgs, createdAt: new Date() }, ...prev];
    });
  }

  function loadConversation(conv: Conversation) {
    setMessages(conv.messages);
    setActiveConvId(conv.id);
    setQuestionCount(conv.messages.filter(m => m.role === "user").length);
    setSidebarOpen(false);
  }

  const callJesAI = useCallback(async (userMessage: string, currentMessages: Message[]) => {
    setApiError(null);
    setIsTyping(true);
    const history = currentMessages.filter(m => m.id !== "greeting-" + activeConvId).slice(-6).map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history, language: lang }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const aiMsg: Message = {
        id: genId(),
        role: "ai",
        content: data.response,
        timestamp: new Date(),
        metadata: data.metadata,
      };
      setMessages(prev => {
        const updated = [...prev, aiMsg];
        saveCurrentConversation(updated);
        return updated;
      });
      setQuestionCount(c => c + 1);
    } catch {
      setApiError("Unable to connect. Please try again.");
      const fallback: Message = {
        id: genId(),
        role: "ai",
        content: "I'm temporarily unavailable. For urgent legal matters, please consult a certified Bangladesh Bar Council advocate directly.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, activeConvId]);

  const sendMessage = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping || questionCount >= MAX_QUESTIONS) return;
    const userMsg: Message = { id: genId(), role: "user", content: messageText, timestamp: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    await callJesAI(messageText, updated);
  }, [input, isTyping, questionCount, messages, callJesAI]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SR = (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition || window.SpeechRecognition;
    const r = new SR();
    r.lang = lang === "bn" ? "bn-BD" : "en-BD";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e: SpeechRecognitionEvent) => { setInput(p => p + e.results[0][0].transcript); setIsListening(false); };
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    recognitionRef.current = r;
    r.start();
    setIsListening(true);
  }, [lang]);

  const stopListening = useCallback(() => { recognitionRef.current?.stop(); setIsListening(false); }, []);

  const speakMessage = useCallback((id: string, content: string) => {
    if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(content.replace(/\*\*/g, "").replace(/\*/g, "").replace(/---/g, ""));
    u.lang = lang === "bn" ? "bn-BD" : "en-US";
    u.rate = 0.9;
    u.onend = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(u);
  }, [speakingId, lang]);

  const toggleLang = useCallback(() => { setLang(l => l === "en" ? "bn" : "en"); }, []);

  const isToday = (d: Date) => new Date().toDateString() === d.toDateString();
  const isYesterday = (d: Date) => { const y = new Date(); y.setDate(y.getDate() - 1); return y.toDateString() === d.toDateString(); };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }} className="flex h-full bg-[#080f1e] overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-64 h-full flex flex-col border-r border-white/[0.06] bg-[#0a1220] transition-transform duration-300 ease-out`}>

        {/* Sidebar top */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-[#006a4e] flex items-center justify-center">
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-white font-bold text-sm">J</span>
            </div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-white font-semibold text-sm tracking-tight">
              Jes<span className="text-[#c8a84b]">AI</span>
            </span>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-500 hover:text-white p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <button onClick={startNewChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#005a40] text-white text-xs font-medium transition-all duration-200 shadow-lg shadow-[#006a4e]/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {t.newChat}
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-3">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[11px] text-slate-600">No conversations yet</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium px-2 mb-2">{t.history}</p>
              <div className="space-y-0.5">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group ${conv.id === activeConvId ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"}`}
                  >
                    <div className="text-[12px] font-medium truncate leading-tight">{conv.title}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      {isToday(conv.createdAt) ? t.today : isYesterday(conv.createdAt) ? t.yesterday : conv.createdAt.toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="px-2 py-1.5 rounded-xl bg-[#f42a41]/10 border border-[#f42a41]/20">
            <p className="text-[10px] text-[#f42a41] font-semibold">⚠ Legal information only</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Not legal advice. Consult a Bar Council advocate for representation.</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" />
      )}

      {/* ── Main Chat ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#080f1e]/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-[#006a4e] flex items-center justify-center shadow-lg shadow-[#006a4e]/30">
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-white font-bold text-base leading-none">J</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#4ade80] border-2 border-[#080f1e]" />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-white font-semibold text-sm leading-none tracking-tight">
                  Jes<span className="text-[#c8a84b]">AI</span>
                </h1>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{t.active} · Bangladesh Law</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.some(m => m.metadata?.knowledgeMatched) && (
              <span className="hidden sm:flex text-[10px] px-2 py-1 rounded-full bg-[#c8a84b]/10 text-[#c8a84b] border border-[#c8a84b]/20 items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b] inline-block" />
                NLC Verified
              </span>
            )}
            <button onClick={toggleLang} className="text-[11px] px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-[#006a4e]/40 transition-all duration-200 font-medium">
              {t.langToggle}
            </button>
            <div className={`text-[11px] px-2.5 py-1.5 rounded-lg font-medium tabular-nums ${freeRemaining <= 3 ? "bg-[#f42a41]/15 text-[#f42a41]" : "bg-[#006a4e]/15 text-[#4ade80]"}`}>
              {t.freeLeft(freeRemaining)}
            </div>
          </div>
        </header>

        {/* Error */}
        {apiError && (
          <div className="mx-4 mt-2 px-3 py-2 rounded-xl bg-[#f42a41]/10 border border-[#f42a41]/20 text-[11px] text-[#f42a41] flex items-center gap-2 flex-shrink-0">
            <span>⚠</span>{apiError}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {/* Avatar */}
              <div className={`flex-shrink-0 h-7 w-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-md ${msg.role === "ai" ? "bg-[#006a4e] text-white shadow-[#006a4e]/30" : "bg-[#c8a84b] text-[#0a1628] shadow-[#c8a84b]/20"}`}>
                {msg.role === "ai" ? "J" : "U"}
              </div>

              <div className={`max-w-[82%] space-y-1.5 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 text-slate-300 ${
                  msg.role === "ai"
                    ? "bg-[#0d1e35] border border-white/[0.07] rounded-tl-md shadow-xl shadow-black/20"
                    : "bg-[#006a4e] text-white rounded-tr-md shadow-lg shadow-[#006a4e]/25"
                }`}>
                  {msg.role === "ai" ? (
                    <div className="space-y-0">{formatMessage(msg.content)}</div>
                  ) : (
                    <p className="text-[13px] leading-relaxed">{msg.content}</p>
                  )}

                  <div className="flex items-center justify-between mt-2.5 gap-3">
                    <span suppressHydrationWarning className={`text-[10px] tabular-nums ${msg.role === "ai" ? "text-slate-700" : "text-green-200/50"}`}>
                      {msg.timestamp.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "ai" && (
                      <button onClick={() => speakMessage(msg.id, msg.content)} className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-all duration-200 ${speakingId === msg.id ? "bg-[#f42a41]/20 text-[#f42a41]" : "bg-white/[0.05] text-slate-600 hover:text-[#4ade80] hover:bg-[#006a4e]/15"}`}>
                        {speakingId === msg.id ? "■ " + t.stopSpeakBtn : "▶ " + t.speakBtn}
                      </button>
                    )}
                  </div>
                </div>

                {/* Metadata tags */}
                {msg.metadata && (
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {msg.metadata.area && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#006a4e]/10 text-[#4ade80] border border-[#006a4e]/20">{msg.metadata.area}</span>
                    )}
                    {msg.metadata.knowledgeMatched && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c8a84b]/10 text-[#c8a84b] border border-[#c8a84b]/20">NLC Verified</span>
                    )}
                    {msg.metadata.escalate && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f42a41]/10 text-[#f42a41] border border-[#f42a41]/20">Consult Lawyer</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="chat-bubble flex gap-3">
              <div className="h-7 w-7 rounded-xl bg-[#006a4e] flex items-center justify-center text-xs font-bold text-white shadow-md shadow-[#006a4e]/30 flex-shrink-0">J</div>
              <div className="bg-[#0d1e35] border border-white/[0.07] rounded-2xl rounded-tl-md px-4 py-3 shadow-xl shadow-black/20">
                <div className="flex gap-1.5 items-center h-4">
                  <div className="typing-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                  <div className="typing-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                  <div className="typing-dot h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick topic chips */}
        {messages.filter(m => m.role === "user").length === 0 && (
          <div className="px-4 pb-3 flex-shrink-0">
            <p className="text-[11px] text-slate-600 mb-2.5 font-medium">{t.quickTopics}</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS[lang].map((topic) => (
                <button key={topic.label} onClick={() => sendMessage(topic.label)}
                  className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:border-[#006a4e]/40 hover:bg-[#006a4e]/10 transition-all duration-200">
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Limit reached */}
        {questionCount >= MAX_QUESTIONS && (
          <div className="mx-4 mb-3 p-4 rounded-2xl bg-[#c8a84b]/10 border border-[#c8a84b]/25 text-center flex-shrink-0">
            <p className="text-sm text-[#c8a84b] font-semibold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{t.limitTitle}</p>
            <p className="text-[12px] text-slate-400 mt-1">{t.limitSub}</p>
            <button className="mt-3 px-5 py-2 rounded-xl bg-[#c8a84b] text-[#0a1628] text-xs font-bold hover:bg-[#b8943b] transition-colors shadow-lg shadow-[#c8a84b]/20">
              {t.subscribeBtn}
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-white/[0.06] p-4 bg-[#080f1e] flex-shrink-0">
          <div className="flex gap-2.5 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || questionCount >= MAX_QUESTIONS}
                placeholder={questionCount >= MAX_QUESTIONS ? t.placeholderLimit : t.placeholder}
                rows={2}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-[#0d1e35] px-4 py-3 text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-[#006a4e]/50 focus:ring-1 focus:ring-[#006a4e]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 leading-relaxed shadow-inner"
              />
            </div>

            {/* Voice */}
            <button onClick={isListening ? stopListening : startListening}
              disabled={isTyping || questionCount >= MAX_QUESTIONS}
              title={isListening ? t.stopListenBtn : t.listenBtn}
              className={`flex-shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${isListening ? "bg-[#f42a41] shadow-lg shadow-[#f42a41]/30 animate-pulse" : "bg-[#0d1e35] border border-white/[0.08] text-slate-500 hover:text-white hover:border-[#006a4e]/40"}`}>
              {isListening ? (
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
            </button>

            {/* Send */}
            <button onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping || questionCount >= MAX_QUESTIONS}
              className="flex-shrink-0 h-11 w-11 rounded-2xl bg-[#006a4e] flex items-center justify-center text-white hover:bg-[#005a40] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#006a4e]/30 hover:shadow-[#006a4e]/50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-700 mt-2 text-center max-w-4xl mx-auto">{t.footer}</p>
        </div>
      </div>
    </div>
  );
}
