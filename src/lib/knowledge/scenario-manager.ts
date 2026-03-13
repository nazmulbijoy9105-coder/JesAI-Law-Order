// ─── JesAI Scenario Manager ───────────────────────────────────
// NLC validated — Nazmul, Advocate, Supreme Court of Bangladesh
// Handles multi-step legal scenarios that require sequential guidance
// Works with: types.ts (QAEntry, LawArea, KnowledgeResult)
//             index.ts (queryKnowledge, detectArea)
// Last verified: 2025-03-09

import type { LawArea, KnowledgeResult } from "./types";
import { detectArea } from "./index";

// ─── Types ────────────────────────────────────────────────────

export interface ScenarioStep {
  stepId: string;           // e.g. "company-reg-step-2"
  title: string;            // short label shown in UI
  instruction: string;      // what user should do at this step
  documents?: string[];     // documents needed at this step
  office?: string;          // physical office / portal to visit
  estimatedTime?: string;   // "3-5 working days"
  cost?: string;            // approximate cost
  warningNote?: string;     // if something can go wrong
  nextStepHint?: string;    // brief preview of next step
}

export interface Scenario {
  scenarioId: string;
  area: LawArea;
  title: string;
  description: string;
  triggerPhrases: string[];   // lowercased phrase fragments
  totalSteps: number;
  steps: ScenarioStep[];
  finalNote: string;          // shown after all steps complete
  escalate: boolean;
  escalateReason?: string;
}

export interface ScenarioResult {
  matched: true;
  scenario: Scenario;
  currentStep: ScenarioStep;
  stepNumber: number;         // 1-indexed for display
  totalSteps: number;
  progressPercent: number;
  isComplete: boolean;
  summary: string;            // formatted response string
}

export interface ScenarioNoMatch {
  matched: false;
}

export type ScenarioQueryResult = ScenarioResult | ScenarioNoMatch;

// ─── Scenario Definitions ─────────────────────────────────────

