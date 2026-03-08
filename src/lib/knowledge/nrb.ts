// ─── NRB Cross-Border Knowledge Module ───────────────────────
// Source: NLC Practice — Nazmul, NLC counsel
// Built from: Sahara Crafts / Taimoor & Rosna advisory session
// Last verified: 2025-03-08
// NLC sign-off required before any rule change goes live

import type { KnowledgeModule, LegalRule, QAEntry } from "./types";

// ─── Rules ────────────────────────────────────────────────────
const rules: LegalRule[] = [
  {
    id: "nrb-wht-001",
    area: "nrb",
    jurisdiction: "BD",
    title: "WHT Rate — NRB Partnership Income (With TIN)",
    rule: "Withholding tax on profit distributions to non-resident individuals from a Bangladesh partnership is deducted at source at 20% under the Income Tax Act 2023.",
    source: "Income Tax Act 2023, NBR WHT Schedule",
    certainty: "confirmed",
    tags: ["withholding tax", "wht", "nrb", "partnership", "profit", "distribution", "20%"],
    lastVerified: "2025-03-08",
    nlcNote: "Rate subject to annual NBR revision. Verify current rate each tax year.",
  },
  {
    id: "nrb-wht-002",
    area: "nrb",
    jurisdiction: "BD",
    title: "WHT Rate — NRB Without Bangladesh e-TIN (30% Penalty Rate)",
    rule: "If the non-resident payee does not hold a valid Bangladesh e-TIN at the time of payment, the firm must deduct WHT at 30% instead of the standard 20%. This 10% premium applies until TIN is registered.",
    source: "Income Tax Act 2023, TIN mandatory deduction provisions",
    certainty: "confirmed",
    tags: ["tin", "etin", "30%", "penalty", "withholding", "nrb", "no tin"],
    lastVerified: "2025-03-08",
    nlcNote: "TIN registration is the single highest-value immediate action for any NRB partner. Saves 10% on every distribution permanently.",
  },
  {
    id: "nrb-dtaa-001",
    area: "nrb",
    jurisdiction: "BD+US",
    title: "No DTAA Between Bangladesh and USA",
    rule: "There is currently no Double Taxation Avoidance Agreement between Bangladesh and the United States. NRB partners from the USA cannot use treaty provisions to reduce Bangladesh WHT rates.",
    source: "NBR DTAA register — Bangladesh-USA",
    certainty: "confirmed",
    tags: ["dtaa", "treaty", "usa", "double taxation", "no treaty", "bangladesh usa"],
    lastVerified: "2025-03-08",
    nlcNote: "Any WHT deducted in Bangladesh must be managed through the US foreign tax credit system on the IRS side.",
  },
  {
    id: "nrb-export-exemption-001",
    area: "nrb",
    jurisdiction: "BD",
    title: "Handicraft Export Income — Potential WHT Exemption",
    rule: "Income from export of handicraft products may qualify for Bangladesh income tax exemption. There is a reasonable legal argument that NRB partners' share of such exempt export income should also not attract WHT — but this requires a specific NBR clarification ruling.",
    source: "Income Tax Act 2023 — export exemption provisions",
    certainty: "arguable",
    tags: ["handicraft", "export", "exemption", "tax free", "wht exempt", "nrb export"],
    lastVerified: "2025-03-08",
    nlcNote: "File NBR clarification petition before first distribution. Favourable ruling could eliminate WHT on substantial portion of profits.",
  },
  {
    id: "nrb-resident-window-001",
    area: "nrb",
    jurisdiction: "BD",
    title: "Bangladesh Resident Treatment — NID Holder in USA",
    rule: "A Bangladeshi national holding a Bangladesh NID who has not formally declared NRB status remains treated as a Bangladesh resident by NBR. Resident individuals are taxed at slab rates, not the flat 20% NRB WHT rate. This may be a significant tax advantage while the window lasts.",
    source: "Income Tax Act 2023 — residency definitions",
    certainty: "arguable",
    tags: ["resident", "nid", "nrb", "residency", "tax resident", "bangladesh resident", "182 days"],
    lastVerified: "2025-03-08",
    nlcNote: "Window closes once US documentation finalises or 182-day threshold is crossed. Urgent structuring advice required.",
  },
  {
    id: "nrb-bida-001",
    area: "nrb",
    jurisdiction: "BD",
    title: "BIDA Registration — NRB Investor Requirement",
    rule: "An NRB investing capital in a Bangladesh partnership must register their investment with BIDA (Bangladesh Investment Development Authority) after the foreign remittance is received and an encashment certificate is obtained from the authorised dealer bank. Without BIDA registration, repatriation of capital and profits through Bangladesh Bank is not permitted.",
    source: "Foreign Private Investment (Promotion and Protection) Act 1980, BIDA Act 2016",
    certainty: "confirmed",
    tags: ["bida", "investment registration", "repatriation", "nrb investment", "encashment certificate"],
    lastVerified: "2025-03-08",
    nlcNote: "BIDA registration is for the investor personally — not the firm. Must be done after remittance arrives, not before.",
  },
  {
    id: "nrb-fbar-001",
    area: "nrb",
    jurisdiction: "US",
    title: "FBAR Filing — US Person with Bangladesh Bank Account Authority",
    rule: "A US person who has signatory authority over, or a financial interest in, a foreign bank account where the aggregate value exceeds USD 10,000 at any point during the calendar year must file FinCEN Form 114 (FBAR) annually by April 15.",
    source: "Bank Secrecy Act, 31 CFR 1010.350",
    certainty: "confirmed",
    tags: ["fbar", "fincen", "114", "foreign bank", "10000", "us person", "annual filing"],
    lastVerified: "2025-03-08",
    nlcNote: "NLC handles BD side only. US attorney required for FBAR filing. Penalty starts USD 10,000 per violation for non-wilful failure.",
  },
  {
    id: "nrb-form8865-001",
    area: "nrb",
    jurisdiction: "US",
    title: "IRS Form 8865 — US Person in Foreign Partnership",
    rule: "A US person holding an interest in a foreign partnership must file Form 8865. A partner holding more than 50% is a Category 1 filer (controlling interest). A partner holding between 10-50% is a Category 2 filer (significant interest). Both categories have mandatory annual IRS filing obligations.",
    source: "IRC §6038, Form 8865 Instructions",
    certainty: "confirmed",
    tags: ["form 8865", "irs", "foreign partnership", "us person", "category 1", "category 2", "controlling interest"],
    lastVerified: "2025-03-08",
    nlcNote: "NLC handles BD side documentation package for US attorney. 55% partner = Category 1. 45% partner = Category 2.",
  },
];

