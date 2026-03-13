import { QAEntry } from "./types";

// This is where you will paste the 120 scenarios from your JSON
const SCENARIOS: QAEntry[] = [
  {
    id: 1,
    scenario: "A intentionally shoots B with a gun causing death.",
    question: "Which offence is committed?",
    options: ["A. Hurt", "B. Culpable homicide", "C. Murder", "D. Accident"],
    answer: "C",
    law: "Penal Code 1860",
    section: "302",
    category: "Human body",
    irac: {
      issue: "Whether intentional shooting leading to death constitutes murder.",
      rule: "Section 302 of the Penal Code 1860 prescribes death or life imprisonment for murder.",
      application: "The use of a firearm indicates clear intent to cause death.",
      conclusion: "The act is classified as murder under Section 302."
    },
    triggerKeywords: ["shoot", "gun", "murder", "death", "হত্যা", "খুন"]
  },
  // Add your 120 JSON scenarios here...
];

export function findScenarioMatch(message: string): QAEntry | null {
  const msg = message.toLowerCase();
  let bestMatch: QAEntry | null = null;
  let maxScore = 0;

  for (const s of SCENARIOS) {
    const score = s.triggerKeywords?.filter(kw => msg.includes(kw.toLowerCase())).length || 0;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = s;
    }
  }
  return maxScore >= 2 ? bestMatch : null; // Requires at least 2 keyword matches for accuracy
}