const SCENARIOS: Scenario[] = [

  // ══════════════════════════════════════════════════════════
  // 1. PRIVATE LIMITED COMPANY REGISTRATION
  // ══════════════════════════════════════════════════════════
  {
    scenarioId: "company-pvt-registration",
    area: "company",
    title: "Private Limited Company Registration",
    description: "Step-by-step guide to register a Pvt Ltd company with RJSC Bangladesh",
    triggerPhrases: [
      "register company step",
      "how to register a company",
      "incorporate company steps",
      "company registration process",
      "rjsc registration steps",
      "form a pvt ltd",
      "start a company",
      "open a company",
      "কোম্পানি নিবন্ধনের ধাপ",
      "কোম্পানি কিভাবে খুলবো",
    ],
    totalSteps: 6,
    steps: [
      {
        stepId: "company-reg-step-1",
        title: "Name Clearance",
        instruction:
          "Apply for company name clearance online at roc.gov.bd. Submit 3 proposed names in order of preference. RJSC checks existing registered names for conflicts.",
        documents: ["3 proposed company names", "Brief description of business activity"],
        office: "roc.gov.bd (online only)",
        estimatedTime: "1–3 working days",
        cost: "~BDT 200",
        warningNote:
          "Clearance is valid for only 90 days — begin MOA/AOA drafting immediately after approval.",
        nextStepHint: "Next: Prepare Memorandum of Association (MOA) and Articles of Association (AOA).",
      },
      {
        stepId: "company-reg-step-2",
        title: "Draft MOA and AOA",
        instruction:
          "Prepare Memorandum of Association (MOA) and Articles of Association (AOA). MOA defines business objects, share capital, and members' liability. AOA governs internal management — director powers, meetings, share transfers, dividends.",
        documents: [
          "Cleared company name",
          "Decided business objects (objects clause)",
          "Authorized capital amount",
          "Names and NID of all shareholders and directors",
          "Registered office address",
        ],
        office: "Drafting — can engage NLC or CA for assistance",
        estimatedTime: "1–3 days",
        cost: "Lawyer/CA fee BDT 3,000–10,000 (if professional help used)",
        warningNote:
          "Draft MOA objects broadly — an overly narrow objects clause will require expensive amendment later when you expand business.",
        nextStepHint: "Next: Submit online application at roc.gov.bd with all documents.",
      },
      {
        stepId: "company-reg-step-3",
        title: "Online Submission at RJSC",
        instruction:
          "Log in to roc.gov.bd and submit the incorporation application. Upload MOA, AOA, and fill Form I (statutory declaration), Form VI (registered office), Form XII (directors). All subscribers must sign MOA/AOA — e-signatures accepted on the portal.",
        documents: [
          "Signed MOA and AOA",
          "Form I (statutory declaration by subscriber)",
          "Form VI (notice of registered office)",
          "Form XII (list of directors)",
          "NID copies of all directors and shareholders",
          "TIN certificates of all directors and shareholders",
          "Utility bill / lease for registered office",
          "Passport-size photos of directors",
        ],
        office: "roc.gov.bd (fully online)",
        estimatedTime: "Submission: 1 day; RJSC processing: 7–15 working days",
        cost: "RJSC fee based on authorized capital (BDT 3,200 for ≤1 lakh capital)",
        warningNote:
          "Double-check all NID numbers and TINs before submission — errors delay the entire process.",
        nextStepHint: "Next: Pay RJSC registration fees online.",
      },
      {
        stepId: "company-reg-step-4",
        title: "Pay RJSC Fees",
        instruction:
          "Pay the RJSC registration fee online via Sonali Bank sePay or SSL Commerz on the roc.gov.bd payment gateway. Fee amount depends on your authorized capital. Keep the payment receipt — you will need it.",
        documents: ["RJSC application reference number", "Payment method (online banking / card)"],
        office: "roc.gov.bd payment gateway",
        estimatedTime: "Immediate",
        cost:
          "≤BDT 1 lakh capital: BDT 3,200 | BDT 1–5 lakh: BDT 5,000 | BDT 5 lakh–1 crore: BDT 10,000 | BDT 1–5 crore: BDT 20,000",
        warningNote:
          "Keep fee payment receipt. RJSC will not process without confirmed payment.",
        nextStepHint: "Next: Collect Certificate of Incorporation from roc.gov.bd after RJSC approval.",
      },
      {
        stepId: "company-reg-step-5",
        title: "Receive Certificate of Incorporation",
        instruction:
          "After RJSC reviews and approves your application, download the Certificate of Incorporation from roc.gov.bd. The certificate contains your unique Company Registration Number (CRN). Also download the certified copies of MOA and AOA from the portal.",
        documents: ["Certificate of Incorporation (download from roc.gov.bd)"],
        office: "roc.gov.bd (download online)",
        estimatedTime: "7–15 working days after payment",
        cost: "Included in registration fee",
        warningNote:
          "Verify company name and CRN on the certificate carefully before proceeding.",
        nextStepHint: "Next: Post-incorporation steps — TIN, trade licence, bank account.",
      },
      {
        stepId: "company-reg-step-6",
        title: "Post-Incorporation Setup",
        instruction:
          "Complete these mandatory post-incorporation steps: (1) Register company TIN at incometax.gov.bd. (2) Obtain trade licence from ward office of city corporation / municipality. (3) Open company bank account — all directors must visit the bank for KYC with Certificate of Incorporation, MOA/AOA, board resolution, and TIN. (4) Get company common seal made. (5) Register for VAT at vat.gov.bd if annual turnover expected above BDT 50 lakh.",
        documents: [
          "Certificate of Incorporation",
          "MOA and AOA (certified copies)",
          "Board resolution for bank account opening",
          "NID + TIN of all directors",
          "Trade licence",
          "Utility bill of registered office",
        ],
        office:
          "incometax.gov.bd (TIN) | Ward office (trade licence) | Bank branch (account) | vat.gov.bd (VAT if needed)",
        estimatedTime: "TIN: instant | Trade licence: 7–30 days | Bank account: 3–7 days",
        cost:
          "TIN: free | Trade licence: BDT 1,000–5,000 | Bank: nil | Common seal: BDT 500–2,000",
        warningNote:
          "Do not begin business operations before opening the company bank account — all company funds must flow through the company account.",
        nextStepHint:
          "Company is now fully operational. Annual compliance: hold AGM within 120 days of financial year end, file annual return at RJSC within 21 days of AGM.",
      },
    ],
    finalNote:
      "✅ Company registration complete. Annual obligations: RJSC annual return (21 days after AGM), income tax return by 15 July, VAT monthly return by 15th (if VAT registered), trade licence renewal by 30 June each year.\n\n📄 Full compliance calendar — NLC can assist.",
    escalate: false,
  },

  // ══════════════════════════════════════════════════════════
  // 2. LAND PURCHASE
  // ══════════════════════════════════════════════════════════
  {
    scenarioId: "property-purchase",
    area: "property",
    title: "Land / Property Purchase",
    description: "Step-by-step process for legally buying land or property in Bangladesh",
    triggerPhrases: [
      "buy land steps",
      "purchase land process",
      "how to buy property",
      "land buying procedure",
      "property purchase steps",
      "register a land deed",
      "how to purchase land",
      "জমি কেনার ধাপ",
      "জমি কেনার প্রক্রিয়া",
      "জমি কিনতে চাই",
    ],
    totalSteps: 7,
    steps: [
      {
        stepId: "property-buy-step-1",
        title: "Verify Title and Check Documents",
        instruction:
          "Before paying any money, verify the seller's title to the land. Obtain: CS/SA/RS Khatian (record of rights), Mutation Khatian (current owner), Bain Kabala (certified copy of original deed), DCR (payment receipts for land development tax). Check if land is recorded in seller's name.",
        documents: [
          "CS Khatian (original survey record)",
          "SA Khatian (state acquisition record)",
          "RS Khatian (revisional survey record)",
          "Mutation Khatian (current owner)",
          "Latest certified copy of deed",
          "DCR (land development tax receipts)",
        ],
        office: "Sub-Registry office | AC Land office | Survey office",
        estimatedTime: "1–2 weeks (for certified copies)",
        cost: "BDT 200–1,000 for certified copies",
        warningNote:
          "Never pay advance money before completing title verification. Fraudulent land sales are common — the Khatian in seller's name is the minimum check.",
        nextStepHint: "Next: Check for encumbrances (loans, mortgages on the land).",
      },
      {
        stepId: "property-buy-step-2",
        title: "Check for Encumbrances",
        instruction:
          "Search the Sub-Registry office Non-Encumbrance Certificate (NEC) to confirm the land has no existing mortgage, charge, or lien. Also check with local banks whether the seller has mortgaged the land.",
        documents: ["Khatian details", "Mouza name", "Dag (plot) number"],
        office: "Sub-Registry office (NEC section)",
        estimatedTime: "3–7 working days",
        cost: "BDT 200–500 per application",
        warningNote:
          "If NEC shows an existing mortgage, the land is pledged to a bank — purchasing without clearing the mortgage is legally risky.",
        nextStepHint: "Next: Negotiate price and draft Sale Agreement (Baina Nama).",
      },
      {
        stepId: "property-buy-step-3",
        title: "Sign Sale Agreement (Baina Nama)",
        instruction:
          "Execute a written Sale Agreement (Baina Nama) setting out: price, payment schedule, possession date, and conditions. Pay advance (bayana) — typically 10–30% of price. Baina Nama should be notarised and may be registered at Sub-Registry. Sets legal rights in case of default.",
        documents: [
          "Draft Baina Nama (sale agreement)",
          "NID of both buyer and seller",
          "Witness NIDs",
          "Agreed advance amount (cheque/bank transfer)",
        ],
        office: "Notary office | Sub-Registry (optional registration)",
        estimatedTime: "1 day",
        cost: "Notarisation: BDT 500–2,000 | Registration of Baina: BDT 1,000–5,000",
        warningNote:
          "Always pay advance via cheque or bank transfer — cash payment is difficult to prove in court if seller defaults.",
        nextStepHint: "Next: Prepare sale deed and calculate registration costs.",
      },
      {
        stepId: "property-buy-step-4",
        title: "Prepare Sale Deed",
        instruction:
          "Engage a licensed deed writer or lawyer to draft the sale deed (Kabala). The deed must accurately describe the land by Dag number, Khatian number, mouza, area, and boundaries. The deed must match the Khatian description exactly.",
        documents: [
          "Khatian and Dag details",
          "NID and TIN of buyer and seller",
          "Previous deed (certified copy)",
          "Baina Nama",
          "Agreed sale price",
        ],
        office: "Licensed deed writer | Lawyer",
        estimatedTime: "1–3 days",
        cost: "Deed writer fee: BDT 2,000–10,000",
        warningNote:
          "Errors in Dag or Khatian number in the deed cause legal complications during mutation — verify all details carefully before registration.",
        nextStepHint: "Next: Pay registration costs and register the deed at Sub-Registry.",
      },
      {
        stepId: "property-buy-step-5",
        title: "Pay Registration Costs",
        instruction:
          "Calculate and pay all registration-related taxes before the deed registration appointment. Costs in Dhaka: Stamp duty 1.5% + Registration fee 1% + Local govt tax 2% + AIT 4% = approximately 8.5% of deed value. Pay via bank challan (Sonali Bank or designated bank).",
        documents: [
          "Bank challan for: stamp duty, registration fee, local tax, AIT",
          "TIN of buyer",
          "Deed value declared",
        ],
        office: "Sonali Bank | Sub-Registry designated bank",
        estimatedTime: "1 day",
        cost:
          "Dhaka city: ~8.5% of deed value | Other city corp: ~7% | Municipality: ~5% | Rural: ~4%",
        warningNote:
          "AIT (Advance Income Tax) paid here is a tax credit — include it in your income tax return. Keep all challans.",
        nextStepHint: "Next: Register the deed at Sub-Registry office.",
      },
      {
        stepId: "property-buy-step-6",
        title: "Register Deed at Sub-Registry",
        instruction:
          "Attend Sub-Registry office with seller for deed registration. Both buyer and seller (or authorised attorneys) must be present with NIDs. Sub-Registrar verifies identities, witnesses sign deed, photographs taken. Deed registered and returned with registration endorsement.",
        documents: [
          "Original sale deed (2 copies)",
          "NID originals of buyer and seller",
          "All payment challans (stamp, reg fee, AIT, local tax)",
          "NID of 2 witnesses",
          "TIN certificate of buyer",
          "Previous deed (certified copy)",
        ],
        office: "Sub-Registry office (jurisdiction based on land location)",
        estimatedTime: "1 day (appointment needed in some offices)",
        cost: "Already paid in Step 5",
        warningNote:
          "Both parties must physically appear — or execute notarised Power of Attorney (POA) in advance. Sub-Registrar can reject deed if documents missing.",
        nextStepHint: "Next: Apply for mutation in your name at AC Land office.",
      },
      {
        stepId: "property-buy-step-7",
        title: "Mutation (Namjari) and Tax Transfer",
        instruction:
          "After deed registration, apply for mutation (namjari) at the AC Land office to transfer the land record into your name. Submit: registered deed, application, court fee. Mutation completes your legal ownership in government records. Also transfer land development tax (khajna) payment into your name.",
        documents: [
          "Registered deed (original)",
          "Application for mutation (namjari)",
          "Court fee: BDT 100–500",
          "Copy of Khatian",
          "NID of buyer",
        ],
        office: "AC Land office (Upazila/Union Land Office) for mutation | DC office for some cases",
        estimatedTime: "30–90 days",
        cost: "Court fee: BDT 100–500 | Unofficial facilitation may be requested — not mandatory",
        warningNote:
          "Mutation without registered deed is not legally valid. If mutation is delayed — follow up at AC Land office. Always get Mutation Khatian in writing.",
        nextStepHint:
          "✅ Purchase complete after mutation. Pay annual land development tax (khajna) each year to maintain record.",
      },
    ],
    finalNote:
      "✅ Land purchase complete. Keep all documents permanently: registered deed, mutation Khatian, all challans.\n\n**Annual obligation:** Pay land development tax (khajna) at Union Parishad / municipality each year.\n\n📄 Full property purchase guide with document templates — NLC can assist.",
    escalate: false,
  },

  // ══════════════════════════════════════════════════════════
  // 3. FIR AND CRIMINAL CASE
  // ══════════════════════════════════════════════════════════
  {
    scenarioId: "criminal-fir-process",
    area: "criminal",
    title: "Filing an FIR and Criminal Case Process",
    description: "Step-by-step guide for filing FIR and following through a criminal case in Bangladesh",
    triggerPhrases: [
      "how to file fir",
      "file a case police",
      "criminal case steps",
      "police complaint steps",
      "file complaint against someone",
      "থানায় মামলা করতে চাই",
      "এফআইআর কিভাবে করবো",
      "মামলার ধাপ",
    ],
    totalSteps: 5,
    steps: [
      {
        stepId: "fir-step-1",
        title: "File FIR at Police Station",
        instruction:
          "Go to the police station (thana) that has jurisdiction over the area where the crime occurred — not where you live. Describe the incident clearly to the Officer-in-Charge (OC). FIR must be written, read back to you, and signed by you. Insist on a copy of the FIR with GD (General Diary) number.",
        documents: [
          "NID (your own)",
          "Any evidence available (photos, screenshots, medical report if assault)",
          "Names and descriptions of accused if known",
        ],
        office: "Police station (thana) with territorial jurisdiction",
        estimatedTime: "Same day — officer must record FIR immediately under CrPC",
        warningNote:
          "If OC refuses to record FIR: file written complaint to SP (Superintendent of Police). OC is legally bound to record cognizable offences. Refusal = dereliction of duty.",
        nextStepHint: "Next: Police investigation begins automatically after FIR registration.",
      },
      {
        stepId: "fir-step-2",
        title: "Police Investigation",
        instruction:
          "After FIR, the Investigating Officer (IO) assigned to your case conducts investigation: visits crime scene, records witness statements, collects evidence, may arrest accused. Cooperate fully with IO. Provide all evidence and witness information promptly.",
        documents: [
          "Any additional evidence you collect (call records, CCTV footage, documents)",
          "Witness contact information",
        ],
        office: "Police station (investigation by IO)",
        estimatedTime: "15–180 days depending on case complexity",
        warningNote:
          "If IO is not investigating properly: file written complaint to SP or approach court for direction. You can apply to Magistrate Court for investigation order.",
        nextStepHint: "Next: IO files charge sheet or final report after investigation.",
      },
      {
        stepId: "fir-step-3",
        title: "Charge Sheet and Court Process",
        instruction:
          "If IO finds sufficient evidence: files Charge Sheet (CS) in Magistrate Court. If evidence insufficient: files Final Report (FR). If FR filed: you can file a Naraji petition objecting to FR within 30 days. If charge sheet filed: Magistrate takes cognizance and case proceeds to trial.",
        documents: [
          "Copy of FIR (GD number)",
          "Any certified documents from investigation",
        ],
        office: "Magistrate Court (Chief Metropolitan Magistrate / Chief Judicial Magistrate)",
        estimatedTime: "IO investigation: up to 120 days | Charge sheet filing: within investigation period",
        warningNote:
          "If Final Report (FR) filed and you disagree — you have 30 days to file a Naraji (protest petition). Missing this deadline means the case is dropped.",
        nextStepHint: "Next: Trial begins — prosecution and defence present evidence.",
      },
      {
        stepId: "fir-step-4",
        title: "Trial",
        instruction:
          "At trial: prosecution presents evidence and witnesses. Accused has right to cross-examine. Defence presents their case. You as complainant may be called as prosecution witness — attend all hearings. Engage a lawyer to represent the prosecution case alongside the public prosecutor.",
        documents: [
          "All original evidence",
          "Witness list",
          "Copy of FIR and charge sheet",
        ],
        office: "Magistrate Court (for offences up to 7 years imprisonment) | Sessions Court (for serious offences)",
        estimatedTime: "6 months – 5+ years depending on case complexity and court workload",
        warningNote:
          "Attend all hearing dates — absence can delay the case and in some cases lead to ex-parte proceedings. Engage a private lawyer alongside state prosecutor for better case management.",
        nextStepHint: "Next: Judgment — conviction or acquittal.",
      },
      {
        stepId: "fir-step-5",
        title: "Judgment and Appeal",
        instruction:
          "After trial: Magistrate or Sessions Judge delivers judgment. If conviction: sentence imposed (fine, imprisonment, or both). If acquittal: accused discharged. If unsatisfied with judgment: complainant can appeal to Sessions Court (from Magistrate decision) or High Court Division (from Sessions Court decision) within prescribed time.",
        documents: [
          "Certified copy of judgment (obtain from court)",
          "Appeal petition prepared by lawyer",
        ],
        office:
          "Sessions Court (appeal from Magistrate) | High Court Division (appeal from Sessions Court) | Appellate Division (final)",
        estimatedTime: "Judgment: after trial concludes | Appeal: file within 30–60 days of judgment",
        warningNote:
          "Appeal deadlines are strict — missing the limitation period bars the appeal entirely. Engage lawyer immediately after judgment if planning to appeal.",
        nextStepHint:
          "✅ Criminal case process complete. Keep all certified court documents permanently.",
      },
    ],
    finalNote:
      "⚠️ Criminal cases are complex — always engage a qualified criminal lawyer to assist at every stage.\n\nNLC can refer specialist criminal advocates for:\n• FIR assistance\n• Investigation monitoring\n• Trial representation\n• Appeal preparation",
    escalate: true,
    escalateReason:
      "Criminal cases require specialist criminal lawyer. WhatsApp NLC for referral.",
  },

  // ══════════════════════════════════════════════════════════
  // 4. TAX RETURN FILING
  // ══════════════════════════════════════════════════════════
  {
    scenarioId: "tax-return-filing",
    area: "tax",
    title: "Income Tax Return Filing (Individual)",
    description: "Step-by-step guide to file annual income tax return under Income Tax Act 2023",
    triggerPhrases: [
      "how to file tax return steps",
      "income tax return process",
      "tax return filing guide",
      "file my tax return step",
      "আয়কর রিটার্ন দাখিলের ধাপ",
      "রিটার্ন জমার প্রক্রিয়া",
      "income tax step by step",
    ],
    totalSteps: 5,
    steps: [
      {
        stepId: "tax-return-step-1",
        title: "Collect All Income Documents",
        instruction:
          "Gather all income documents for the tax year (1 July – 30 June). Salaried person: get salary certificate (Form 108A) from employer — employer is legally required to provide it. Self-employed: prepare income/expense summary. Other income: bank interest certificates, rental income details, dividend certificates.",
        documents: [
          "Form 108A — salary certificate from employer",
          "Bank statements (all accounts) for the year",
          "Bank interest/FD certificates",
          "Rental income details (rent receipts)",
          "Dividend certificates (from companies)",
          "Any other income documents",
        ],
        office: "From employer (Form 108A) | From banks | From companies (dividend)",
        estimatedTime: "1–7 days to collect all documents",
        warningNote:
          "Employer must provide Form 108A by July 31 each year. If employer does not provide: demand in writing. This is your legal right under Income Tax Act 2023.",
        nextStepHint: "Next: Gather investment proof to claim investment tax rebate.",
      },
      {
        stepId: "tax-return-step-2",
        title: "Gather Investment Proof for Rebate",
        instruction:
          "Collect documents for all qualifying investments made during the tax year — these reduce your tax by 15% of investment amount. Qualifying investments: Sanchayapatra (savings certificates), DPS receipts, life insurance premium receipts, provident fund contribution receipts, shares purchase statement.",
        documents: [
          "Sanchayapatra certificates / encashment receipts",
          "DPS passbook / statement",
          "Life insurance premium receipt",
          "Approved provident fund certificate",
          "Share purchase statements from broker",
          "Govt Treasury Bond certificates",
        ],
        office: "From relevant institutions (Post Office, Bank, Insurance Co., Broker)",
        estimatedTime: "1–3 days",
        warningNote:
          "Investment rebate cap: 15% of investment, maximum 3% of total income or BDT 10 lakh — whichever is lower. Declare investments to maximise rebate.",
        nextStepHint: "Next: Calculate your tax liability.",
      },
      {
        stepId: "tax-return-step-3",
        title: "Calculate Tax and Prepare Return",
        instruction:
          "Calculate total income from all sources. Apply slab rates (0%–25%). Deduct investment rebate (15% of qualifying investment). Calculate net tax payable. Check if advance tax or WHT already deducted exceeds tax due (if yes: claim refund). Prepare return form — simplified one-page form available for salaried persons with income below BDT 5 lakh.",
        documents: [
          "All income documents from Step 1",
          "All investment documents from Step 2",
          "Previous year return (for comparison)",
          "TIN certificate",
        ],
        office: "Can use NBR's online calculator at etaxnbr.gov.bd",
        estimatedTime: "1 day",
        warningNote:
          "If you have income from multiple sources or investment rebate to claim: use etaxnbr.gov.bd's calculation tool or get help from CA/tax consultant to avoid errors.",
        nextStepHint: "Next: Pay any tax due and file the return.",
      },
      {
        stepId: "tax-return-step-4",
        title: "Pay Tax Due",
        instruction:
          "If net tax calculated exceeds WHT already deducted: pay the balance before filing. Pay via: etaxnbr.gov.bd online payment (card, mobile banking, bank transfer) or bank challan at Sonali Bank. Keep payment receipt. If WHT already deducted is MORE than tax due: you will claim refund in the return — no payment needed.",
        documents: [
          "Tax calculation from Step 3",
          "Payment method (online / bank challan)",
        ],
        office: "etaxnbr.gov.bd (online payment) | Sonali Bank (challan)",
        estimatedTime: "Same day",
        cost: "Tax amount calculated in Step 3 | Minimum BDT 5,000 (city corp) / BDT 3,000 (other areas)",
        warningNote:
          "Pay tax BEFORE filing — the return system checks payment. Late payment after 30 November: 2% per month surcharge applies.",
        nextStepHint: "Next: Submit the return online or physically.",
      },
      {
        stepId: "tax-return-step-5",
        title: "Submit Return and Get Acknowledgement",
        instruction:
          "File the return at etaxnbr.gov.bd (online) or submit physical form at the Circle Tax Office under your TIN jurisdiction. Download the acknowledgement receipt immediately after online filing. Physical filing: get stamped copy of return as acknowledgement.",
        documents: [
          "Completed return form",
          "Tax payment challan",
          "TIN certificate",
          "Supporting documents (not attached to return — but keep for 6 years)",
        ],
        office: "etaxnbr.gov.bd (online) | Circle Tax Office (physical)",
        estimatedTime: "Same day | Deadline: 30 November each year",
        warningNote:
          "The acknowledgement receipt is your proof of compliance — needed for bank loans, visa applications, trade licence renewal. Download and store it.",
        nextStepHint:
          "✅ Return filed. Next year: repeat by 30 November.",
      },
    ],
    finalNote:
      "✅ Tax return complete. Keep acknowledgement receipt — valid proof of compliance for 1 year.\n\n**Annual deadline:** 30 November\n\n**Next steps:** If refund claimed → DCT will verify and issue refund in 1–3 months. If additional tax assessed → DCT will send notice — respond within deadline.\n\n📄 Full tax compliance guide — NLC can assist.",
    escalate: false,
  },

  // ══════════════════════════════════════════════════════════
  // 5. PARTNERSHIP FIRM RECONSTITUTION
  // ══════════════════════════════════════════════════════════
  {
    scenarioId: "partnership-reconstitution",
    area: "company",
    title: "Partnership Firm Reconstitution",
    description: "Step-by-step guide to reconstitute a partnership firm after partner exit, entry, or death",
    triggerPhrases: [
      "reconstitute partnership",
      "partner leaving firm",
      "change partners rjsc",
      "partnership reconstitution",
      "partner exit firm",
      "partner died firm",
      "add partner firm",
      "অংশীদারিত্ব পুনর্গঠন",
      "পার্টনার পরিবর্তন",
    ],
    totalSteps: 5,
    steps: [
      {
        stepId: "recon-step-1",
        title: "Execute Reconstitution Deed",
        instruction:
          "Draft and execute a Deed of Reconstitution (also called Supplemental Deed) signed by all continuing partners and the retiring/incoming partner. The deed must specify: retiring partner's name and share, effective date of exit, settlement of capital, new profit/loss ratio among continuing partners, and confirmation that firm continues.",
        documents: [
          "Existing registered partnership deed",
          "Deed of Reconstitution (new)",
          "Capital settlement agreement",
          "NIDs of all partners",
          "Resignation letter from retiring partner (if voluntary)",
        ],
        office: "Signed at lawyer's office | Notarised",
        estimatedTime: "1–3 days to draft and execute",
        cost: "Lawyer/CA fee: BDT 5,000–20,000",
        warningNote:
          "The deed must be signed by the retiring partner — if they refuse to sign, legal action may be required before reconstitution can proceed.",
        nextStepHint: "Next: Hold Partners' Meeting and record minutes of reconstitution decision.",
      },
      {
        stepId: "recon-step-2",
        title: "Partners' Meeting and Minutes",
        instruction:
          "Hold a formal Partners' Meeting. Pass resolution confirming: (1) retirement/entry of partner, (2) new profit/loss ratio, (3) authority of continuing Managing Partner, (4) bank signatory update. Record signed minutes.",
        documents: [
          "Minutes of Partners' Meeting",
          "Signatures of all continuing partners",
          "New profit/loss ratio table",
        ],
        office: "Firm's office / any agreed location",
        estimatedTime: "1 day",
        warningNote:
          "Minutes must be dated correctly — the reconstitution date in minutes must match the Deed of Reconstitution effective date.",
        nextStepHint: "Next: File reconstitution documents with RJSC.",
      },
      {
        stepId: "recon-step-3",
        title: "File Amendment at RJSC",
        instruction:
          "File the Deed of Reconstitution and updated Form I at RJSC to amend the partnership registration. RJSC will update the certificate to reflect the new partner composition. Filing must be done within 90 days of reconstitution date.",
        documents: [
          "Form I (amended partnership application)",
          "Deed of Reconstitution (original + 2 copies)",
          "Partners' Meeting minutes",
          "Updated partner list with NID copies",
          "Current firm TIN",
          "Existing registration certificate (original)",
        ],
        office: "RJSC (Registrar of Joint Stock Companies, Dhaka or regional offices)",
        estimatedTime: "RJSC processing: 7–15 working days",
        cost: "RJSC amendment fee: BDT 1,000–3,000",
        warningNote:
          "If RJSC filing is delayed beyond 90 days: penalty applies. File even if late — an unfiled reconstitution leaves the retired partner on the legal record.",
        nextStepHint: "Next: Update bank signatories and notify regulatory authorities.",
      },
      {
        stepId: "recon-step-4",
        title: "Update Bank and Notify Authorities",
        instruction:
          "Update the firm's bank account signatories with the new partner composition: submit board resolution equivalent (Partners' Meeting minutes) + Deed of Reconstitution + new partner's NID to the bank. Also notify: NBR (tax office) by filing updated TIN form, and any other regulators (BIDA if registered, trade licence authority).",
        documents: [
          "Partners' Meeting minutes",
          "Deed of Reconstitution",
          "NID of new Managing Partner",
          "Updated TIN form",
          "RJSC amended certificate (once received)",
        ],
        office:
          "Bank branch | NBR Circle Tax Office | BIDA (if applicable) | City Corporation / Municipality (trade licence)",
        estimatedTime: "Bank update: 3–7 days | NBR: 7–15 days",
        warningNote:
          "Do not use old signatories after reconstitution — the retired partner can still operate the account until bank records are updated. Prioritise bank update.",
        nextStepHint: "Next: Complete capital settlement with the retiring partner.",
      },
      {
        stepId: "recon-step-5",
        title: "Capital Settlement with Retiring Partner",
        instruction:
          "Pay the retiring partner their capital account balance + undistributed profit share as agreed in the Deed of Reconstitution. Payment via bank transfer. Get a No-Claim Certificate from the retiring partner confirming full settlement. File amended tax return if capital settlement changes firm's tax position.",
        documents: [
          "Capital account calculation",
          "Bank transfer receipt",
          "No-Claim Certificate from retiring partner",
          "Updated profit/loss ratio (for continuing partners' tax returns)",
        ],
        office: "Bank | Retiring partner | CA (for capital calculation)",
        estimatedTime: "As per deed agreement (typically 30–90 days)",
        cost: "Capital settlement amount as agreed",
        warningNote:
          "Without a written No-Claim Certificate — the retiring partner can later claim additional amounts. Always get it in writing and signed.",
        nextStepHint: "✅ Reconstitution complete. Firm continues with new partner composition.",
      },
    ],
    finalNote:
      "✅ Partnership reconstitution complete. Firm continues legally under new composition.\n\n**Post-reconstitution:**\n• File firm's next income tax return under new partner composition\n• Update all letterheads and documents\n• Ensure retiring partner's personal tax return excludes firm income from reconstitution date\n\n📄 Full reconstitution document drafting — NLC can assist.",
    escalate: true,
    escalateReason:
      "Partnership reconstitution involves legal drafting and RJSC filing. WhatsApp NLC for full document preparation.",
  },

  // ══════════════════════════════════════════════════════════
  // 6. BAIL APPLICATION
  // ══════════════════════════════════════════════════════════
  {
    scenarioId: "criminal-bail",
    area: "criminal",
    title: "Bail Application Process",
    description: "Step-by-step process for applying for bail in Bangladesh courts",
    triggerPhrases: [
      "how to get bail",
      "bail application steps",
      "bail procedure bangladesh",
      "apply for bail",
      "bail court process",
      "জামিনের আবেদন",
      "জামিন পাওয়ার উপায়",
      "জামিন প্রক্রিয়া",
    ],
    totalSteps: 4,
    steps: [
      {
        stepId: "bail-step-1",
        title: "Determine Bail Type and Court",
        instruction:
          "First determine whether the offence is bailable or non-bailable. Bailable offences (Schedule II of CrPC — lighter offences): accused has right to bail — police can grant at police station. Non-bailable offences (serious crimes — murder, rape, dacoity): only a Magistrate or Sessions Judge can grant bail. For anticipatory bail (before arrest): apply to Sessions Court or High Court.",
        documents: ["Copy of FIR / GD number", "Name of offence charged"],
        office: "Police Station (bailable) | Magistrate Court | Sessions Court | High Court Division",
        estimatedTime: "Bailable: immediate | Non-bailable: 1–7 days",
        warningNote:
          "Non-bailable offence bail is discretionary — court considers: nature of offence, criminal record, flight risk, likelihood of tampering with evidence. Engage lawyer before appearing.",
        nextStepHint: "Next: Engage a criminal lawyer and prepare bail application.",
      },
      {
        stepId: "bail-step-2",
        title: "Prepare and File Bail Petition",
        instruction:
          "Engage a criminal lawyer to draft the bail petition. The petition must state: name of accused, offence, grounds for bail (health, livelihood, clean record, cooperation with investigation, weak evidence), and bail conditions offered. File petition in the appropriate court (Magistrate/Sessions/High Court).",
        documents: [
          "Bail petition (drafted by lawyer)",
          "Copy of FIR",
          "NID of accused",
          "Character certificates if available",
          "Medical certificates if health ground",
          "Surety details (bail bond guarantor)",
        ],
        office: "Court filing section | Magistrate / Sessions / High Court",
        estimatedTime: "Filing: 1 day | Hearing: 1–7 days after filing",
        cost: "Lawyer fee: BDT 5,000–50,000+ depending on court level and case seriousness",
        warningNote:
          "Bail petition quality matters significantly — a well-argued petition with strong grounds succeeds; a poorly drafted one is rejected. Engage an experienced criminal lawyer.",
        nextStepHint: "Next: Court hearing on bail application.",
      },
      {
        stepId: "bail-step-3",
        title: "Bail Hearing",
        instruction:
          "At the hearing: accused's lawyer argues grounds for bail. Prosecution (Public Prosecutor or complainant's lawyer) may oppose. Judge considers: severity of offence, evidence strength, accused's record, flight risk, and public interest. If granted: court sets bail amount (bond) and conditions.",
        documents: ["All documents from Step 2", "Lawyer presence mandatory"],
        office: "Magistrate / Sessions / High Court",
        estimatedTime: "Hearing: 30 minutes–2 hours | Decision: same day or next hearing",
        warningNote:
          "For serious offences (murder, rape, corruption): Magistrate may not have jurisdiction to grant bail — must go to Sessions Court. For High Court bail: requires senior advocate.",
        nextStepHint: "Next: If bail granted — execute bail bond with surety.",
      },
      {
        stepId: "bail-step-4",
        title: "Execute Bail Bond",
        instruction:
          "If bail granted: execute bail bond in court. Surety (guarantor) must appear in court with their NID and proof of property/assets (to value of bail bond amount). Accused signs personal bond. After bond executed: court issues release order to jail/police. Accused released.",
        documents: [
          "Bail order (court certified copy)",
          "Surety's NID",
          "Surety's property documents (if property bail bond)",
          "Surety's bank statement (if cash bond)",
          "Accused's NID",
        ],
        office: "Court filing section | Jail (release order delivered here)",
        estimatedTime: "Bond execution: same day | Release from jail: within 24 hours of order",
        warningNote:
          "Accused must comply with all bail conditions (attend all hearings, not leave jurisdiction without permission, not contact witnesses). Violation = bail cancelled + re-arrest.",
        nextStepHint:
          "✅ Bail secured. Attend all court dates — missing hearings cancels bail automatically.",
      },
    ],
    finalNote:
      "⚠️ Bail conditions must be strictly followed:\n• Attend every court hearing date\n• Do not leave the country without court permission\n• Do not contact prosecution witnesses\n• Surrender passport if ordered\n\nViolating bail conditions → immediate re-arrest and bail cancelled.\n\n**NLC can refer:** Specialist criminal advocates for bail hearings.",
    escalate: true,
    escalateReason:
      "Bail applications require experienced criminal lawyer. WhatsApp NLC for urgent referral.",
  },
];

