"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type MessageRole = "user" | "ai" | "system";
type Language = "en" | "bn";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ConversationState {
  stage:
    | "greeting"
    | "gathering_facts"
    | "clarifying"
    | "law_mapping"
    | "consequence"
    | "procedure"
    | "complete";
  lawArea: string | null;
  coreIssue: string | null;
  questionCount: number;
}

// ─── UI Translations ────────────────────────────────────────────────────────
const UI_TEXT = {
  en: {
    active: "JesAI is active",
    freeLeft: (n: number) => `${n} free questions left`,
    quickTopics: "Quick topics:",
    limitTitle: "You've used all 20 free questions",
    limitSub: "Subscribe for unlimited access with human legal assistance",
    subscribeBtn: "Subscribe Now",
    placeholder: "Describe your legal situation in plain language...",
    placeholderLimit: "Subscribe to continue...",
    footer: "JesAI provides legal information only — not legal advice. Press Enter to send, Shift+Enter for new line.",
    listenBtn: "Voice input",
    stopListenBtn: "Stop listening",
    speakBtn: "Read aloud",
    stopSpeakBtn: "Stop reading",
    langToggle: "বাংলা",
  },
  bn: {
    active: "JesAI সক্রিয়",
    freeLeft: (n: number) => `${n}টি বিনামূল্যে প্রশ্ন বাকি`,
    quickTopics: "দ্রুত বিষয়:",
    limitTitle: "আপনি ২০টি বিনামূল্যে প্রশ্ন ব্যবহার করেছেন",
    limitSub: "মানব আইনি সহায়তাসহ সীমাহীন অ্যাক্সেসের জন্য সাবস্ক্রাইব করুন",
    subscribeBtn: "এখনই সাবস্ক্রাইব করুন",
    placeholder: "আপনার আইনি পরিস্থিতি সহজ ভাষায় বর্ণনা করুন...",
    placeholderLimit: "চালিয়ে যেতে সাবস্ক্রাইব করুন...",
    footer: "JesAI শুধুমাত্র আইনি তথ্য প্রদান করে — আইনি পরামর্শ নয়। পাঠাতে Enter চাপুন, নতুন লাইনের জন্য Shift+Enter।",
    listenBtn: "ভয়েস ইনপুট",
    stopListenBtn: "শোনা বন্ধ করুন",
    speakBtn: "জোরে পড়ুন",
    stopSpeakBtn: "পড়া বন্ধ করুন",
    langToggle: "English",
  },
};

const QUICK_TOPICS = {
  en: [
    "Land/property dispute",
    "Divorce or family matter",
    "Police case or FIR",
    "Employment/job issue",
    "Contract breach",
    "Tax or VAT question",
    "Company registration",
    "Constitutional rights",
  ],
  bn: [
    "জমি/সম্পত্তি বিরোধ",
    "বিবাহবিচ্ছেদ বা পারিবারিক বিষয়",
    "পুলিশ মামলা বা এফআইআর",
    "চাকরি/কর্মসংস্থান সমস্যা",
    "চুক্তি লঙ্ঘন",
    "কর বা ভ্যাট প্রশ্ন",
    "কোম্পানি নিবন্ধন",
    "সাংবিধানিক অধিকার",
  ],
};

