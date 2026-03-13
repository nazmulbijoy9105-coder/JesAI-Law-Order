import { LawArea, QAEntry, KnowledgeResult, KnowledgeModule } from "./types";
import nrbModule from "./nrb";
import propertyModule from "./property";
import criminalModule from "./criminal";
import taxModule from "./tax";
import companyModule from "./company";

const MODULES: KnowledgeModule[] = [
  nrbModule,
  propertyModule,
  criminalModule,
  taxModule,
  companyModule,
];

/**
 * Detects the legal area from the user's message
 */
export function detectArea(message: string): LawArea | null {
  const msg = message.toLowerCase();
  
  const areaKeywords: Record<LawArea, string[]> = {
    nrb: ["nrb", "non-resident", "usa partner", "foreign partner", "repatriate", "bida", "overseas"],
    tax: ["tax", "vat", "nbr", "income tax", "return", "assessment", "challan"],
    company: ["company", "rjsc", "incorporation", "pvt ltd", "director", "shareholder"],
    criminal: ["arrest", "fir", "police", "crime", "bail", "accused", "jail", "খুন", "হত্যা"],
    property: ["land", "property", "deed", "mutation", "khatian", "plot", "দলিল", "খতিয়ান"],
    family: ["divorce", "marriage", "talaq", "custody", "maintenance"],
    labour: ["job", "employment", "salary", "termination", "worker"],
    contract: ["contract", "agreement", "breach", "payment"],
    constitutional: ["constitution", "rights", "writ", "high court"],
    administrative: ["government", "licence", "permit"],
    evidence: ["evidence", "proof", "witness"],
    general: [],
  };

  for (const [area, keywords] of Object.entries(areaKeywords)) {
    if (keywords.some((kw) => msg.includes(kw))) {
      return area as LawArea;
    }
  }
  return null;
}

/**
 * Weighted Keyword Matcher
 */
function matchQA(message: string, area: LawArea | null): QAEntry | null {
  const msg = message.toLowerCase();
  const msgWords = msg.split(/\s+/);
  let bestMatch: QAEntry | null = null;
  let bestScore = 0;

  for (const module of MODULES) {
    // Search specific area first if detected, otherwise search all
    const entries = area 
      ? module.qaBank.filter(e => e.area === area || e.area === "general")
      : module.qaBank;

    for (const entry of entries) {
      let score = 0;
      for (const kw of entry.triggerKeywords) {
        const kwLower = kw.toLowerCase();
        if (msg.includes(kwLower)) {
          score += 3; // Direct phrase match
        } else {
          const kwWords = kwLower.split(/\s+/);
          const wordMatches = kwWords.filter(w => msgWords.includes(w)).length;
          score += (wordMatches === kwWords.length) ? 2 : wordMatches;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

export function queryKnowledge(message: string): KnowledgeResult {
  const area = detectArea(message);
  const qaEntry = matchQA(message, area);

  const rules = area
    ? MODULES.flatMap((m) =>
        m.rules.filter(
          (r) => r.area === area || r.tags.some((t) => message.toLowerCase().includes(t))
        )
      ).slice(0, 5)
    : [];

  let confidence: "high" | "medium" | "low" = "low";
  if (qaEntry && area) confidence = "high";
  else if (qaEntry || area) confidence = "medium";

  return {
    matched: !!qaEntry,
    area,
    qaEntry,
    rules,
    escalate: qaEntry?.escalate ?? false,
    escalateReason: qaEntry?.escalateReason,
    confidence,
  };
}

export function formatIRACResponse(result: KnowledgeResult): string {
  if (!result.qaEntry) return "";
  const { irac, escalate, escalateReason } = result.qaEntry;
  const isBangla = /[\u0980-\u09FF]/.test(irac.issue);

  let response = `### ${isBangla ? "আইনী বিশ্লেষণ" : "Legal Analysis"}\n`;
  response += `**${isBangla ? "ঘটনা:" : "Situation:"}** ${irac.issue}\n\n`;
  response += `**${isBangla ? "আইন যা বলে:" : "What the Law Says:"}**\n${irac.rule}\n\n`;
  response += `**${isBangla ? "প্রয়োগ:" : "How it Applies:"}** ${irac.application}\n\n`;
  response += `**${isBangla ? "করণীয়:" : "Guidance:"}** ${irac.conclusion}`;

  if (escalate && escalateReason) {
    response += `\n\n⚠️ **${isBangla ? "পেশাদার সহায়তা প্রয়োজন" : "Professional Help Required"}**\n${escalateReason}`;
  }

  return response;
}