// ─── Q&A Bank ─────────────────────────────────────────────────
const qaBank: QAEntry[] = [
  {
    id: "nrb-qa-001",
    area: "nrb",
    jurisdiction: "BD",
    triggerKeywords: ["tin", "etin", "tax id", "register tin", "need tin", "nrb tin"],
    question: "Does an NRB partner need a Bangladesh TIN?",
    irac: {
      issue: "Whether a non-resident Bangladeshi partner in a Bangladesh firm is required to hold a Bangladesh e-TIN, and what the consequence is of not having one.",
      rule: "Under the Income Tax Act 2023, if the non-resident payee does not hold a valid Bangladesh e-TIN at the time of profit distribution, the firm must deduct withholding tax at 30% instead of the standard 20%.",
      application: "As an NRB partner, every time the firm distributes profits to you, the firm deducts WHT at source. Without a TIN, that deduction is 30% — meaning you lose 30 taka of every 100 taka earned before it reaches you. With a TIN registered, the rate drops to 20%. On a BDT 10 lakh distribution, that is BDT 1 lakh difference.",
      conclusion: "Register your Bangladesh e-TIN immediately at nbr.gov.bd before the first distribution is made. You only need your passport. NLC can assist with this registration.",
    },
    escalate: false,
    relatedRules: ["nrb-wht-001", "nrb-wht-002"],
    lastVerified: "2025-03-08",
  },
  {
    id: "nrb-qa-002",
    area: "nrb",
    jurisdiction: "BD+US",
    triggerKeywords: ["double tax", "taxed twice", "both countries", "usa tax", "bangladesh tax", "dtaa", "treaty"],
    question: "Will I be taxed in both Bangladesh and the USA on the same income?",
    irac: {
      issue: "Whether an NRB partner in a Bangladesh firm faces double taxation on the same partnership income in both Bangladesh and the United States, and whether any treaty protection exists.",
      rule: "Bangladesh taxes non-resident income at source via WHT (20% with TIN). The USA taxes its residents and citizens on worldwide income. There is currently no Double Taxation Avoidance Agreement between Bangladesh and the USA.",
      application: "Yes — you face tax in both countries on the same income. Bangladesh deducts 20% WHT before remitting your profits. The USA then taxes the same income on your Form 1040 as ordinary income. However, the 20% paid to Bangladesh can be claimed as a Foreign Tax Credit on your US return, reducing — but not eliminating — the double taxation effect.",
      conclusion: "You will be taxed in both countries. The Bangladesh WHT you pay reduces your US tax liability through the foreign tax credit, but the mechanics require careful handling by a US international tax attorney. NLC handles the Bangladesh side and prepares the documentation package for your US attorney.",
    },
    escalate: true,
    escalateReason: "US tax side requires qualified US international tax attorney. NLC handles Bangladesh side only.",
    relatedRules: ["nrb-wht-001", "nrb-dtaa-001"],
    lastVerified: "2025-03-08",
  },
  {
    id: "nrb-qa-003",
    area: "nrb",
    jurisdiction: "BD",
    triggerKeywords: ["bida", "investment register", "repatriate", "send money back", "get money out", "profit out"],
    question: "How does an NRB get profits out of Bangladesh legally?",
    irac: {
      issue: "What legal process must an NRB partner follow to repatriate partnership profits from Bangladesh to their country of residence.",
      rule: "Under the Foreign Private Investment Act 1980 and BIDA Act 2016, NRB investors must register their investment with BIDA after the initial capital remittance is received. Bangladesh Bank permits repatriation of profits through authorised dealer banks once WHT obligations are met and BIDA registration is in place.",
      application: "For an NRB partner in a Bangladesh firm: (1) Send capital contribution via bank wire to firm's Bangladesh account; (2) Collect encashment certificate from authorised dealer bank; (3) Register with BIDA using the encashment certificate; (4) Each time profits are distributed, firm deducts WHT and issues deduction certificate; (5) Repatriation is processed through the authorised dealer bank with BIDA certificate and WHT clearance.",
      conclusion: "BIDA registration is not optional — it is the legal gateway to getting your money out of Bangladesh. Without it, Bangladesh Bank will not approve repatriation. NLC manages the full repatriation compliance process on your behalf.",
    },
    escalate: false,
    relatedRules: ["nrb-bida-001", "nrb-wht-001"],
    lastVerified: "2025-03-08",
  },
  {
    id: "nrb-qa-004",
    area: "nrb",
    jurisdiction: "BD",
    triggerKeywords: ["export tax", "handicraft exempt", "export exempt", "no tax export", "craft export tax"],
    question: "Is handicraft export income tax free for NRB partners?",
    irac: {
      issue: "Whether an NRB partner's share of income from handicraft exports qualifies for Bangladesh tax exemption and is therefore not subject to withholding tax.",
      rule: "Bangladesh law provides tax exemption for certain export income including handicrafts. However, whether this exemption extends to the NRB partner's share of that income — reducing WHT from 20% to zero — is not definitively settled and requires an NBR clarification ruling.",
      application: "If Sahara Crafts earns BDT 50 lakh from handicraft exports that qualify for the exemption, the argument is that the NRB partner's 45% share (BDT 22.5 lakh) should also carry that exemption and not attract WHT. This is a legitimate legal argument — but one that must be formally validated by NBR before relying on it.",
      conclusion: "Do not assume zero WHT on export income without an NBR ruling. File a formal clarification petition with NBR first. If successful, the saving on each distribution is significant. NLC prepares and files this petition on your behalf.",
    },
    escalate: true,
    escalateReason: "NBR clarification petition required before acting on this. NLC must file formal application.",
    relatedRules: ["nrb-export-exemption-001", "nrb-wht-001"],
    lastVerified: "2025-03-08",
  },
];

// ─── Module Export ────────────────────────────────────────────
const nrbModule: KnowledgeModule = {
  area: "nrb",
  label: "NRB & Cross-Border Law",
  description:
    "Legal rules and guidance for Non-Resident Bangladeshis doing business in Bangladesh — covering WHT, BIDA, repatriation, DTAA, and US reporting obligations.",
  rules,
  qaBank,
};

export default nrbModule;