// ─── JesAI Reasoning Engine (English) ───────────────────────────────────────
function jesAIRespondEN(
  userMessage: string,
  state: ConversationState,
  _history: Message[]
): { response: string; newState: ConversationState } {
  const msg = userMessage.toLowerCase().trim();
  const newState = { ...state };
  newState.questionCount = state.questionCount + 1;

  if (state.stage === "greeting") {
    newState.stage = "gathering_facts";

    if (
      msg.includes("land") || msg.includes("property") || msg.includes("জমি") ||
      msg.includes("mutation") || msg.includes("deed")
    ) {
      newState.lawArea = "Property & Land Law";
    } else if (
      msg.includes("divorce") || msg.includes("marriage") || msg.includes("talaq") ||
      msg.includes("custody") || msg.includes("maintenance") || msg.includes("dower")
    ) {
      newState.lawArea = "Family Law";
    } else if (
      msg.includes("arrest") || msg.includes("fir") || msg.includes("police") ||
      msg.includes("crime") || msg.includes("bail") || msg.includes("case") ||
      msg.includes("accused")
    ) {
      newState.lawArea = "Criminal Law";
    } else if (
      msg.includes("contract") || msg.includes("agreement") ||
      msg.includes("breach") || msg.includes("payment")
    ) {
      newState.lawArea = "Contract Law";
    } else if (
      msg.includes("job") || msg.includes("employment") || msg.includes("salary") ||
      msg.includes("fired") || msg.includes("termination") || msg.includes("labour")
    ) {
      newState.lawArea = "Labour Law";
    } else if (
      msg.includes("tax") || msg.includes("vat") || msg.includes("income") ||
      msg.includes("nbr")
    ) {
      newState.lawArea = "Tax Law";
    } else if (
      msg.includes("company") || msg.includes("business") ||
      msg.includes("rjsc") || msg.includes("corporate")
    ) {
      newState.lawArea = "Company & Commercial Law";
    } else if (
      msg.includes("constitution") || msg.includes("rights") ||
      msg.includes("fundamental") || msg.includes("writ") || msg.includes("high court")
    ) {
      newState.lawArea = "Constitutional Law";
    }

    newState.coreIssue = userMessage;
    newState.stage = "clarifying";

    const areaText = newState.lawArea
      ? `\n\n📌 **Identified Area:** ${newState.lawArea}`
      : "";

    return {
      response: `Thank you for sharing your situation. Let me understand this properly.${areaText}

**Core Issue I've noted:** "${userMessage}"

To give you accurate legal information, I need a few clarifying details:

1. **Who are the parties involved?** (e.g., you, a family member, a company, government authority)
2. **When did this happen or when did the issue start?** (approximate date/year)
3. **What outcome are you hoping for?** (e.g., get money back, stop something, understand your rights)

Please answer any or all of these — even partial information helps me map the right laws for you.`,
      newState,
    };
  }

  if (state.stage === "clarifying") {
    newState.stage = "law_mapping";
    const lawArea = state.lawArea || "General Bangladesh Law";
    let lawMapping = "";
    let procedureInfo = "";

    if (lawArea === "Property & Land Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Transfer of Property Act 1882 — governs sale, mortgage, lease, gift of property
• Registration Act 1908 — mandatory registration of property documents
• State Acquisition and Tenancy Act 1950 — land ownership and tenancy rights
• Land Survey Tribunal Act 2023 — land dispute resolution
• Limitation Act 1908 — time limits for property claims`;
      procedureInfo = `**Procedural Steps:**
1. Collect all documents: deed, mutation record (khatian), CS/RS/BS maps
2. Check land records at local AC Land office or online (land.gov.bd)
3. For disputes: file case at Civil Court (Artha Rin Adalat for mortgage disputes)
4. For mutation: apply at Union Land Office with required documents
5. For registration issues: approach Sub-Registrar office`;
    } else if (lawArea === "Criminal Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Penal Code 1860 — defines offenses and punishments
• Code of Criminal Procedure 1898 (CrPC) — criminal trial process
• Special Powers Act, Digital Security Act, Anti-Corruption Act (if applicable)
• Evidence Act 1872 — what proof is admissible`;
      procedureInfo = `**Procedural Steps:**
1. **If victim:** File FIR (First Information Report) at nearest Police Station
2. Police investigates → files charge sheet (if evidence found)
3. Case goes to Magistrate Court → Sessions Court for serious offenses
4. **For bail:** Apply to Magistrate (for bailable offenses) or Sessions Judge
5. **If falsely accused:** Apply for anticipatory bail; challenge in High Court if needed`;
    } else if (lawArea === "Family Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Muslim Family Laws Ordinance 1961 — marriage, divorce, polygamy
• Family Courts Ordinance 1985 — family dispute resolution
• Guardians and Wards Act 1890 — child custody
• Dowry Prohibition Act 1980 — dower/dowry rights
• Hindu Marriage Act (for Hindu families)`;
      procedureInfo = `**Procedural Steps:**
1. **For divorce (Muslim):** Husband gives talaq notice to Union Parishad Chairman; 90-day reconciliation period
2. **For wife-initiated divorce (Khul):** File petition in Family Court
3. **For maintenance:** File suit in Family Court (District Judge level)
4. **For custody:** File application in Family Court with child's welfare as primary consideration
5. **Documents needed:** Nikah Nama (marriage certificate), NID, birth certificates`;
    } else if (lawArea === "Labour Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Bangladesh Labour Act 2006 (amended 2013, 2018) — core employment law
• Bangladesh Labour Rules 2015 — implementation rules
• EPZ Labour Act 2019 — for EPZ workers
• Workmen's Compensation Act 1923 — workplace injury`;
      procedureInfo = `**Procedural Steps:**
1. **For wrongful termination:** File complaint with Labour Court within 30 days
2. **For unpaid wages:** Complain to Department of Inspection for Factories and Establishments
3. **For gratuity/provident fund:** File claim with employer first, then Labour Court
4. **Documents needed:** Appointment letter, salary slips, termination letter, service record`;
    } else if (lawArea === "Contract Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Contract Act 1872 — formation, performance, breach, remedies
• Specific Relief Act 1877 — specific performance and injunctions
• Limitation Act 1908 — 3 years for contract suits (generally)
• Arbitration Act 2001 — if arbitration clause exists`;
      procedureInfo = `**Procedural Steps:**
1. **Send legal notice** to breaching party (through advocate)
2. **Attempt negotiation/mediation** first (saves time and cost)
3. **If arbitration clause:** Initiate arbitration proceedings
4. **File civil suit** in Civil Court (jurisdiction based on contract value/location)
5. **For specific performance:** File in Civil Court for court order to perform contract`;
    } else if (lawArea === "Tax Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Income Tax Ordinance 1984 (and Finance Acts) — income tax
• Value Added Tax and Supplementary Duty Act 2012 — VAT
• Customs Act 1969 — import/export duties
• NBR SROs and Notifications — regulatory updates`;
      procedureInfo = `**Procedural Steps:**
1. **For tax disputes:** File objection with Deputy Commissioner of Taxes (DCT)
2. **Appeal:** Commissioner of Taxes (Appeals) → Taxes Appellate Tribunal
3. **For VAT disputes:** Commissioner (Appeals) → VAT Appellate Tribunal
4. **Documents:** TIN certificate, tax returns, assessment orders, financial statements`;
    } else if (lawArea === "Company & Commercial Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Companies Act 1994 — company formation, governance, winding up
• Securities and Exchange Ordinance 1969 — capital markets
• Trade Organizations Ordinance 1961 — trade bodies
• Partnership Act 1932 — partnerships`;
      procedureInfo = `**Procedural Steps:**
1. **Company registration:** Apply to RJSC (Registrar of Joint Stock Companies)
2. **Required documents:** MOA, AOA, Form I, Form VI, Form XII, NID of directors
3. **For disputes:** Company Court (High Court Division) for winding up
4. **For securities violations:** Bangladesh Securities and Exchange Commission (BSEC)`;
    } else {
      lawMapping = `**Applicable Laws (Substantive):**
• Bangladesh Constitution 1972 — fundamental rights and state obligations
• Specific acts depend on your exact situation
• All Bangladesh laws available at: bdlaws.minlaw.gov.bd`;
      procedureInfo = `**General Procedural Guidance:**
1. Identify the specific right or obligation at issue
2. Determine which court or authority has jurisdiction
3. Gather relevant documents and evidence
4. Consider consulting a Bangladesh Bar Council advocate for your specific case`;
    }

    newState.stage = "consequence";
    return {
      response: `Based on your situation, here is the legal information:

---

${lawMapping}

---

${procedureInfo}

---

⚠️ **Consequence Awareness:**
• **If you act promptly:** You preserve your legal rights and remedies within limitation periods
• **If you delay:** Some rights may be time-barred (Limitation Act applies)
• **If you proceed without proper documentation:** Your case may be weakened

---

Do you want me to:
**A)** Explain any specific law in more detail
**B)** Walk through the step-by-step procedure for your specific situation
**C)** Explain what documents you need to gather
**D)** Explain the possible outcomes (positive/negative)

Type A, B, C, or D — or ask your specific follow-up question.`,
      newState,
    };
  }

  if (state.stage === "consequence" || state.stage === "complete") {
    newState.stage = "complete";

    if (msg === "a" || msg.includes("explain") || msg.includes("detail")) {
      return {
        response: `I'll explain the key legal concepts for your situation in ${state.lawArea || "this area"}.

**Understanding the Law's Purpose:**
Every law in Bangladesh was created to balance individual rights with societal needs. The laws applicable to your situation were designed to:
• Protect the weaker party in disputes
• Provide clear remedies when rights are violated
• Ensure predictable outcomes for similar situations

**Key Legal Principles:**
• **Actus Reus** — the physical act or omission
• **Mens Rea** — the intention or knowledge behind the act
• **Burden of Proof** — who must prove what, and to what standard
• **Limitation** — time within which you must act

**Academic Note:**
Bangladesh law draws from British common law tradition, Islamic law (for personal matters), and indigenous customs. Courts interpret laws using both literal and purposive approaches.

Would you like me to explain any specific section or concept further? Or shall I help you understand the procedural steps in detail?`,
        newState,
      };
    }

    if (msg === "b" || msg.includes("step") || msg.includes("procedure") || msg.includes("how to")) {
      return {
        response: `Here is a detailed step-by-step procedural guide for your situation:

**Before You Begin — Checklist:**
□ Gather all relevant documents (originals + photocopies)
□ Note all dates, names, and amounts involved
□ Write a brief factual summary of events in chronological order
□ Identify all parties involved (full names, addresses, NID numbers if possible)

**Step 1: Informal Resolution (Try First)**
• Send a formal written notice to the other party
• Allow 15-30 days for response
• Keep copies of all correspondence

**Step 2: Alternative Dispute Resolution**
• Mediation through local government (Union Parishad/City Corporation)
• Arbitration if contract provides for it
• Village Court for minor disputes (up to BDT 75,000)

**Step 3: Formal Legal Action**
• Consult a Bangladesh Bar Council advocate
• File the appropriate application/plaint in the correct court
• Pay court fees (based on claim value)
• Serve notice on opposite party

**Step 4: Court Process**
• Written statement from defendant
• Framing of issues
• Evidence and witnesses
• Arguments
• Judgment and decree

**Important:** Limitation periods apply — act within the time allowed by law.

