// ─── JesAI API Route — Direct Knowledge Store Response ───────
// No external API needed. Answers come directly from NLC knowledge store.
// Zero cost. Fully controlled by NLC.

import { NextRequest, NextResponse } from "next/server";
import { queryKnowledge, formatIRACResponse, detectArea } from "@/lib/knowledge";

// ── Fallback responses when no knowledge match ────────────────
const FALLBACK = {
  en: (area: string | null) => `Thank you for your question${area ? ` about ${area}` : ""}.

To give you accurate legal information under Bangladesh law, I need a few more details:

**Please tell me:**
1. What specifically happened — the core facts
2. Who is involved (you, a company, government authority?)
3. When did this occur?
4. What outcome are you hoping for?

The more details you share, the better I can map the relevant laws and guide you through your options.

⚠️ **Remember:** JesAI provides legal literacy and information only — not legal advice. For legal representation, consult a certified Bangladesh Bar Council advocate.`,

  bn: (area: string | null) => `আপনার প্রশ্নের জন্য ধন্যবাদ${area ? ` (${area})` : ""}।

সঠিক আইনি তথ্য দিতে আমার আরও কিছু বিস্তারিত দরকার:

**অনুগ্রহ করে জানান:**
১. ঠিক কী হয়েছে — মূল ঘটনা
২. কারা জড়িত?
৩. কখন হয়েছে?
৪. আপনি কী ফলাফল চান?

⚠️ **মনে রাখুন:** JesAI শুধুমাত্র আইনি তথ্য প্রদান করে — আইনি পরামর্শ নয়।`,
};

