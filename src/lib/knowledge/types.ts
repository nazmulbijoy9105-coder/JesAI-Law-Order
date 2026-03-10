// ─── JesAI Knowledge Store — Core Types ──────────────────────
// All knowledge entries follow this structure.
// NLC validates every entry before it goes live.

export type Jurisdiction = "BD" | "US" | "BD+US/UK/Australia/China/India/Germany/";
export type Certainty = "confirmed" | "arguable" | "verify-with-lawyer";
export type LawArea =
  | "constitutional"
  | "criminal"
  | "property"
  | "family"
  | "contract"
  | "labour"
  | "company"
  | "tax"
  | "NRB?Cross-Border"
  | "administrative"
  | "evidence"
  | "general";

// ── A single legal rule in the knowledge store ────────────────
export interface LegalRule {
  id: string;                    // unique — e.g. "tax-wht-nrb-001"
  area: LawArea;
  jurisdiction: Jurisdiction;
  title: string;                 // short label
  rule: string;                  // the actual legal rule text
  source: string;                // Act name, section, NBR circular etc.
  certainty: Certainty;
  tags: string[];                // keywords for matching
  lastVerified: string;          // date string — NLC review date
  nlcNote?: string;              // optional NLC practitioner note
}

// ── A Q&A entry — maps a user question pattern to IRAC answer ─
export interface QAEntry {
  id: string;
  area: LawArea;
  jurisdiction: Jurisdiction;
  triggerKeywords: string[];     // words that trigger this entry
  question: string;              // canonical question this answers
  irac: {
    issue: string;               // I — what is the legal question
    rule: string;                // R — what law applies
    application: string;         // A — how it applies to typical facts
    conclusion: string;          // C — what the user should know/do
  };
  escalate: boolean;             // true = always refer to NLC lawyer
  escalateReason?: string;       // why escalation is needed
  relatedRules: string[];        // rule IDs from LegalRule store
  lastVerified: string;
}

// ── Subject area module shape ─────────────────────────────────
export interface KnowledgeModule {
  area: LawArea;
  label: string;
  description: string;
  rules: LegalRule[];
  qaBank: QAEntry[];
}

// ── Query result returned to ChatInterface ────────────────────
export interface KnowledgeResult {
  matched: boolean;
  area: LawArea | null;
  qaEntry: QAEntry | null;
  rules: LegalRule[];
  escalate: boolean;
  escalateReason?: string;
  confidence: "high" | "medium" | "low";
}