📌 **Remember:** This is procedural information. For actual legal representation, you need a certified advocate.`,
        newState,
      };
    }

    if (msg === "c" || msg.includes("document") || msg.includes("paper")) {
      return {
        response: `Here are the key documents typically needed for your type of situation:

**Identity Documents (Always Required):**
□ National Identity Card (NID) — original and photocopy
□ Passport (if available)
□ Birth Certificate

**Situation-Specific Documents:**

${
  state.lawArea === "Property & Land Law"
    ? `**For Property Matters:**
□ Original deed (দলিল) — sale deed, gift deed, etc.
□ Khatian (খতিয়ান) — CS, SA, RS, BS records
□ Mutation certificate (নামজারি)
□ Tax receipts (খাজনার রশিদ)
□ Survey maps (মৌজা ম্যাপ)
□ Succession certificate (if inherited)`
    : state.lawArea === "Family Law"
    ? `**For Family Matters:**
□ Nikah Nama (marriage certificate)
□ Divorce notice/talaq papers (if applicable)
□ Children's birth certificates
□ Income proof (for maintenance claims)
□ Bank statements
□ Property documents (for asset division)`
    : state.lawArea === "Criminal Law"
    ? `**For Criminal Matters:**
□ FIR copy (if filed)
□ Medical certificate (if injury involved)
□ Witness information
□ Any written evidence (messages, contracts, receipts)
□ CCTV footage or photographs (if available)`
    : `**General Documents:**
□ All written agreements or contracts
□ Correspondence (letters, emails, messages)
□ Payment receipts or bank statements
□ Witness contact information
□ Any official notices received`
}

**How to Obtain Missing Documents:**
• Land records: AC Land office or land.gov.bd
• Birth/death certificates: Union Parishad or City Corporation
• Court records: Concerned court's record room
• Company documents: RJSC office

Need help understanding any specific document? Ask me!`,
        newState,
      };
    }

    if (msg === "d" || msg.includes("outcome") || msg.includes("consequence") || msg.includes("result")) {
      return {
        response: `Here is a balanced consequence analysis for your situation:

**✅ Positive Outcomes (If You Proceed Correctly):**
• Your legal rights are formally recognized and protected
• You may receive compensation, relief, or enforcement of your rights
• A court order provides enforceable protection
• Sets a precedent for future similar situations
• Deters the other party from repeating the violation

**⚠️ Challenges to Consider:**
• Court proceedings in Bangladesh can take time (months to years)
• Legal costs: court fees + advocate fees + miscellaneous expenses
• Emotional and time investment required
• Outcome depends on quality of evidence and legal representation
• Appeals by the other party can extend the process

**❌ Risks of Inaction:**
• Limitation period may expire — permanently losing your right to sue
• The other party may take advantage of your inaction
• Evidence may be lost or destroyed over time
• Situation may worsen (e.g., property encroachment continues)

**⚖️ Balanced Assessment:**
The strength of your case depends on:
1. Quality and completeness of your documents
2. Credibility of witnesses
3. Whether the law clearly supports your position
4. The specific facts of your situation

**Recommendation:**
Consult a certified Bangladesh Bar Council advocate to assess the specific strength of your case before proceeding.

Is there anything else you'd like to know about your legal situation?`,
        newState,
      };
    }

    return {
      response: `Thank you for your question. Based on Bangladesh law and your situation:

**Legal Information:**
The laws of Bangladesh — as available on bdlaws.minlaw.gov.bd — provide specific rights and remedies for situations like yours. The key principle is that every right has a corresponding remedy, and every wrong has a corresponding legal response.

**What You Can Do:**
1. Review the applicable laws I've mentioned
2. Gather your documents and evidence
3. Consider the procedural steps outlined
4. Consult a certified advocate for personalized legal advice

**Important Reminder:**
JesAI provides legal literacy and information — not legal advice. For your specific situation, a certified Bangladesh Bar Council advocate can provide proper legal counsel and representation.

Do you have any other questions about Bangladesh law? You have ${Math.max(0, 20 - state.questionCount)} free questions remaining.`,
      newState,
    };
  }

  return {
    response: `I understand your question. Let me help you navigate Bangladesh law.

Could you please tell me more about your specific situation? The more details you share, the better I can map the relevant laws and procedures for you.

**To help you best, please share:**
• What happened (the core facts)
• Who is involved
• What you want to achieve

Remember: JesAI provides legal information and literacy — not legal advice. For legal representation, consult a certified Bangladesh Bar Council advocate.`,
    newState,
  };
}

