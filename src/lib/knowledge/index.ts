// ─── JesAI Knowledge Engine — NLC Validated ──────────────────
import type { LawArea, QAEntry, KnowledgeResult } from "./types";
import nrbModule from "./nrb";
import propertyModule from "./property";
import criminalModule from "./criminal";
import taxModule from "./tax";
import companyModule from "./company";
import constitutionalModule from "./constitutional";
// Future modules — uncomment as built:
// import familyModule from "./family";
// import labourModule from "./labour";
// import consumerModule from "./consumer";
// import cyberModule from "./cyber";

const MODULES = [
  nrbModule,
  propertyModule,
  criminalModule,
  taxModule,
  companyModule,
  constitutionalModule,
];

// ─── Area Detection ───────────────────────────────────────────
export function detectArea(message: string): LawArea | null {
  const msg = message.toLowerCase();

  const areaKeywords: Record<LawArea, string[]> = {
    nrb: ["nrb", "non-resident", "nonresident", "usa partner", "foreign partner",
          "repatriate", "bida", "wht", "withholding", "dtaa", "fbar",
          "overseas", "abroad", "dollar", "usd", "nrb business", "foreign investment",
          "প্রবাসী", "রেমিট্যান্স", "বিদা", "দ্বৈত কর"],
    tax: ["tax", "vat", "nbr", "income tax", "return", "assessment", "challan", "tax return",
          "কর", "ভ্যাট", "আয়কর", "টিআইএন", "রিটার্ন"],
    company: ["company", "rjsc", "incorporation", "pvt ltd", "limited company",
              "director", "shareholder", "memorandum", "articles", "corporate",
              "কোম্পানি", "আরজেএসসি", "অংশীদারিত্ব", "ব্যবসা নিবন্ধন"],
    criminal: ["arrest", "fir", "police", "crime", "bail", "accused",
               "case filed", "charge", "sentence", "jail", "victim",
               "গ্রেফতার", "এফআইআর", "পুলিশ", "অপরাধ", "জামিন", "আসামি"],
    property: ["land", "property", "deed", "mutation", "khatian", "plot",
               "lease", "mortgage", "tenancy", "eviction", "registration",
               "sub-registrar", "ac land", "namajaari", "title", "boundary",
               "encroach", "inheritance", "heir", "partition", "flat", "apartment",
               "cheque bounce", "cheque", "baynama", "rajuk", "rehab", "builder",
               "loan default", "foreclosure", "artha rin", "khas", "char",
               "erosion", "shafi", "preemption", "forged deed", "adverse possession",
               "survey", "rs cs bs", "probate", "will", "succession",
               "জমি", "সম্পত্তি", "দলিল", "নামজারি", "খতিয়ান", "বন্ধক"],
    family: ["divorce", "marriage", "talaq", "custody", "maintenance",
             "dower", "mehr", "separation", "spouse", "child support", "family court",
             "বিবাহবিচ্ছেদ", "বিয়ে", "তালাক", "হেফাজত", "ভরণপোষণ", "দেনমোহর"],
    labour: ["job", "employment", "salary", "fired", "termination", "labour",
             "worker", "employee", "overtime", "gratuity", "provident fund", "resignation",
             "চাকরি", "বেতন", "বরখাস্ত", "শ্রমিক", "গ্র্যাচুইটি", "পদত্যাগ"],
    contract: ["contract", "agreement", "breach", "payment", "refund",
               "supplier", "buyer", "deal", "sign", "obligation", "default"],
    constitutional: ["constitution", "rights", "fundamental", "writ",
                     "high court", "supreme court", "article", "freedom", "liberty",
                     "habeas corpus", "mandamus", "amendment",
                     "সংবিধান", "রিট", "মৌলিক অধিকার", "হাইকোর্ট"],
    administrative: ["government", "authority", "licence", "permit",
                     "ministry", "department", "public servant", "official"],
    evidence: ["evidence", "proof", "witness", "document", "admissible", "statement"],
    general: [],
  };

  for (const [area, keywords] of Object.entries(areaKeywords)) {
    if (keywords.some((kw) => msg.includes(kw))) {
      return area as LawArea;
    }
  }

  return null;
}

