// ─── JesAI API Route — LLM-Powered Legal AI ──────────────────
//
// ARCHITECTURE:
//   User message
//     → queryKnowledge()        [RAG: find relevant Q&A + rules]
//     → buildSystemPrompt()     [inject BD law context]
//     → Gemini API              [LLM generates personalised answer]
//     → applyPaywallTier()      [gate conclusion for free users]
//     → stream to client
//
// LLM FALLBACK:
//   If Gemini unavailable / key missing → falls back to static
//   knowledge store response (current behavior). Zero downtime.
//
// ENV REQUIRED:
//   GEMINI_API_KEY=your_key_here   (Google AI Studio — free tier)
//
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import type { LawArea, KnowledgeResult } from "@/lib/knowledge/types";
import {
  queryKnowledge,
  detectArea,
  formatResponse,
  TIER_PRICING,
} from "@/lib/knowledge";
import {
  matchScenario,
  nextStep,
  isNextStepCommand,
  isPrevStepCommand,
  type ScenarioSession,
} from "@/lib/knowledge/scenario-manager";

// ─── Config ───────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const GEMINI_MODEL   = "gemini-2.0-flash"; // free tier, fast
const LLM_ENABLED    = GEMINI_API_KEY.length > 0;

// ─── Language Detection ───────────────────────────────────────
function detectLanguage(text: string): "bn" | "en" {
  return /[\u0980-\u09FF]/.test(text) ? "bn" : "en";
}

// ─── Area Labels ──────────────────────────────────────────────
const AREA_LABELS: Record<string, { en: string; bn: string }> = {
  property:       { en: "Land & Property Law",   bn: "ভূমি ও সম্পত্তি আইন"   },
  criminal:       { en: "Criminal Law",           bn: "ফৌজদারি আইন"            },
  family:         { en: "Family Law",             bn: "পারিবারিক আইন"          },
  labour:         { en: "Labour Law",             bn: "শ্রম আইন"               },
  company:        { en: "Company Law",            bn: "কোম্পানি আইন"           },
  tax:            { en: "Tax Law",                bn: "কর আইন"                 },
  nrb:            { en: "NRB Investment Law",     bn: "প্রবাসী বিনিয়োগ আইন"   },
  constitutional: { en: "Constitutional Law",     bn: "সাংবিধানিক আইন"         },
  consumer:       { en: "Consumer Rights Law",    bn: "ভোক্তা অধিকার আইন"     },
  cyber:          { en: "Cyber Law",              bn: "সাইবার আইন"             },
  contract:       { en: "Contract Law",           bn: "চুক্তি আইন"             },
};

// ─── Out-of-scope response ────────────────────────────────────
function outOfScopeResponse(
  selectedArea: LawArea,
  detectedArea: LawArea | null,
  lang: "en" | "bn"
): string {
  const sel = AREA_LABELS[selectedArea] ?? { en: selectedArea, bn: selectedArea };
  const det = detectedArea ? (AREA_LABELS[detectedArea] ?? null) : null;
  if (lang === "bn") {
    return (
      `আপনি এখন **${sel.bn}** বিভাগে আছেন।\n\n` +
      (det ? `আপনার প্রশ্নটি **${det.bn}** বিষয়ক মনে হচ্ছে।\n\n` : "") +
      `এই বিভাগে শুধুমাত্র **${sel.bn}** সংক্রান্ত প্রশ্ন করুন।\n\n` +
      `অন্য বিষয়ের জন্য মূল মেনু থেকে সঠিক বিভাগ বেছে নিন।`
    );
  }
  return (
    `You are in the **${sel.en}** section.\n\n` +
    (det ? `Your question appears to be about **${det.en}**.\n\n` : "") +
    `Please ask about **${sel.en}** only, or return to the main menu to switch topics.`
  );
}