// ─── JesAI Reasoning Engine (Bangla) ────────────────────────────────────────
function jesAIRespondBN(
  userMessage: string,
  state: ConversationState,
  _history: Message[]
): { response: string; newState: ConversationState } {
  const msg = userMessage.toLowerCase().trim();
  const newState = { ...state };
  newState.questionCount = state.questionCount + 1;

  if (state.stage === "greeting") {
    newState.stage = "gathering_facts";

    if (
      msg.includes("land") || msg.includes("property") || msg.includes("জমি") ||
      msg.includes("সম্পত্তি") || msg.includes("দলিল") || msg.includes("নামজারি") ||
      msg.includes("mutation") || msg.includes("deed")
    ) {
      newState.lawArea = "সম্পত্তি ও ভূমি আইন";
    } else if (
      msg.includes("divorce") || msg.includes("বিবাহ") || msg.includes("তালাক") ||
      msg.includes("marriage") || msg.includes("talaq") || msg.includes("custody") ||
      msg.includes("ভরণপোষণ") || msg.includes("maintenance") || msg.includes("dower") ||
      msg.includes("মোহর")
    ) {
      newState.lawArea = "পারিবারিক আইন";
    } else if (
      msg.includes("arrest") || msg.includes("fir") || msg.includes("police") ||
      msg.includes("পুলিশ") || msg.includes("মামলা") || msg.includes("crime") ||
      msg.includes("bail") || msg.includes("জামিন") || msg.includes("accused") ||
      msg.includes("আসামি")
    ) {
      newState.lawArea = "ফৌজদারি আইন";
    } else if (
      msg.includes("contract") || msg.includes("চুক্তি") || msg.includes("agreement") ||
      msg.includes("breach") || msg.includes("payment") || msg.includes("পেমেন্ট")
    ) {
      newState.lawArea = "চুক্তি আইন";
    } else if (
      msg.includes("job") || msg.includes("চাকরি") || msg.includes("employment") ||
      msg.includes("salary") || msg.includes("বেতন") || msg.includes("fired") ||
      msg.includes("termination") || msg.includes("labour") || msg.includes("শ্রম")
    ) {
      newState.lawArea = "শ্রম আইন";
    } else if (
      msg.includes("tax") || msg.includes("কর") || msg.includes("vat") ||
      msg.includes("ভ্যাট") || msg.includes("income") || msg.includes("nbr")
    ) {
      newState.lawArea = "কর আইন";
    } else if (
      msg.includes("company") || msg.includes("কোম্পানি") || msg.includes("business") ||
      msg.includes("ব্যবসা") || msg.includes("rjsc") || msg.includes("corporate")
    ) {
      newState.lawArea = "কোম্পানি ও বাণিজ্যিক আইন";
    } else if (
      msg.includes("constitution") || msg.includes("সংবিধান") || msg.includes("rights") ||
      msg.includes("অধিকার") || msg.includes("fundamental") || msg.includes("writ") ||
      msg.includes("high court") || msg.includes("হাইকোর্ট")
    ) {
      newState.lawArea = "সাংবিধানিক আইন";
    }

    newState.coreIssue = userMessage;
    newState.stage = "clarifying";

    const areaText = newState.lawArea
      ? `\n\n📌 **চিহ্নিত বিষয়:** ${newState.lawArea}`
      : "";

    return {
      response: `আপনার পরিস্থিতি শেয়ার করার জন্য ধন্যবাদ। আমি এটি সঠিকভাবে বুঝতে চাই।${areaText}

**আমি যে মূল সমস্যাটি নোট করেছি:** "${userMessage}"

আপনাকে সঠিক আইনি তথ্য দিতে, আমার কিছু স্পষ্টীকরণ দরকার:

1. **কারা জড়িত?** (যেমন: আপনি, পরিবারের সদস্য, কোম্পানি, সরকারি কর্তৃপক্ষ)
2. **এটি কখন হয়েছিল বা সমস্যা কখন শুরু হয়েছিল?** (আনুমানিক তারিখ/বছর)
3. **আপনি কী ফলাফল চান?** (যেমন: টাকা ফেরত পাওয়া, কিছু বন্ধ করা, আপনার অধিকার বোঝা)

যেকোনো একটি বা সবগুলো উত্তর দিন — আংশিক তথ্যও আমাকে সঠিক আইন খুঁজে পেতে সাহায্য করে।`,
      newState,
    };
  }

  if (state.stage === "clarifying") {
    newState.stage = "law_mapping";
    const lawArea = state.lawArea || "সাধারণ বাংলাদেশ আইন";
    let lawMapping = "";
    let procedureInfo = "";

    if (lawArea === "সম্পত্তি ও ভূমি আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• সম্পত্তি হস্তান্তর আইন ১৮৮২ — বিক্রয়, বন্ধক, ইজারা, দান নিয়ন্ত্রণ করে
• নিবন্ধন আইন ১৯০৮ — সম্পত্তির দলিল বাধ্যতামূলক নিবন্ধন
• রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০ — জমির মালিকানা ও প্রজাস্বত্ব অধিকার
• ভূমি জরিপ ট্রাইব্যুনাল আইন ২০২৩ — ভূমি বিরোধ নিষ্পত্তি
• তামাদি আইন ১৯০৮ — সম্পত্তি দাবির সময়সীমা`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. সব দলিল সংগ্রহ করুন: দলিল, নামজারি রেকর্ড (খতিয়ান), CS/RS/BS মানচিত্র
২. স্থানীয় AC Land অফিস বা অনলাইনে (land.gov.bd) জমির রেকর্ড যাচাই করুন
৩. বিরোধের জন্য: দেওয়ানি আদালতে মামলা দায়ের করুন
৪. নামজারির জন্য: প্রয়োজনীয় কাগজপত্র সহ ইউনিয়ন ভূমি অফিসে আবেদন করুন
৫. নিবন্ধন সমস্যার জন্য: সাব-রেজিস্ট্রার অফিসে যোগাযোগ করুন`;
    } else if (lawArea === "ফৌজদারি আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• দণ্ডবিধি ১৮৬০ — অপরাধ ও শাস্তি নির্ধারণ করে
• ফৌজদারি কার্যবিধি ১৮৯৮ (CrPC) — ফৌজদারি বিচার প্রক্রিয়া
• বিশেষ ক্ষমতা আইন, ডিজিটাল নিরাপত্তা আইন, দুর্নীতি দমন আইন (প্রযোজ্য হলে)
• সাক্ষ্য আইন ১৮৭২ — কোন প্রমাণ গ্রহণযোগ্য`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. **ভুক্তভোগী হলে:** নিকটতম থানায় এফআইআর (প্রথম তথ্য রিপোর্ট) দায়ের করুন
২. পুলিশ তদন্ত করে → চার্জশিট দাখিল করে (প্রমাণ পাওয়া গেলে)
৩. মামলা ম্যাজিস্ট্রেট আদালতে যায় → গুরুতর অপরাধের জন্য দায়রা আদালতে
৪. **জামিনের জন্য:** ম্যাজিস্ট্রেটের কাছে আবেদন করুন (জামিনযোগ্য অপরাধের জন্য)
৫. **মিথ্যা অভিযোগে:** আগাম জামিনের আবেদন করুন; প্রয়োজনে হাইকোর্টে চ্যালেঞ্জ করুন`;
    } else if (lawArea === "পারিবারিক আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• মুসলিম পারিবারিক আইন অধ্যাদেশ ১৯৬১ — বিবাহ, তালাক, বহুবিবাহ
• পারিবারিক আদালত অধ্যাদেশ ১৯৮৫ — পারিবারিক বিরোধ নিষ্পত্তি
• অভিভাবক ও প্রতিপাল্য আইন ১৮৯০ — শিশু হেফাজত
• যৌতুক নিষিদ্ধ আইন ১৯৮০ — মোহর/যৌতুক অধিকার
• হিন্দু বিবাহ আইন (হিন্দু পরিবারের জন্য)`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. **তালাকের জন্য (মুসলিম):** স্বামী ইউনিয়ন পরিষদ চেয়ারম্যানকে তালাক নোটিশ দেন; ৯০ দিনের মিলন সময়কাল
২. **স্ত্রী-কর্তৃক তালাকের জন্য (খুলা):** পারিবারিক আদালতে আবেদন দায়ের করুন
৩. **ভরণপোষণের জন্য:** পারিবারিক আদালতে মামলা দায়ের করুন
৪. **হেফাজতের জন্য:** শিশুর কল্যাণকে প্রাথমিক বিবেচনায় রেখে পারিবারিক আদালতে আবেদন করুন
৫. **প্রয়োজনীয় কাগজপত্র:** নিকাহনামা, NID, জন্ম সনদ`;
    } else if (lawArea === "শ্রম আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• বাংলাদেশ শ্রম আইন ২০০৬ (সংশোধিত ২০১৩, ২০১৮) — মূল কর্মসংস্থান আইন
• বাংলাদেশ শ্রম বিধিমালা ২০১৫ — বাস্তবায়ন বিধি
• ইপিজেড শ্রম আইন ২০১৯ — ইপিজেড শ্রমিকদের জন্য
• শ্রমিক ক্ষতিপূরণ আইন ১৯২৩ — কর্মক্ষেত্রে আঘাত`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. **অন্যায় বরখাস্তের জন্য:** ৩০ দিনের মধ্যে শ্রম আদালতে অভিযোগ দায়ের করুন
২. **অপরিশোধিত বেতনের জন্য:** কারখানা ও প্রতিষ্ঠান পরিদর্শন অধিদপ্তরে অভিযোগ করুন
৩. **গ্র্যাচুইটি/প্রভিডেন্ট ফান্ডের জন্য:** প্রথমে নিয়োগকর্তার কাছে দাবি করুন, তারপর শ্রম আদালতে
৪. **প্রয়োজনীয় কাগজপত্র:** নিয়োগপত্র, বেতন স্লিপ, বরখাস্তের চিঠি, সেবা রেকর্ড`;
    } else if (lawArea === "চুক্তি আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• চুক্তি আইন ১৮৭২ — গঠন, পালন, লঙ্ঘন, প্রতিকার
• সুনির্দিষ্ট প্রতিকার আইন ১৮৭৭ — নির্দিষ্ট কার্যসম্পাদন ও নিষেধাজ্ঞা
• তামাদি আইন ১৯০৮ — চুক্তি মামলার জন্য সাধারণত ৩ বছর
• সালিশি আইন ২০০১ — সালিশি ধারা থাকলে`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. লঙ্ঘনকারী পক্ষকে **আইনি নোটিশ** পাঠান (আইনজীবীর মাধ্যমে)
২. প্রথমে **আলোচনা/মধ্যস্থতার** চেষ্টা করুন (সময় ও খরচ বাঁচায়)
৩. **সালিশি ধারা থাকলে:** সালিশি কার্যক্রম শুরু করুন
৪. দেওয়ানি আদালতে **দেওয়ানি মামলা** দায়ের করুন
৫. **নির্দিষ্ট কার্যসম্পাদনের জন্য:** দেওয়ানি আদালতে আবেদন করুন`;
    } else if (lawArea === "কর আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• আয়কর অধ্যাদেশ ১৯৮৪ (এবং অর্থ আইন) — আয়কর
• মূল্য সংযোজন কর ও সম্পূরক শুল্ক আইন ২০১২ — ভ্যাট
• কাস্টমস আইন ১৯৬৯ — আমদানি/রপ্তানি শুল্ক
• NBR SRO এবং বিজ্ঞপ্তি — নিয়ন্ত্রক আপডেট`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. **কর বিরোধের জন্য:** উপ-কর কমিশনারের (DCT) কাছে আপত্তি দায়ের করুন
২. **আপিল:** কর কমিশনার (আপিল) → কর আপিল ট্রাইব্যুনাল
৩. **ভ্যাট বিরোধের জন্য:** কমিশনার (আপিল) → ভ্যাট আপিল ট্রাইব্যুনাল
৪. **কাগজপত্র:** TIN সনদ, কর রিটার্ন, মূল্যায়ন আদেশ, আর্থিক বিবরণী`;
    } else if (lawArea === "কোম্পানি ও বাণিজ্যিক আইন") {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• কোম্পানি আইন ১৯৯৪ — কোম্পানি গঠন, পরিচালনা, অবসান
• সিকিউরিটিজ ও এক্সচেঞ্জ অধ্যাদেশ ১৯৬৯ — পুঁজিবাজার
• বাণিজ্য সংগঠন অধ্যাদেশ ১৯৬১ — বাণিজ্য সংস্থা
• অংশীদারিত্ব আইন ১৯৩২ — অংশীদারিত্ব`;
      procedureInfo = `**পদ্ধতিগত পদক্ষেপ:**
১. **কোম্পানি নিবন্ধন:** RJSC (যৌথ মূলধন কোম্পানি ও ফার্মসমূহের নিবন্ধক) এ আবেদন করুন
২. **প্রয়োজনীয় কাগজপত্র:** MOA, AOA, ফর্ম I, VI, XII, পরিচালকদের NID
৩. **বিরোধের জন্য:** অবসানের জন্য কোম্পানি আদালত (হাইকোর্ট বিভাগ)
৪. **সিকিউরিটিজ লঙ্ঘনের জন্য:** বাংলাদেশ সিকিউরিটিজ ও এক্সচেঞ্জ কমিশন (BSEC)`;
    } else {
      lawMapping = `**প্রযোজ্য আইন (মূল আইন):**
• বাংলাদেশ সংবিধান ১৯৭২ — মৌলিক অধিকার ও রাষ্ট্রীয় বাধ্যবাধকতা
• নির্দিষ্ট আইন আপনার পরিস্থিতির উপর নির্ভর করে
• সব বাংলাদেশ আইন পাওয়া যায়: bdlaws.minlaw.gov.bd`;
      procedureInfo = `**সাধারণ পদ্ধতিগত নির্দেশনা:**
১. বিষয়বস্তুতে নির্দিষ্ট অধিকার বা বাধ্যবাধকতা চিহ্নিত করুন
২. কোন আদালত বা কর্তৃপক্ষের এখতিয়ার আছে তা নির্ধারণ করুন
৩. প্রাসঙ্গিক কাগজপত্র ও প্রমাণ সংগ্রহ করুন
৪. আপনার নির্দিষ্ট মামলার জন্য বাংলাদেশ বার কাউন্সিলের একজন আইনজীবীর পরামর্শ নিন`;
    }

    newState.stage = "consequence";
    return {
      response: `আপনার পরিস্থিতির ভিত্তিতে, এখানে আইনি তথ্য রয়েছে:

---

${lawMapping}

---

${procedureInfo}

---

⚠️ **পরিণতি সম্পর্কে সচেতনতা:**
• **দ্রুত পদক্ষেপ নিলে:** আপনি তামাদি মেয়াদের মধ্যে আপনার আইনি অধিকার ও প্রতিকার সংরক্ষণ করতে পারবেন
• **দেরি করলে:** কিছু অধিকার তামাদি হয়ে যেতে পারে (তামাদি আইন প্রযোজ্য)
• **সঠিক কাগজপত্র ছাড়া এগোলে:** আপনার মামলা দুর্বল হতে পারে

---

আপনি কি চান আমি:
**ক)** কোনো নির্দিষ্ট আইন আরও বিস্তারিত ব্যাখ্যা করি
**খ)** আপনার নির্দিষ্ট পরিস্থিতির জন্য ধাপে ধাপে পদ্ধতি বলি
**গ)** কোন কাগজপত্র সংগ্রহ করতে হবে তা ব্যাখ্যা করি
**ঘ)** সম্ভাব্য ফলাফল (ইতিবাচক/নেতিবাচক) ব্যাখ্যা করি