// ─── Session State (in-memory per request — stateless) ─────────

export interface ScenarioSession {
  scenarioId: string;
  currentStepIndex: number;   // 0-indexed internally
}

// ─── Core Functions ────────────────────────────────────────────

/**
 * Try to match the user's message to a scenario.
 * Returns the matched scenario and step, or {matched: false}.
 */
export function matchScenario(
  message: string,
  session?: ScenarioSession
): ScenarioQueryResult {
  const msg = message.toLowerCase();

  // If an active session provided, continue that scenario
  if (session) {
    const scenario = SCENARIOS.find((s) => s.scenarioId === session.scenarioId);
    if (scenario) {
      return buildScenarioResult(scenario, session.currentStepIndex);
    }
  }

  // Otherwise try to match by trigger phrases
  for (const scenario of SCENARIOS) {
    const triggered = scenario.triggerPhrases.some(
      (phrase) => msg.includes(phrase)
    );
    if (triggered) {
      return buildScenarioResult(scenario, 0);
    }
  }

  // Also try area-based detection for "steps" or "process" requests
  const area = detectArea(message);
  const isProcessRequest =
    msg.includes("step") ||
    msg.includes("steps") ||
    msg.includes("process") ||
    msg.includes("procedure") ||
    msg.includes("how to") ||
    msg.includes("ধাপ") ||
    msg.includes("প্রক্রিয়া");

  if (area && isProcessRequest) {
    const areaScenario = SCENARIOS.find((s) => s.area === area);
    if (areaScenario) {
      return buildScenarioResult(areaScenario, 0);
    }
  }

  return { matched: false };
}