// ── General Bangladesh law responses by area ──────────────────
const GENERAL_RESPONSES: Record<string, Record<string, string>> = {
  en: {
    property: `**Land & Property Law — Bangladesh**

**Applicable Laws:**
• Transfer of Property Act 1882 — governs sale, mortgage, lease, gift
• Registration Act 1908 — mandatory registration of property documents
• State Acquisition and Tenancy Act 1950 — land ownership rights
• Land Survey Tribunal Act 2023 — land dispute resolution
• Limitation Act 1908 — time limits for property claims

**Key Steps:**
1. Collect all documents — deed, mutation record (khatian), CS/RS/BS maps
2. Verify land records at AC Land office or land.gov.bd
3. For disputes — file case at Civil Court
4. For mutation — apply at Union Land Office
5. For registration issues — approach Sub-Registrar office

**Important:** Property disputes have limitation periods. Act promptly to preserve your legal rights.

⚠️ For representation, consult a certified Bangladesh Bar Council advocate.`,

    criminal: `**Criminal Law — Bangladesh**

**Applicable Laws:**
• Penal Code 1860 — defines offenses and punishments
• Code of Criminal Procedure 1898 (CrPC) — criminal trial process
• Evidence Act 1872 — what proof is admissible in court
• Digital Security Act 2018 — cyber and digital offenses

**Key Steps:**
**If you are a victim:**
1. File FIR (First Information Report) at nearest Police Station
2. Police investigates → files charge sheet if evidence found
3. Case goes to Magistrate Court → Sessions Court for serious offenses

**If you are accused:**
1. For bailable offenses — apply for bail at Magistrate Court
2. For non-bailable offenses — apply to Sessions Judge
3. If falsely accused — apply for anticipatory bail

⚠️ Engage a certified advocate immediately for any criminal matter.`,

    family: `**Family Law — Bangladesh**

**Applicable Laws:**
• Muslim Family Laws Ordinance 1961 — marriage, divorce, polygamy
• Family Courts Ordinance 1985 — family dispute resolution
• Guardians and Wards Act 1890 — child custody
• Dowry Prohibition Act 1980 — dower/dowry rights

**Key Procedures:**
**Divorce (Muslim — Talaq by husband):**
1. Husband gives talaq notice to Union Parishad Chairman
2. 90-day reconciliation period begins
3. After 90 days without reconciliation — divorce is effective

**Wife-initiated divorce (Khul):**
File petition in Family Court

**Maintenance & Custody:**
File suit in Family Court. Child's welfare is the primary consideration.

**Documents needed:** Nikah Nama, NID, birth certificates

⚠️ Family matters are sensitive. Consult a Bangladesh Bar Council advocate.`,

    labour: `**Labour Law — Bangladesh**

**Applicable Laws:**
• Bangladesh Labour Act 2006 (amended 2013, 2018) — core employment law
• Bangladesh Labour Rules 2015
• Workmen's Compensation Act 1923 — workplace injury

**Key Rights:**
• Minimum notice period: 30 days (or payment in lieu)
• Gratuity: 30 days per year of service (after 1 year)
• Provident fund entitlement depends on company policy
• Wrongful termination: right to compensation

**Procedures:**
1. For wrongful termination — file complaint with Labour Court within 30 days
2. For unpaid wages — complain to Department of Inspection for Factories
3. For gratuity/PF — file claim with employer first, then Labour Court

⚠️ Keep all employment documents — appointment letter, salary slips, termination letter.`,

    contract: `**Contract Law — Bangladesh**

**Applicable Laws:**
• Contract Act 1872 — formation, performance, breach, remedies
• Specific Relief Act 1877 — specific performance and injunctions
• Limitation Act 1908 — 3 years for contract suits (generally)
• Arbitration Act 2001 — if arbitration clause exists

**If a contract is breached:**
1. Send formal legal notice to breaching party
2. Attempt negotiation or mediation first
3. If arbitration clause exists — initiate arbitration
4. File civil suit in Civil Court if no resolution

**Important:** The 3-year limitation period begins from the date of breach. Do not delay.

⚠️ Always keep signed copies of all contracts and correspondence.`,

    tax: `**Tax Law — Bangladesh**

**Applicable Laws:**
• Income Tax Act 2023 — income tax for individuals and companies
• Value Added Tax and Supplementary Duty Act 2012 — VAT
• NBR SROs and Notifications — regulatory updates

**Key Obligations:**
• Individual tax return deadline: 30 November each year
• TIN registration: mandatory for anyone earning above exemption threshold
• VAT registration: required if annual turnover exceeds BDT 30 lakh
• Company tax return: 15 July each year

**For tax disputes:**
1. File objection with Deputy Commissioner of Taxes (DCT)
2. Appeal to Commissioner of Taxes (Appeals)
3. Further appeal to Taxes Appellate Tribunal

⚠️ NLC can assist with TIN registration, tax returns, and NBR compliance.`,

    company: `**Company & Commercial Law — Bangladesh**

**Applicable Laws:**
• Companies Act 1994 — company formation, governance, winding up
• Partnership Act 1932 — partnerships
• RJSC Rules — registration procedures

**Private Limited Company Registration:**
1. Name clearance from RJSC
2. Prepare MOA and AOA
3. File Form I, VI, XII with RJSC
4. Pay registration fees
5. Receive Certificate of Incorporation

**Annual Compliance:**
• Annual General Meeting within 120 days of financial year end
• Annual return filing with RJSC
• Audited financial statements
• Tax return filing

**Time:** 15-20 working days
**Cost:** BDT 10,000-30,000 (approximately)

⚠️ NLC handles full RJSC compliance for Private Limited and Foreign Companies.`,

    constitutional: `**Constitutional Law — Bangladesh**

**The Constitution of Bangladesh 1972** guarantees fundamental rights to all citizens:

**Part III — Fundamental Rights:**
• Article 27 — Equality before law
• Article 31 — Right to protection of law
• Article 32 — Right to life and personal liberty
• Article 33 — Safeguards on arrest and detention
• Article 35 — Protection from double jeopardy and self-incrimination
• Article 39 — Freedom of thought, conscience and speech
• Article 41 — Freedom of religion
• Article 44 — Right to enforce fundamental rights

**If your fundamental rights are violated:**
File a Writ Petition in the High Court Division of the Supreme Court under Article 102.

**Types of writs available:**
Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto

⚠️ Constitutional matters require specialist advocates. Consult immediately.`,
  },

  bn: {
    property: `**ভূমি ও সম্পত্তি আইন — বাংলাদেশ**

**প্রযোজ্য আইন:**
• সম্পত্তি হস্তান্তর আইন ১৮৮২
• নিবন্ধন আইন ১৯০৮
• রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০
• ভূমি জরিপ ট্রাইব্যুনাল আইন ২০২৩

**মূল পদক্ষেপ:**
১. সব দলিল সংগ্রহ করুন — দলিল, খতিয়ান, CS/RS/BS মানচিত্র
২. AC Land অফিস বা land.gov.bd তে রেকর্ড যাচাই করুন
৩. বিরোধের জন্য দেওয়ানি আদালতে মামলা করুন
৪. নামজারির জন্য ইউনিয়ন ভূমি অফিসে আবেদন করুন

⚠️ আইনি প্রতিনিধিত্বের জন্য বার কাউন্সিল অ্যাডভোকেট নিন।`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message, language = "en" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // ── Step 1: Query NLC Knowledge Store ────────────────────
    const result = queryKnowledge(message);

    // ── Step 2: If matched in knowledge store — return it ────
    if (result.matched && result.qaEntry) {
      const { irac, escalate, escalateReason } = result.qaEntry;

      let response = `${irac.issue}\n\n`;
      response += `**What the law says**\n${irac.rule}\n\n`;
      response += `**How this applies to you**\n${irac.application}\n\n`;
      response += `**What you should do**\n${irac.conclusion}`;

      if (escalate && escalateReason) {
        response += `\n\n⚠️ **Professional Consultation Required**\n${escalateReason}`;
      }

      if (result.rules.length > 0) {
        response += `\n\n**Applicable Laws**\n`;
        result.rules.slice(0, 3).forEach(r => {
          response += `• ${r.title} — ${r.source}\n`;
        });
      }

      return NextResponse.json({
        response,
        metadata: {
          area: result.area,
          confidence: result.confidence,
          escalate: result.escalate,
          escalateReason: result.escalateReason,
          knowledgeMatched: true,
        },
      });
    }

    // ── Step 3: General area response ────────────────────────
    const area = result.area;
    const lang = language as "en" | "bn";

    if (area && GENERAL_RESPONSES[lang]?.[area]) {
      return NextResponse.json({
        response: GENERAL_RESPONSES[lang][area],
        metadata: { area, confidence: "medium", escalate: false, knowledgeMatched: false },
      });
    }

    // Try English fallback for Bengali area match
    if (area && GENERAL_RESPONSES["en"]?.[area]) {
      return NextResponse.json({
        response: GENERAL_RESPONSES["en"][area],
        metadata: { area, confidence: "medium", escalate: false, knowledgeMatched: false },
      });
    }

    // ── Step 4: Clarification fallback ───────────────────────
    return NextResponse.json({
      response: FALLBACK[lang](area),
      metadata: { area, confidence: "low", escalate: false, knowledgeMatched: false },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