ক, খ, গ, বা ঘ টাইপ করুন — অথবা আপনার নির্দিষ্ট প্রশ্ন জিজ্ঞাসা করুন।`,
      newState,
    };
  }

  if (state.stage === "consequence" || state.stage === "complete") {
    newState.stage = "complete";

    if (msg === "ক" || msg === "a" || msg.includes("explain") || msg.includes("বিস্তারিত") || msg.includes("ব্যাখ্যা")) {
      return {
        response: `আমি ${state.lawArea || "এই বিষয়ে"} আপনার পরিস্থিতির জন্য মূল আইনি ধারণাগুলি ব্যাখ্যা করব।

**আইনের উদ্দেশ্য বোঝা:**
বাংলাদেশের প্রতিটি আইন ব্যক্তিগত অধিকার ও সামাজিক প্রয়োজনের মধ্যে ভারসাম্য রক্ষার জন্য তৈরি হয়েছে। আপনার পরিস্থিতিতে প্রযোজ্য আইনগুলি তৈরি হয়েছে:
• বিরোধে দুর্বল পক্ষকে রক্ষা করতে
• অধিকার লঙ্ঘন হলে স্পষ্ট প্রতিকার প্রদান করতে
• একই ধরনের পরিস্থিতিতে পূর্বানুমানযোগ্য ফলাফল নিশ্চিত করতে

**মূল আইনি নীতি:**
• **Actus Reus** — শারীরিক কাজ বা বিরতি
• **Mens Rea** — কাজের পেছনে উদ্দেশ্য বা জ্ঞান
• **প্রমাণের ভার** — কে কী প্রমাণ করবে এবং কোন মানদণ্ডে
• **তামাদি** — যে সময়ের মধ্যে আপনাকে পদক্ষেপ নিতে হবে