// ─── LLM System Prompt Builder ────────────────────────────────
// Injects NLC-validated law context into the LLM's memory
function buildSystemPrompt(
  result: KnowledgeResult,
  selectedArea: LawArea | null,
  isPaid: boolean,
  lang: "en" | "bn"
): string {
  const areaLabel = selectedArea
    ? (AREA_LABELS[selectedArea]?.[lang === "bn" ? "bn" : "en"] ?? selectedArea)
    : "Bangladesh Law";

  // Collect validated law context from knowledge store
  const lawContext: string[] = [];

  if (result.qaEntry) {
    const { irac } = result.qaEntry;
    lawContext.push(`VALIDATED Q&A:\nIssue: ${irac.issue}\nLaw: ${irac.rule}`);
    if (isPaid) {
      lawContext.push(`Application: ${irac.application}\nConclusion: ${irac.conclusion}`);
    }
    if (result.qaEntry.escalate && result.qaEntry.escalateReason) {
      lawContext.push(`URGENT: ${result.qaEntry.escalateReason}`);
    }
  }

  if (result.rules.length > 0) {
    const rulesSummary = result.rules
      .slice(0, 4)
      .map((r) => `• ${r.title} [${r.source}]: ${r.rule.slice(0, 200)}`)
      .join("\n");
    lawContext.push(`APPLICABLE LAWS:\n${rulesSummary}`);
  }

  const langInstruction =
    lang === "bn"
      ? "LANGUAGE: Respond in Bengali (বাংলা). Use simple, clear Bengali. Legal terms may be in English where standard (FIR, RJSC, etc)."
      : "LANGUAGE: Respond in English.";

  const tierInstruction = isPaid
    ? "TIER: PAID — Give the complete, detailed answer including all steps and what to do."
    : `TIER: FREE — Give a helpful answer covering: (1) what the law says, (2) the user's situation briefly. 
Then end with: "🔒 **Unlock full answer — ৳[price]** to get: step-by-step action plan, document checklist, and detailed legal strategy."
Do NOT reveal the conclusion or specific action steps — those are behind the paywall.`;

  return `You are JesAI — a para-legal AI assistant for Bangladesh law, created by Neum Lex Counsel (NLC).
You are an expert in ${areaLabel}.

CORE RULES:
1. Only answer questions about Bangladesh law in the subject: ${areaLabel}
2. Always base your answer on the validated law context provided below
3. Never make up laws, cases, or penalties — only use what is in the context
4. If context doesn't cover the question, say so honestly and suggest consulting an advocate
5. Never use the word "IRAC" — instead say "What the law says", "How it applies", "What you should do"
6. Always end with the NLC disclaimer: "⚠️ This is legal information, not legal advice. For representation, consult a Bar Council advocate."
7. If the situation involves urgency (arrest, illegal detention, violence) — always flag this prominently

${langInstruction}

${tierInstruction}

NLC-VALIDATED LAW CONTEXT (use this as your primary source):
${lawContext.length > 0 ? lawContext.join("\n\n") : `Subject area: ${areaLabel}. Use your knowledge of Bangladesh law for this subject.`}

ABOUT NLC:
- Neum Lex Counsel — founded by Md Nazmul Islam, Advocate, Supreme Court of Bangladesh
- WhatsApp for paid consultations and document services
- Platform: JesAI (jes-ai-law-order.vercel.app)`;
}

// ─── Gemini API Call ──────────────────────────────────────────
async function callGemini(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: { role: "user" | "model"; text: string }[] = []
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // Build conversation contents
  const contents = [
    // System prompt as first user turn (Gemini doesn't have system role)
    {
      role: "user",
      parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${systemPrompt}\n[END SYSTEM]\n\nUser's question: ${userMessage}` }],
    },
  ];

  // Add conversation history for multi-turn context
  for (const turn of conversationHistory.slice(-6)) { // last 3 exchanges
    contents.push({
      role: turn.role,
      parts: [{ text: turn.text }],
    });
  }

  const body = {
    contents,
    generationConfig: {
      temperature: 0.3,        // low = factual, deterministic
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      stopSequences: [],
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000), // 15s timeout
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!text) throw new Error("Gemini returned empty response");
  return text.trim();
}