/**
 * Advance to the next step in a scenario session.
 * Returns updated ScenarioResult or completion.
 */
export function nextStep(
  scenarioId: string,
  currentStepIndex: number
): ScenarioQueryResult {
  const scenario = SCENARIOS.find((s) => s.scenarioId === scenarioId);
  if (!scenario) return { matched: false };

  const nextIndex = currentStepIndex + 1;
  if (nextIndex >= scenario.steps.length) {
    // Already at final step — return completion
    return buildScenarioResult(scenario, scenario.steps.length - 1, true);
  }
  return buildScenarioResult(scenario, nextIndex);
}

/**
 * Go back to previous step.
 */
export function prevStep(
  scenarioId: string,
  currentStepIndex: number
): ScenarioQueryResult {
  const scenario = SCENARIOS.find((s) => s.scenarioId === scenarioId);
  if (!scenario) return { matched: false };
  const prevIndex = Math.max(0, currentStepIndex - 1);
  return buildScenarioResult(scenario, prevIndex);
}

/**
 * Jump directly to a specific step.
 */
export function goToStep(
  scenarioId: string,
  stepIndex: number
): ScenarioQueryResult {
  const scenario = SCENARIOS.find((s) => s.scenarioId === scenarioId);
  if (!scenario) return { matched: false };
  const clampedIndex = Math.max(0, Math.min(stepIndex, scenario.steps.length - 1));
  return buildScenarioResult(scenario, clampedIndex);
}