**একাডেমিক নোট:**
বাংলাদেশের আইন ব্রিটিশ সাধারণ আইন ঐতিহ্য, ইসলামি আইন (ব্যক্তিগত বিষয়ে) এবং দেশীয় রীতিনীতি থেকে উদ্ভূত। আদালত আক্ষরিক ও উদ্দেশ্যমূলক উভয় পদ্ধতিতে আইন ব্যাখ্যা করে।

আপনি কি কোনো নির্দিষ্ট ধারা বা ধারণা আরও বিস্তারিত জানতে চান?`,
        newState,
      };
    }

    if (msg === "খ" || msg === "b" || msg.includes("step") || msg.includes("পদক্ষেপ") || msg.includes("পদ্ধতি")) {
      return {
        response: `আপনার পরিস্থিতির জন্য বিস্তারিত ধাপে ধাপে পদ্ধতিগত নির্দেশিকা:

**শুরু করার আগে — চেকলিস্ট:**
□ সব প্রাসঙ্গিক কাগজপত্র সংগ্রহ করুন (মূল + ফটোকপি)
□ সব তারিখ, নাম এবং পরিমাণ নোট করুন
□ ঘটনার কালানুক্রমিক সংক্ষিপ্ত বিবরণ লিখুন
□ সব পক্ষ চিহ্নিত করুন (পূর্ণ নাম, ঠিকানা, NID নম্বর যদি সম্ভব)

**ধাপ ১: অনানুষ্ঠানিক সমাধান (প্রথমে চেষ্টা করুন)**
• অন্য পক্ষকে আনুষ্ঠানিক লিখিত নোটিশ পাঠান
• সাড়া দেওয়ার জন্য ১৫-৩০ দিন সময় দিন
• সব চিঠিপত্রের কপি রাখুন

**ধাপ ২: বিকল্প বিরোধ নিষ্পত্তি**
• স্থানীয় সরকারের মাধ্যমে মধ্যস্থতা (ইউনিয়ন পরিষদ/সিটি কর্পোরেশন)
• চুক্তিতে সালিশি ধারা থাকলে সালিশি
• ছোট বিরোধের জন্য গ্রাম আদালত (৭৫,০০০ টাকা পর্যন্ত)

**ধাপ ৩: আনুষ্ঠানিক আইনি পদক্ষেপ**
• বাংলাদেশ বার কাউন্সিলের একজন আইনজীবীর পরামর্শ নিন
• সঠিক আদালতে উপযুক্ত আবেদন/আরজি দায়ের করুন
• আদালত ফি পরিশোধ করুন (দাবির মূল্যের উপর ভিত্তি করে)
• বিপরীত পক্ষকে নোটিশ দিন

**ধাপ ৪: আদালত প্রক্রিয়া**
• বিবাদীর লিখিত বিবৃতি
• বিষয় নির্ধারণ
• সাক্ষ্য ও সাক্ষী
• যুক্তিতর্ক
• রায় ও ডিক্রি

📌 **মনে রাখবেন:** এটি পদ্ধতিগত তথ্য। প্রকৃত আইনি প্রতিনিধিত্বের জন্য একজন সনদপ্রাপ্ত আইনজীবী প্রয়োজন।`,
        newState,
      };
    }

    if (msg === "গ" || msg === "c" || msg.includes("document") || msg.includes("কাগজ") || msg.includes("দলিল")) {
      return {
        response: `আপনার ধরনের পরিস্থিতির জন্য সাধারণত প্রয়োজনীয় মূল কাগজপত্র:

**পরিচয় কাগজপত্র (সবসময় প্রয়োজন):**
□ জাতীয় পরিচয়পত্র (NID) — মূল ও ফটোকপি
□ পাসপোর্ট (যদি থাকে)
□ জন্ম সনদ

**পরিস্থিতি-নির্দিষ্ট কাগজপত্র:**

${
  state.lawArea === "সম্পত্তি ও ভূমি আইন"
    ? `**সম্পত্তি বিষয়ের জন্য:**
□ মূল দলিল — বিক্রয় দলিল, দান দলিল ইত্যাদি
□ খতিয়ান — CS, SA, RS, BS রেকর্ড
□ নামজারি সনদ
□ খাজনার রশিদ
□ মৌজা ম্যাপ
□ উত্তরাধিকার সনদ (উত্তরাধিকারসূত্রে পাওয়া হলে)`
    : state.lawArea === "পারিবারিক আইন"
    ? `**পারিবারিক বিষয়ের জন্য:**
□ নিকাহনামা (বিবাহ সনদ)
□ তালাকনামা/তালাক কাগজপত্র (প্রযোজ্য হলে)
□ সন্তানদের জন্ম সনদ
□ আয়ের প্রমাণ (ভরণপোষণ দাবির জন্য)
□ ব্যাংক স্টেটমেন্ট
□ সম্পত্তির কাগজপত্র (সম্পদ বিভাজনের জন্য)`
    : state.lawArea === "ফৌজদারি আইন"
    ? `**ফৌজদারি বিষয়ের জন্য:**
□ এফআইআর কপি (দায়ের করা হলে)
□ চিকিৎসা সনদ (আঘাত জড়িত থাকলে)
□ সাক্ষীর তথ্য
□ যেকোনো লিখিত প্রমাণ (বার্তা, চুক্তি, রশিদ)
□ সিসিটিভি ফুটেজ বা ছবি (পাওয়া গেলে)`
    : `**সাধারণ কাগজপত্র:**
□ সব লিখিত চুক্তি বা সংবিদা
□ চিঠিপত্র (চিঠি, ইমেইল, বার্তা)
□ পেমেন্ট রশিদ বা ব্যাংক স্টেটমেন্ট
□ সাক্ষীর যোগাযোগের তথ্য
□ প্রাপ্ত যেকোনো সরকারি নোটিশ`
}

**হারানো কাগজপত্র কীভাবে পাবেন:**
• জমির রেকর্ড: AC Land অফিস বা land.gov.bd
• জন্ম/মৃত্যু সনদ: ইউনিয়ন পরিষদ বা সিটি কর্পোরেশন
• আদালতের রেকর্ড: সংশ্লিষ্ট আদালতের রেকর্ড রুম
• কোম্পানির কাগজপত্র: RJSC অফিস

কোনো নির্দিষ্ট কাগজপত্র বুঝতে সাহায্য দরকার? আমাকে জিজ্ঞাসা করুন!`,
        newState,
      };
    }

    if (msg === "ঘ" || msg === "d" || msg.includes("outcome") || msg.includes("ফলাফল") || msg.includes("পরিণতি")) {
      return {
        response: `আপনার পরিস্থিতির জন্য একটি সুষম পরিণতি বিশ্লেষণ:

**✅ ইতিবাচক ফলাফল (সঠিকভাবে এগোলে):**
• আপনার আইনি অধিকার আনুষ্ঠানিকভাবে স্বীকৃত ও সুরক্ষিত হবে
• আপনি ক্ষতিপূরণ, ত্রাণ বা আপনার অধিকার প্রয়োগ পেতে পারেন
• আদালতের আদেশ কার্যকরযোগ্য সুরক্ষা প্রদান করে
• ভবিষ্যতে একই ধরনের পরিস্থিতির জন্য নজির স্থাপন করে
• অন্য পক্ষকে পুনরায় লঙ্ঘন থেকে বিরত রাখে