// ─── Q&A Matching ─────────────────────────────────────────────
function matchQA(message: string, area: LawArea | null): QAEntry | null {
  const msg = message.toLowerCase();
  const msgWords = msg.split(/\s+/);
  let bestMatch: QAEntry | null = null;
  let bestScore = 0;

  for (const module of MODULES) {
    const entries = area
      ? module.qaBank.filter((e) => e.area === area || e.area === "general")
      : module.qaBank;

    for (const entry of entries) {
      let score = 0;
      for (const kw of entry.triggerKeywords) {
        const kwLower = kw.toLowerCase();
        if (msg.includes(kwLower)) {
          score += 3; // exact phrase match
        } else {
          const kwWords = kwLower.split(/\s+/);
          const wordMatches = kwWords.filter((w: string) => msgWords.includes(w)).length;
          if (wordMatches === kwWords.length) score += 2;
          else score += wordMatches;
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

// ─── Main Query Function ──────────────────────────────────────
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

// ─── Area List ────────────────────────────────────────────────
export function getActiveAreas(): { area: LawArea; label: string; description: string }[] {
  return MODULES.map((m) => ({
    area: m.area,
    label: m.label,
    description: m.description,
  }));
}

// ─── Paywall Tier Pricing ─────────────────────────────────────
export const TIER_PRICING: Record<string, { label: string; price: number }> = {
  property:       { label: "Property Law Full Guide",       price: 999  },
  criminal:       { label: "Criminal Law Full Guide",       price: 999  },
  company:        { label: "Company Law Full Guide",        price: 1999 },
  tax:            { label: "Tax Law Full Guide",            price: 999  },
  nrb:            { label: "NRB Investment Guide",          price: 1999 },
  constitutional: { label: "Constitutional Rights Guide",   price: 999  },
  family:         { label: "Family Law Full Guide",         price: 999  },
  labour:         { label: "Labour Law Full Guide",         price: 999  },
  consumer:       { label: "Consumer Rights Guide",         price: 99   },
  cyber:          { label: "Cyber Law Full Guide",          price: 999  },
  contract:       { label: "Contract Law Full Guide",       price: 999  },
  general:        { label: "Legal Guide",                   price: 99   },
};

// ─── Response Formatter — FREE TIER ──────────────────────────
// Free shows:  situation summary + full "what the law says"
// Free hides:  "how it applies" (teaser only) + "what to do" + documents
// Exception:   escalate/urgent alerts always shown free (safety)
export function formatFreeResponse(result: KnowledgeResult): {
  visibleContent: string;
  paywallActive: true;
  paywallTeaser: string;
  price: number;
  priceLabel: string;
} {
  const area = result.area ?? "general";
  const pricing = TIER_PRICING[area] ?? TIER_PRICING.general;

  if (!result.qaEntry) {
    return {
      visibleContent: "",
      paywallActive: true,
      paywallTeaser: "",
      price: pricing.price,
      priceLabel: pricing.label,
    };
  }

  const { irac, escalate, escalateReason } = result.qaEntry;

  // Free: full issue + full rule
  let visible = `${irac.issue}\n\n`;
  visible += `**What the law says**\n${irac.rule}`;

  // Urgent escalation always free — safety cannot be gated
  if (escalate && escalateReason) {
    visible += `\n\n⚠️ **Urgent — Professional Help Needed**\n${escalateReason}`;
  }

  // Teaser: first 120 chars of application
  const teaser = irac.application.slice(0, 120).trimEnd() + "…";
  const paywallTeaser = `**How this applies to your situation**\n${teaser}`;

  return {
    visibleContent: visible,
    paywallActive: true,
    paywallTeaser,
    price: pricing.price,
    priceLabel: pricing.label,
  };
}

// ─── Response Formatter — PAID TIER ──────────────────────────
// Paid shows: everything — application, conclusion, documents, laws
export function formatPaidResponse(result: KnowledgeResult): {
  visibleContent: string;
  paywallActive: false;
} {
  if (!result.qaEntry) return { visibleContent: "", paywallActive: false };

  const { irac, escalate, escalateReason } = result.qaEntry;

  let response = `${irac.issue}\n\n`;
  response += `**What the law says**\n${irac.rule}\n\n`;
  response += `**How this applies to your situation**\n${irac.application}\n\n`;
  response += `**What you should do**\n${irac.conclusion}`;

  if (escalate && escalateReason) {
    response += `\n\n⚠️ **Professional Help Required**\n${escalateReason}`;
  }

  if (result.rules.length > 0) {
    response += `\n\n**Applicable Laws**\n`;
    result.rules.slice(0, 3).forEach((r) => {
      response += `• ${r.title} — ${r.source}\n`;
    });
  }

  return { visibleContent: response, paywallActive: false };
}

// ─── Unified Formatter ────────────────────────────────────────
export function formatResponse(
  result: KnowledgeResult,
  isPaid: boolean
): {
  response: string;
  paywallActive: boolean;
  paywallTeaser?: string;
  price?: number;
  priceLabel?: string;
} {
  if (isPaid) {
    const { visibleContent } = formatPaidResponse(result);
    return { response: visibleContent, paywallActive: false };
  }
  const { visibleContent, paywallTeaser, price, priceLabel } = formatFreeResponse(result);
  return { response: visibleContent, paywallActive: true, paywallTeaser, price, priceLabel };
}

// ─── Legacy export (backward compat) ─────────────────────────
export function formatIRACResponse(result: KnowledgeResult): string {
  return formatPaidResponse(result).visibleContent;
}