/**
 * Get all available scenario titles and IDs (for listing).
 */
export function listScenarios(): { scenarioId: string; title: string; area: LawArea }[] {
  return SCENARIOS.map((s) => ({
    scenarioId: s.scenarioId,
    title: s.title,
    area: s.area,
  }));
}

// ─── Internal Builder ──────────────────────────────────────────

function buildScenarioResult(
  scenario: Scenario,
  stepIndex: number,
  forceComplete = false
): ScenarioResult {
  const step = scenario.steps[stepIndex];
  const isComplete = forceComplete || stepIndex === scenario.steps.length - 1;
  const stepNumber = stepIndex + 1;
  const progressPercent = Math.round((stepNumber / scenario.totalSteps) * 100);

  const summary = formatScenarioStep(scenario, step, stepNumber, isComplete);

  return {
    matched: true,
    scenario,
    currentStep: step,
    stepNumber,
    totalSteps: scenario.totalSteps,
    progressPercent,
    isComplete,
    summary,
  };
}

function formatScenarioStep(
  scenario: Scenario,
  step: ScenarioStep,
  stepNumber: number,
  isComplete: boolean
): string {
  const progress = `▶ Step ${stepNumber} of ${scenario.totalSteps}`;
  const progressBar = buildProgressBar(stepNumber, scenario.totalSteps);

  let out = `### ${scenario.title}\n`;
  out += `${progressBar} ${progress}\n\n`;
  out += `## Step ${stepNumber}: ${step.title}\n\n`;
  out += `${step.instruction}\n`;

  if (step.documents && step.documents.length > 0) {
    out += `\n**Documents needed:**\n`;
    step.documents.forEach((doc) => { out += `• ${doc}\n`; });
  }

  if (step.office) {
    out += `\n**Where:** ${step.office}`;
  }

  if (step.estimatedTime) {
    out += `\n**Time:** ${step.estimatedTime}`;
  }

  if (step.cost) {
    out += `\n**Cost:** ${step.cost}`;
  }

  if (step.warningNote) {
    out += `\n\n⚠️ **Important:** ${step.warningNote}`;
  }

  if (!isComplete && step.nextStepHint) {
    out += `\n\n💡 ${step.nextStepHint}`;
    out += `\n\n_Reply **"next"** to continue to Step ${stepNumber + 1}._`;
  }

  if (isComplete) {
    out += `\n\n---\n${scenario.finalNote}`;
    if (scenario.escalate && scenario.escalateReason) {
      out += `\n\n⚠️ **Professional help recommended:** ${scenario.escalateReason}`;
    }
  }

  return out;
}

function buildProgressBar(current: number, total: number): string {
  const filled = Math.round((current / total) * 10);
  const empty = 10 - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}

/**
 * Detect if a message is a "next step" command.
 */
export function isNextStepCommand(message: string): boolean {
  const msg = message.toLowerCase().trim();
  return (
    msg === "next" ||
    msg === "next step" ||
    msg === "continue" ||
    msg === "পরবর্তী" ||
    msg === "পরের ধাপ" ||
    msg.startsWith("next step") ||
    msg === "go on" ||
    msg === "ok next" ||
    msg === "proceed"
  );
}

/**
 * Detect if a message is a "previous step" command.
 */
export function isPrevStepCommand(message: string): boolean {
  const msg = message.toLowerCase().trim();
  return (
    msg === "back" ||
    msg === "previous" ||
    msg === "previous step" ||
    msg === "আগের ধাপ" ||
    msg === "go back"
  );
}