**⚠️ বিবেচনার বিষয়:**
• বাংলাদেশে আদালতের কার্যক্রম সময় নিতে পারে (মাস থেকে বছর)
• আইনি খরচ: আদালত ফি + আইনজীবী ফি + বিবিধ খরচ
• মানসিক ও সময়ের বিনিয়োগ প্রয়োজন
• ফলাফল প্রমাণের মান ও আইনি প্রতিনিধিত্বের উপর নির্ভর করে
• অন্য পক্ষের আপিল প্রক্রিয়া দীর্ঘায়িত করতে পারে

**❌ নিষ্ক্রিয়তার ঝুঁকি:**
• তামাদি মেয়াদ শেষ হতে পারে — মামলা করার অধিকার স্থায়ীভাবে হারাতে পারেন
• অন্য পক্ষ আপনার নিষ্ক্রিয়তার সুযোগ নিতে পারে
• সময়ের সাথে প্রমাণ হারিয়ে বা নষ্ট হতে পারে
• পরিস্থিতি আরও খারাপ হতে পারে

**⚖️ সুষম মূল্যায়ন:**
আপনার মামলার শক্তি নির্ভর করে:
১. আপনার কাগজপত্রের মান ও সম্পূর্ণতা
২. সাক্ষীদের বিশ্বাসযোগ্যতা
৩. আইন স্পষ্টভাবে আপনার অবস্থান সমর্থন করে কিনা
৪. আপনার পরিস্থিতির নির্দিষ্ট তথ্য

**সুপারিশ:**
এগোনোর আগে আপনার মামলার নির্দিষ্ট শক্তি মূল্যায়ন করতে একজন সনদপ্রাপ্ত বাংলাদেশ বার কাউন্সিল আইনজীবীর পরামর্শ নিন।

আপনার আইনি পরিস্থিতি সম্পর্কে আর কিছু জানতে চান?`,
        newState,
      };
    }

    return {
      response: `আপনার প্রশ্নের জন্য ধন্যবাদ। বাংলাদেশ আইন ও আপনার পরিস্থিতির ভিত্তিতে:

**আইনি তথ্য:**
বাংলাদেশের আইন — bdlaws.minlaw.gov.bd-এ পাওয়া যায় — আপনার মতো পরিস্থিতির জন্য নির্দিষ্ট অধিকার ও প্রতিকার প্রদান করে। মূল নীতি হলো প্রতিটি অধিকারের একটি সংশ্লিষ্ট প্রতিকার আছে।

**আপনি কী করতে পারেন:**
১. আমি যে প্রযোজ্য আইনগুলি উল্লেখ করেছি তা পর্যালোচনা করুন
২. আপনার কাগজপত্র ও প্রমাণ সংগ্রহ করুন
৩. উল্লিখিত পদ্ধতিগত পদক্ষেপগুলি বিবেচনা করুন
৪. ব্যক্তিগত আইনি পরামর্শের জন্য একজন সনদপ্রাপ্ত আইনজীবীর পরামর্শ নিন

**গুরুত্বপূর্ণ অনুস্মারক:**
JesAI আইনি সাক্ষরতা ও তথ্য প্রদান করে — আইনি পরামর্শ নয়। আপনার নির্দিষ্ট পরিস্থিতির জন্য, একজন সনদপ্রাপ্ত বাংলাদেশ বার কাউন্সিল আইনজীবী সঠিক আইনি পরামর্শ ও প্রতিনিধিত্ব প্রদান করতে পারেন।

বাংলাদেশ আইন সম্পর্কে আর কোনো প্রশ্ন আছে? আপনার ${Math.max(0, 20 - state.questionCount)}টি বিনামূল্যে প্রশ্ন বাকি আছে।`,
      newState,
    };
  }

  return {
    response: `আমি আপনার প্রশ্ন বুঝতে পেরেছি। আমি আপনাকে বাংলাদেশ আইন নেভিগেট করতে সাহায্য করব।

আপনার নির্দিষ্ট পরিস্থিতি সম্পর্কে আরও বলুন? আপনি যত বেশি বিবরণ শেয়ার করবেন, আমি তত ভালোভাবে আপনার জন্য প্রাসঙ্গিক আইন ও পদ্ধতি খুঁজে পেতে পারব।

**আপনাকে সর্বোত্তম সাহায্য করতে, অনুগ্রহ করে শেয়ার করুন:**
• কী হয়েছে (মূল তথ্য)
• কারা জড়িত
• আপনি কী অর্জন করতে চান

মনে রাখবেন: JesAI আইনি তথ্য ও সাক্ষরতা প্রদান করে — আইনি পরামর্শ নয়।`,
    newState,
  };
}

// ─── Initial Messages ────────────────────────────────────────────────────────
const INITIAL_MESSAGE_EN = `আস্সালামু আলাইকুম! Welcome to **JesAI** — Bangladesh's Legal Literacy Assistant. 🇧🇩

I am your Mother Legal AI, trained on Bangladesh laws from **bdlaws.minlaw.gov.bd**. I can help you understand:

• Your **legal rights and duties** under Bangladesh law
• **Which laws apply** to your situation
• **Step-by-step procedures** for courts, applications, and filings
• **Consequences** of different legal actions

**How to start:** Simply describe your situation in plain language — no legal jargon needed. I'll ask clarifying questions, map the relevant laws, and guide you through the process.

📌 **You have 20 free questions.** After that, subscribe for unlimited access with human legal assistance.

⚠️ *JesAI provides legal information and literacy only — not legal advice. For legal services, consult a certified Bangladesh Bar Council advocate.*

---

**What is your legal situation or question today?**`;

const INITIAL_MESSAGE_BN = `আস্সালামু আলাইকুম! **JesAI**-তে স্বাগতম — বাংলাদেশের আইনি সাক্ষরতা সহকারী। 🇧🇩

আমি আপনার মাদার লিগ্যাল AI, **bdlaws.minlaw.gov.bd** থেকে বাংলাদেশের আইনে প্রশিক্ষিত। আমি আপনাকে বুঝতে সাহায্য করতে পারি:

• বাংলাদেশ আইনের অধীনে আপনার **আইনি অধিকার ও কর্তব্য**
• আপনার পরিস্থিতিতে **কোন আইন প্রযোজ্য**
• আদালত, আবেদন ও দাখিলের জন্য **ধাপে ধাপে পদ্ধতি**
• বিভিন্ন আইনি পদক্ষেপের **পরিণতি**

**কীভাবে শুরু করবেন:** সহজ ভাষায় আপনার পরিস্থিতি বর্ণনা করুন — কোনো আইনি পরিভাষার দরকার নেই। আমি স্পষ্টীকরণ প্রশ্ন করব, প্রাসঙ্গিক আইন খুঁজে বের করব এবং আপনাকে পুরো প্রক্রিয়ায় গাইড করব।

📌 **আপনার ২০টি বিনামূল্যে প্রশ্ন আছে।** এরপর মানব আইনি সহায়তাসহ সীমাহীন অ্যাক্সেসের জন্য সাবস্ক্রাইব করুন।

⚠️ *JesAI শুধুমাত্র আইনি তথ্য ও সাক্ষরতা প্রদান করে — আইনি পরামর্শ নয়। আইনি সেবার জন্য, একজন সনদপ্রাপ্ত বাংলাদেশ বার কাউন্সিল আইনজীবীর পরামর্শ নিন।*

