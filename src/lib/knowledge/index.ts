// ─── JesAI Knowledge Store — Master Router ───────────────────
// This is the single entry point for all knowledge queries.
// ChatInterface and API route call this — never individual modules.
// NLC validates all modules. Add new modules here as they are built.

import type { KnowledgeResult, LawArea, QAEntry } from "./types";
import nrbModule from "./nrb";
// Future modules — uncomment as each is built and NLC-validated:
// import taxModule from "./tax";
// import companyModule from "./company";
// import criminalModule from "./criminal";
// import propertyModule from "./property";
// import familyModule from "./family";
// import labourModule from "./labour";
// import contractModule from "./contract";
// import constitutionalModule from "./constitutional";

// ── All active modules registered here ───────────────────────
const MODULES = [
  nrbModule,
  // taxModule,
  // companyModule,
  // criminalModule,
  // propertyModule,
  // familyModule,
  // labourModule,
  // contractModule,
  // constitutionalModule,
];

// ── Keyword → Area detector ───────────────────────────────────
// Maps user message keywords to a law area
// This replaces the hardcoded if/else in ChatInterface.tsx
export function detectArea(message: string): LawArea | null {
  const msg = message.toLowerCase();

  const areaKeywords: Record<LawArea, string[]> = {
    nrb: ["nrb", "non-resident", "nonresident", "usa partner", "foreign partner",
          "repatriate", "bida", "wht", "withholding", "tin", "dtaa", "fbar",
          "overseas", "abroad", "dollar", "usd", "send money bangladesh",
          "nrb business", "foreign investment"],
    tax: ["tax", "vat", "nbr", "income tax", "return", "assessment",
          "challan", "tin", "tax return", "tax office"],
    company: ["company", "rjsc", "incorporation", "pvt ltd", "limited company",
              "director", "shareholder", "memorandum", "articles", "annual return",
              "corporate", "business registration"],
    criminal: ["arrest", "fir", "police", "crime", "bail", "accused",
               "case", "charge", "sentence", "jail", "victim", "complaint"],
    property: ["land", "property", "deed", "mutation", "khatian", "plot",
               "lease", "mortgage", "tenancy", "eviction", "registration",
               "sub-registrar", "ac land"],
    family: ["divorce", "marriage", "talaq", "custody", "maintenance",
             "dower", "mehr", "separation", "spouse", "child support",
             "inheritance", "family court"],
    labour: ["job", "employment", "salary", "fired", "termination", "labour",
             "worker", "employee", "overtime", "gratuity", "provident fund",
             "resignation", "dismissal"],
    contract: ["contract", "agreement", "breach", "payment", "refund",
               "supplier", "buyer", "deal", "sign", "obligation", "default"],
    constitutional: ["constitution", "rights", "fundamental", "writ",
                     "high court", "supreme court", "article", "freedom",
                     "liberty", "arbitrary"],
    administrative: ["government", "authority", "licence", "permit",
                     "ministry", "department", "public servant", "official"],
    evidence: ["evidence", "proof", "witness", "document", "admissible",
               "statement", "confession"],
    general: [],
  };

  for (const [area, keywords] of Object.entries(areaKeywords)) {
    if (keywords.some((kw) => msg.includes(kw))) {
      return area as LawArea;
    }
  }

  return null;
}

// ── Q&A matcher — finds best matching entry for a message ─────
function matchQA(message: string, area: LawArea | null): QAEntry | null {
  const msg = message.toLowerCase();
  let bestMatch: QAEntry | null = null;
  let bestScore = 0;

  for (const module of MODULES) {
    // Filter by area if detected
    const entries = area
      ? module.qaBank.filter((e) => e.area === area || e.area === "general")
      : module.qaBank;

    for (const entry of entries) {
      const score = entry.triggerKeywords.filter((kw) =>
        msg.includes(kw.toLowerCase())
      ).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

// ── Main query function — called by API route & ChatInterface ──
export function queryKnowledge(message: string): KnowledgeResult {
  const area = detectArea(message);
  const qaEntry = matchQA(message, area);

  // Find relevant rules for the detected area
  const rules = area
    ? MODULES.flatMap((m) =>
        m.rules.filter(
          (r) => r.area === area || r.tags.some((t) => message.toLowerCase().includes(t))
        )
      ).slice(0, 5) // max 5 rules per response
    : [];

  // Confidence scoring
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

// ── Get all areas with active modules ─────────────────────────
export function getActiveAreas(): { area: LawArea; label: string; description: string }[] {
  return MODULES.map((m) => ({
    area: m.area,
    label: m.label,
    description: m.description,
  }));
}

// ── Format IRAC for chat display ──────────────────────────────
export function formatIRACResponse(result: KnowledgeResult): string {
  if (!result.qaEntry) return "";

  const { irac, escalate, escalateReason } = result.qaEntry;

  let response = `**Issue**\n${irac.issue}\n\n`;
  response += `**Rule**\n${irac.rule}\n\n`;
  response += `**Application**\n${irac.application}\n\n`;
  response += `**Conclusion**\n${irac.conclusion}`;

  if (escalate && escalateReason) {
    response += `\n\n⚠️ **Professional Advice Required**\n${escalateReason}`;
  }

  if (result.rules.length > 0) {
    response += `\n\n📋 **Applicable Laws**\n`;
    result.rules.slice(0, 3).forEach((r) => {
      response += `• ${r.title} — ${r.source}\n`;
    });
  }

  return response;
}