// ─── Paywall Post-Processing ──────────────────────────────────
// For free users: truncate LLM output at the paywall boundary
// The LLM is instructed to put 🔒 in the right place
function applyPaywallToLLMResponse(
  llmText: string,
  result: KnowledgeResult,
  isPaid: boolean,
  lang: "en" | "bn"
): string {
  if (isPaid) return llmText;

  // If LLM already included paywall block (as instructed), keep it
  if (llmText.includes("🔒")) return llmText;

  // Otherwise, add paywall block after first 2 paragraphs
  const paragraphs = llmText.split(/\n\n+/);
  const freeSection = paragraphs.slice(0, 2).join("\n\n");
  const area = result.area ?? "general";
  const pricing = TIER_PRICING[area] ?? { price: 999, label: "Full Legal Guide" };

  const paywallAppend = lang === "bn"
    ? `\n\n🔒 **পূর্ণ উত্তর আনলক করুন — ৳${pricing.price.toLocaleString()}**\n_${pricing.label}_\n\n✅ আনলক করলে পাবেন: পদক্ষেপ-বাই-পদক্ষেপ করণীয়, ডকুমেন্ট চেকলিস্ট, বিস্তারিত আইনি কৌশল\n\n📱 WhatsApp: **01XXXXXXXXX**`
    : `\n\n🔒 **Unlock full answer — ৳${pricing.price.toLocaleString()}**\n_${pricing.label}_\n\n✅ Get: step-by-step action plan, document checklist, full legal strategy\n\n📱 WhatsApp: **01XXXXXXXXX**`;

  return freeSection + paywallAppend;
}

// ─── Static Fallback Responses ────────────────────────────────
const AREA_FALLBACK: Record<string, string> = {
  property:       "**Land & Property Law — Bangladesh**\n\nPlease describe your land or property situation — what happened, which documents you have, and what outcome you need. I'll analyse the applicable laws for you.",
  criminal:       "**Criminal Law — Bangladesh**\n\nPlease describe the criminal matter — are you a victim or accused, what happened, and at what stage is the case? I'll guide you on your rights and options.",
  family:         "**Family Law — Bangladesh**\n\nPlease describe your family law situation — divorce, custody, maintenance, or another matter. I'll walk you through your rights under Bangladesh law.",
  labour:         "**Labour Law — Bangladesh**\n\nDescribe your employment situation — termination, unpaid wages, gratuity, or another issue. I'll explain your rights under the Labour Act 2006.",
  company:        "**Company Law — Bangladesh**\n\nDescribe your company matter — registration, compliance, dispute, or another issue. I'll explain the legal position under Bangladesh Companies Act 1994.",
  tax:            "**Tax Law — Bangladesh**\n\nDescribe your tax situation — income tax, VAT, TIN, or filing issue. I'll explain the position under Income Tax Act 2023.",
  nrb:            "**NRB Investment — Bangladesh**\n\nDescribe your cross-border investment situation. I'll explain WHT, BIDA registration, repatriation rules, and tax treaty position.",
  constitutional: "**Constitutional Law — Bangladesh**\n\nDescribe your constitutional rights issue — detention, rights violation, writ petition, or amendment question. I'll analyse under the 1972 Constitution.",
  consumer:       "**Consumer Rights — Bangladesh**\n\nDescribe your consumer complaint — defective product, unfair practice, or refund issue. I'll guide you under the Consumer Rights Protection Act 2009.",
  cyber:          "**Cyber Law — Bangladesh**\n\nDescribe your cyber law issue — hacking, online fraud, defamation, or digital crime. I'll explain under the Cyber Security Act 2023.",
  general:        "Please describe your legal situation in detail — what happened, who is involved, and what outcome you need. I'll identify the applicable Bangladesh law and guide you.",
};