---

**আজ আপনার আইনি পরিস্থিতি বা প্রশ্ন কী?**`;

function makeInitialMessage(lang: Language): Message {
  return {
    id: "welcome",
    role: "ai",
    content: lang === "en" ? INITIAL_MESSAGE_EN : INITIAL_MESSAGE_BN,
    timestamp: new Date(0),
  };
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ChatInterface() {
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>(() => [makeInitialMessage("en")]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: "greeting",
    lawArea: null,
    coreIssue: null,
    questionCount: 0,
  });
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idCounterRef = useRef(1);
  const recognitionRef = useRef<any>(null); // browser SpeechRecognition API — no stable TS types

  const t = UI_TEXT[lang];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Switch language — reset conversation
  const switchLanguage = useCallback(() => {
    const newLang: Language = lang === "en" ? "bn" : "en";
    setLang(newLang);
    setMessages([makeInitialMessage(newLang)]);
    setConversationState({ stage: "greeting", lawArea: null, coreIssue: null, questionCount: 0 });
    setQuestionCount(0);
    setInput("");
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  }, [lang]);

  // ── Voice Input ──────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    type SpeechRecognitionCtor = new () => {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      start(): void;
      stop(): void;
      onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
    };

    const w = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };

    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang === "bn" ? "bn-BD" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Voice Output ─────────────────────────────────────────────────────────
  const speakMessage = useCallback((messageId: string, content: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown-like syntax for cleaner speech
    const cleanText = content
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/^#{1,6}\s/gm, "")
      .replace(/---/g, "")
      .replace(/□/g, "")
      .replace(/•/g, "")
      .replace(/\n+/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "bn" ? "bn-BD" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  }, [lang, speakingId]);

  // ── Send Message ─────────────────────────────────────────────────────────
  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;
    if (questionCount >= 20) return;

    const userMessage: Message = {
      id: (idCounterRef.current++).toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setQuestionCount((c) => c + 1);

    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 600)
    );

    const responder = lang === "en" ? jesAIRespondEN : jesAIRespondBN;
    const { response, newState } = responder(messageText, conversationState, messages);

    const aiMessage: Message = {
      id: (idCounterRef.current++).toString(),
      role: "ai",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setConversationState(newState);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const formatted = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-semibold">$1</strong>'
      );
      if (line.startsWith("•") || line.startsWith("□")) {
        return (
          <div key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      if (line.match(/^\*\*.*\*\*:?$/) || line.startsWith("**")) {
        return (
          <div key={i} className="mt-2" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      if (line === "---") {
        return <hr key={i} className="border-white/10 my-2" />;
      }
      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }} />
      );
    });
  };

  const freeRemaining = Math.max(0, 20 - questionCount);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0d2240]/50">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-xs text-slate-400">{t.active}</span>
          {conversationState.lawArea && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-[#c8a84b]">📌 {conversationState.lawArea}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={switchLanguage}
            className="text-xs px-3 py-1 rounded-full border border-[#c8a84b]/40 bg-[#c8a84b]/10 text-[#c8a84b] hover:bg-[#c8a84b]/20 transition-colors font-medium"
            title="Switch language"
          >
            {t.langToggle}
          </button>
          <div
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              freeRemaining > 10
                ? "bg-[#006a4e]/20 text-[#4ade80]"
                : freeRemaining > 5
                ? "bg-[#c8a84b]/20 text-[#c8a84b]"
                : "bg-[#f42a41]/20 text-[#f42a41]"
            }`}
          >
            {t.freeLeft(freeRemaining)}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                message.role === "ai"
                  ? "bg-[#006a4e] text-white"
                  : "bg-[#c8a84b] text-[#0a1628]"
              }`}
            >
              {message.role === "ai" ? "J" : "U"}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "ai"
                  ? "bg-[#0d2240] border border-white/10 text-slate-300 rounded-tl-sm"
                  : "bg-[#006a4e] text-white rounded-tr-sm"
              }`}
            >
              {message.role === "ai" ? (
                <div className="space-y-0.5">{formatMessage(message.content)}</div>
              ) : (
                <p>{message.content}</p>
              )}

              <div className="flex items-center justify-between mt-2 gap-2">
                <div
                  suppressHydrationWarning
                  className={`text-[10px] ${
                    message.role === "ai" ? "text-slate-600" : "text-green-200/60"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("en-BD", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* TTS button for AI messages */}
                {message.role === "ai" && (
                  <button
                    onClick={() => speakMessage(message.id, message.content)}
                    title={speakingId === message.id ? t.stopSpeakBtn : t.speakBtn}
                    className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                      speakingId === message.id
                        ? "bg-[#f42a41]/20 text-[#f42a41] hover:bg-[#f42a41]/30"
                        : "bg-white/5 text-slate-500 hover:text-[#4ade80] hover:bg-[#006a4e]/20"
                    }`}
                  >
                    {speakingId === message.id ? (
                      <>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                        <span>{t.stopSpeakBtn}</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12M9 9v6m-3-3h.01" />
                        </svg>
                        <span>{t.speakBtn}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble flex gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#006a4e] flex items-center justify-center text-sm font-bold text-white">
              J
            </div>
            <div className="bg-[#0d2240] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="typing-dot h-2 w-2 rounded-full bg-[#4ade80]" />
                <div className="typing-dot h-2 w-2 rounded-full bg-[#4ade80]" />
                <div className="typing-dot h-2 w-2 rounded-full bg-[#4ade80]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick topic chips */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-500 mb-2">{t.quickTopics}</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS[lang].map((topic) => (
              <button
                key={topic}
                onClick={() => sendMessage(topic)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#006a4e]/40 bg-[#006a4e]/10 text-[#4ade80] hover:bg-[#006a4e]/20 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Limit reached */}
      {questionCount >= 20 && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-[#c8a84b]/10 border border-[#c8a84b]/30 text-center">
          <p className="text-sm text-[#c8a84b] font-semibold">{t.limitTitle}</p>
          <p className="text-xs text-slate-400 mt-1">{t.limitSub}</p>
          <button className="mt-2 px-4 py-1.5 rounded-lg bg-[#c8a84b] text-[#0a1628] text-xs font-bold hover:bg-[#b8943b] transition-colors">
            {t.subscribeBtn}
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 p-4 bg-[#0a1628]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping || questionCount >= 20}
            placeholder={questionCount >= 20 ? t.placeholderLimit : t.placeholder}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-[#0d2240] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#006a4e]/60 focus:ring-1 focus:ring-[#006a4e]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Voice input button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isTyping || questionCount >= 20}
            title={isListening ? t.stopListenBtn : t.listenBtn}
            className={`flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg ${
              isListening
                ? "bg-[#f42a41] hover:bg-[#d42030] animate-pulse"
                : "bg-[#0d2240] border border-white/10 text-slate-400 hover:text-white hover:border-[#006a4e]/60"
            }`}
            aria-label={isListening ? t.stopListenBtn : t.listenBtn}
          >
            {isListening ? (
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping || questionCount >= 20}
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-[#006a4e] flex items-center justify-center text-white hover:bg-[#005a40] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            aria-label="Send message"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2 text-center">{t.footer}</p>
      </div>
    </div>
  );
}