const FALLBACK_TEXT: Record<string, string> = {
  en: "Please describe your legal situation:\n1. What happened\n2. Who is involved\n3. What you want\n\n**JesAI covers:** Land & Property • Criminal • Family • Labour • Company • Tax • NRB • Constitutional • Consumer • Cyber\n\n⚠️ Legal information only — not legal advice.",
  bn: "অনুগ্রহ করে আপনার আইনি পরিস্থিতি বর্ণনা করুন:\n১. কী হয়েছে\n২. কারা জড়িত\n৩. আপনি কী চান\n\n⚠️ শুধুমাত্র আইনি তথ্য — পরামর্শ নয়।",
};

// ─── Scenario Sessions ────────────────────────────────────────
const scenarioSessions = new Map<string, ScenarioSession>();

function getSessionId(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 40);
  return `${ip}::${ua}`;
}

// ─── Main Handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      isPaid        = false,
      selectedArea  = null,
      history       = [],   // [{role:"user"|"assistant", content:"..."}]
    } = body as {
      message: string;
      isPaid?: boolean;
      selectedArea?: LawArea | null;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const lang = detectLanguage(message);
    const sessionId = getSessionId(req);
    const activeSession = scenarioSessions.get(sessionId);

    // ── Step 0: Scenario navigation ("next" / "back") ───────────
    if (activeSession) {
      if (isNextStepCommand(message)) {
        const r = nextStep(activeSession.scenarioId, activeSession.currentStepIndex);
        if (r.matched) {
          r.isComplete
            ? scenarioSessions.delete(sessionId)
            : scenarioSessions.set(sessionId, { scenarioId: r.scenario.scenarioId, currentStepIndex: r.stepNumber - 1 });
          return NextResponse.json({
            response: r.summary,
            source: "scenario",
            metadata: { area: r.scenario.area, confidence: "high", escalate: r.scenario.escalate, language: lang, paywallActive: false, scenario: { scenarioId: r.scenario.scenarioId, stepNumber: r.stepNumber, totalSteps: r.totalSteps, progressPercent: r.progressPercent, isComplete: r.isComplete } },
          });
        }
      }
      if (isPrevStepCommand(message)) {
        const ti = Math.max(0, activeSession.currentStepIndex - 1);
        const r = nextStep(activeSession.scenarioId, Math.max(0, ti - 1));
        if (r.matched) {
          scenarioSessions.set(sessionId, { scenarioId: r.scenario.scenarioId, currentStepIndex: r.stepNumber - 1 });
          return NextResponse.json({
            response: r.summary,
            source: "scenario",
            metadata: { area: r.scenario.area, confidence: "high", escalate: r.scenario.escalate, language: lang, paywallActive: false, scenario: { scenarioId: r.scenario.scenarioId, stepNumber: r.stepNumber, totalSteps: r.totalSteps, progressPercent: r.progressPercent, isComplete: r.isComplete } },
          });
        }
      }
    }

    // ── Step 1: Subject lock — reject off-topic messages ────────
    if (selectedArea) {
      const detected = detectArea(message);
      const offTopic =
        detected !== null &&
        detected !== selectedArea &&
        detected !== "general" &&
        detected !== "administrative" &&
        detected !== "evidence";
      if (offTopic) {
        return NextResponse.json({
          response: outOfScopeResponse(selectedArea, detected, lang),
          source: "guard",
          metadata: { area: selectedArea, confidence: "low", escalate: false, language: lang, paywallActive: false, offTopic: true },
        });
      }
    }

    // ── Step 2: RAG — pull relevant law context ─────────────────
    const result = queryKnowledge(message, selectedArea);

    // ── Step 3: LLM path ─────────────────────────────────────────
    if (LLM_ENABLED) {
      try {
        const systemPrompt = buildSystemPrompt(result, selectedArea, isPaid, lang);

        // Convert history format for Gemini
        const geminiHistory = history.map((h) => ({
          role: h.role === "assistant" ? "model" as const : "user" as const,
          text: h.content,
        }));

        const llmResponse = await callGemini(systemPrompt, message, geminiHistory);
        const finalResponse = applyPaywallToLLMResponse(llmResponse, result, isPaid, lang);

        return NextResponse.json({
          response: finalResponse,
          source: "llm",
          metadata: {
            area: result.area ?? selectedArea,
            confidence: result.matched ? "high" : "medium",
            escalate: result.escalate,
            language: lang,
            paywallActive: !isPaid,
            model: GEMINI_MODEL,
          },
        });
      } catch (llmError) {
        // LLM failed — log and fall through to static fallback
        console.error("Gemini error — falling back to static:", llmError);
      }
    }

    // ── Step 4: Static fallback (if LLM off or failed) ──────────

    // 4a: Scenario match
    const scenarioResult = matchScenario(message, activeSession);
    if (scenarioResult.matched) {
      const wrongSubject = selectedArea && scenarioResult.scenario.area !== selectedArea;
      if (!wrongSubject) {
        scenarioSessions.set(sessionId, { scenarioId: scenarioResult.scenario.scenarioId, currentStepIndex: scenarioResult.stepNumber - 1 });
        return NextResponse.json({
          response: scenarioResult.summary,
          source: "scenario",
          metadata: { area: scenarioResult.scenario.area, confidence: "high", escalate: scenarioResult.scenario.escalate, language: lang, paywallActive: false, scenario: { scenarioId: scenarioResult.scenario.scenarioId, stepNumber: scenarioResult.stepNumber, totalSteps: scenarioResult.totalSteps, progressPercent: scenarioResult.progressPercent, isComplete: scenarioResult.isComplete } },
        });
      }
    }

    // 4b: Knowledge store formatted response
    if (result.matched && result.qaEntry) {
      const formatted = formatResponse(result, isPaid);
      let responseText = formatted.response;
      if (formatted.paywallActive && formatted.paywallTeaser) {
        const price   = formatted.price   ?? (TIER_PRICING[selectedArea ?? result.area ?? "general"]?.price ?? 99);
        const label   = formatted.priceLabel ?? "Full Legal Guide";
        const paywall = lang === "bn"
          ? `\n\n${formatted.paywallTeaser}\n\n🔒 **পূর্ণ উত্তর আনলক করুন — ৳${price.toLocaleString()}**\n_${label}_\n\n📱 WhatsApp: **01XXXXXXXXX**`
          : `\n\n${formatted.paywallTeaser}\n\n🔒 **Unlock full answer — ৳${price.toLocaleString()}**\n_${label}_\n\n📱 WhatsApp: **01XXXXXXXXX**`;
        responseText += paywall;
      }
      return NextResponse.json({
        response: responseText,
        source: "knowledge",
        metadata: { area: result.area, confidence: result.confidence, escalate: result.escalate, language: lang, paywallActive: formatted.paywallActive },
      });
    }

    // 4c: Area-level general prompt (invite user to give more detail)
    const areaForPrompt = selectedArea ?? result.area;
    if (areaForPrompt && AREA_FALLBACK[areaForPrompt]) {
      return NextResponse.json({
        response: AREA_FALLBACK[areaForPrompt],
        source: "area_prompt",
        metadata: { area: areaForPrompt, confidence: "low", escalate: false, language: lang, paywallActive: false },
      });
    }

    // 4d: Hard fallback
    return NextResponse.json({
      response: FALLBACK_TEXT[lang] ?? FALLBACK_TEXT.en,
      source: "fallback",
      metadata: { area: null, confidence: "low", escalate: false, language: lang, paywallActive: false },
    });

  } catch (error) {
    console.error("JesAI error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
