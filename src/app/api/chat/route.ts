// ─── JesAI API Route — Bilingual, All Civil & Criminal ───────
import { NextRequest, NextResponse } from "next/server";
import { queryKnowledge } from "@/lib/knowledge";

function detectLanguage(text: string): "bn" | "en" {
  return /[\u0980-\u09FF]/.test(text) ? "bn" : "en";
}

function detectArea(msg: string): string | null {
  const m = msg.toLowerCase();
  const map: Record<string, string[]> = {
    property: ["land","property","deed","mutation","khatian","plot","lease","mortgage","tenancy","eviction","registration","namajaari","title","boundary","encroach","inheritance","heir","partition","flat","apartment","cheque bounce","cheque","baynama","rajuk","rehab","builder","loan default","foreclosure","artha rin","khas","char","erosion","shafi","preemption","forged deed","adverse possession","probate","will","succession","জমি","সম্পত্তি","দলিল","নামজারি","খতিয়ান","বন্ধক","ভাড়া","উচ্ছেদ","উত্তরাধিকার","ওয়ারিশ","ফ্ল্যাট","চেক","বায়নামা","রাজউক","খাস","চর","শুফা","উইল","প্রবেট"],
    criminal: ["arrest","fir","police","crime","bail","accused","murder","theft","assault","rape","kidnap","drug","fraud","corruption","warrant","remand","magistrate","complaint","গ্রেফতার","এফআইআর","পুলিশ","অপরাধ","জামিন","আসামি","হত্যা","চুরি","ধর্ষণ","অপহরণ","মাদক","প্রতারণা","রিমান্ড","ম্যাজিস্ট্রেট"],
    family: ["divorce","marriage","talaq","custody","maintenance","dower","mehr","wife","husband","nikah","dowry","khula","family court","বিবাহবিচ্ছেদ","বিয়ে","তালাক","হেফাজত","ভরণপোষণ","দেনমোহর","স্বামী","স্ত্রী","নিকাহ","যৌতুক","খোলা","পারিবারিক"],
    labour: ["job","employment","salary","fired","termination","worker","employee","gratuity","provident fund","resignation","dismissal","চাকরি","বেতন","বরখাস্ত","শ্রমিক","গ্র্যাচুইটি","পদত্যাগ","শ্রম আইন"],
    company: ["company","rjsc","incorporation","pvt ltd","director","shareholder","memorandum","partnership","business registration","কোম্পানি","আরজেএসসি","অংশীদারিত্ব","ব্যবসা নিবন্ধন"],
    tax: ["tax","vat","nbr","income tax","tin","return","withholding","challan","কর","ভ্যাট","আয়কর","টিআইএন","রিটার্ন"],
    nrb: ["nrb","non-resident","overseas","repatriate","bida","wht","dtaa","fbar","foreign investment","প্রবাসী","রেমিট্যান্স","বিদা","দ্বৈত কর"],
    constitutional: ["constitution","writ","high court","fundamental rights","freedom","arbitrary detention","habeas corpus","সংবিধান","রিট","হাইকোর্ট","মৌলিক অধিকার","গ্রেফতার অবৈধ"],
    consumer: ["consumer","product defect","cheated","refund","fake product","ভোক্তা","নকল পণ্য","ধোঁকা","ফেরত"],
    cyber: ["digital","cyber","hacking","online fraud","social media","defamation online","ডিজিটাল","সাইবার","হ্যাকিং","অনলাইন প্রতারণা"],
  };
  for (const [area, words] of Object.entries(map)) {
    if (words.some(w => m.includes(w))) return area;
  }
  return null;
}

const R: Record<string, Record<string, string>> = {
  en: {
    property: `**Land & Property Law — Bangladesh**

**Applicable Laws:**
• Transfer of Property Act 1882 • Registration Act 1908
• State Acquisition & Tenancy Act 1950 • Land Survey Tribunal Act 2023
• Limitation Act 1908 — 12 years for possession suits

**Key Steps:**
1. Collect deed, khatian (CS/RS/BS), mutation records, tax receipts
2. Verify at AC Land office or land.gov.bd
3. Dispute → Civil Court | Mutation → Upazila Land Office
4. Registration issues → Sub-Registrar office

📋 Document list — ৳99–399 | 📄 Procedure guide — ৳999–4,999
⚠️ Information only. For representation consult a Bar Council advocate.`,

    criminal: `**Criminal Law — Bangladesh**

**Applicable Laws:**
• Penal Code 1860 • CrPC 1898 • Evidence Act 1872
• Digital Security Act 2018 • Women & Children Repression Prevention Act 2000
• Narcotics Control Act 1990 • Anti-Corruption Commission Act 2004

**If you are a victim:**
1. File FIR at nearest Police Station
2. Police investigates → charge sheet → Magistrate/Sessions Court
3. Can also file direct complaint at Magistrate Court

**If you are accused:**
1. Bailable offence → bail is a right (police or Magistrate)
2. Non-bailable → apply to Sessions Judge
3. False case → apply for anticipatory bail at High Court
4. Right to silence + right to lawyer — use them

**Remand:** Max 15 days total. Challenge in court if excessive.

📋 Document list — ৳99–299 | 📄 Procedure guide — ৳999–2,999
⚠️ Engage an advocate immediately for any criminal matter.`,

    family: `**Family Law — Bangladesh**

**Applicable Laws:**
• Muslim Family Laws Ordinance 1961 • Family Courts Ordinance 1985
• Guardians and Wards Act 1890 • Dowry Prohibition Act 1980

**Divorce (Talaq by husband):** Notice to Union Parishad Chairman → 90-day reconciliation
**Khula (wife-initiated):** Petition in Family Court
**Maintenance & Custody:** Family Court — child welfare is primary
**Dower (Mehr):** Enforceable as debt in Family Court

📋 Document list — ৳99–299 | 📄 Procedure guide — ৳999–2,999
⚠️ For representation consult a Bar Council advocate.`,

    labour: `**Labour Law — Bangladesh**

**Applicable Laws:**
• Bangladesh Labour Act 2006 (amended 2013, 2018) • Labour Rules 2015

**Your Rights:**
• Notice period: minimum 30 days (or pay in lieu)
• Gratuity: 30 days per year of service (after 1 year)
• Wrongful termination → compensation entitlement

**Steps:**
1. Wrongful termination → Labour Court within 30 days
2. Unpaid wages → Dept of Inspection for Factories
3. Gratuity/PF → employer first, then Labour Court

📋 Document list — ৳99–299 | 📄 Procedure guide — ৳999–1,999`,

    company: `**Company & Commercial Law — Bangladesh**

**Applicable Laws:** Companies Act 1994 • Partnership Act 1932 • RJSC Rules

**Private Ltd Registration:**
1. Name clearance → RJSC
2. Prepare MOA & AOA
3. File Form I, VI, XII → Certificate of Incorporation (15–20 days)

**Annual Compliance:** AGM within 120 days, annual return + audited accounts + tax return

📋 Document list — ৳199–399 | 📄 Procedure guide — ৳1,999–4,999`,

    tax: `**Tax Law — Bangladesh**

**Applicable Laws:** Income Tax Act 2023 • VAT & Supplementary Duty Act 2012

**Key Obligations:**
• Individual return: 30 November | Company return: 15 July
• TIN: mandatory above exemption threshold
• VAT registration: turnover above BDT 30 lakh

**Disputes:** DCT objection → Commissioner (Appeals) → Taxes Appellate Tribunal

📋 Document list — ৳99–299 | 📄 Procedure guide — ৳999–2,999`,

    nrb: `**NRB & Cross-Border Law — Bangladesh**

**Key Rules:**
• WHT on NRB profit share: 20% (with TIN) / 30% (without TIN)
• No Bangladesh-USA DTAA — double tax managed via US foreign tax credit
• BIDA registration required before repatriation of profits
• FBAR required if foreign account exceeds USD 10,000

**Steps for NRB investor:**
1. Register Bangladesh e-TIN (saves 10% WHT immediately)
2. Send capital via bank wire → get encashment certificate
3. Register with BIDA
4. Repatriate profits through authorised dealer bank

📋 Document list — ৳199–399 | 📄 Procedure guide — ৳1,999–4,999`,

    constitutional: `**Constitutional Law — Bangladesh**

**Key Fundamental Rights (Part III):**
• Article 27 — Equality before law
• Article 31 — Right to protection of law
• Article 32 — Right to life and personal liberty
• Article 33 — Safeguards on arrest and detention
• Article 39 — Freedom of thought and speech
• Article 44 — Right to enforce fundamental rights

**If your rights are violated:**
File a Writ Petition in the High Court Division under Article 102.
Types: Habeas Corpus • Mandamus • Certiorari • Prohibition • Quo Warranto

📋 Document list — ৳299 | 📄 Procedure guide — ৳2,999–9,999`,

    consumer: `**Consumer Law — Bangladesh**

**Applicable Law:** Consumer Rights Protection Act 2009

**Your Rights:**
• Right to refund for defective goods/services
• Right to accurate information
• Protection from unfair trade practices

**Steps:**
1. Complain to seller in writing first
2. File complaint with Directorate of National Consumer Rights Protection
3. File civil suit for compensation if needed

📋 Document list — ৳99 | 📄 Procedure guide — ৳999`,

    cyber: `**Cyber & Digital Law — Bangladesh**

**Applicable Laws:**
• Digital Security Act 2018 (Sections 17–35 — offences)
• ICT Act 2006 (amended 2013)
• Penal Code 1860 — defamation, fraud provisions

**Common Offences:**
• Hacking, data theft → 7–14 years imprisonment
• Online defamation → 3 years
• Cyber fraud → 5–7 years
• Digital forgery → 7 years

**If you are a victim:**
1. File complaint with Cyber Crime Unit — police.gov.bd
2. Preserve all digital evidence (screenshots, URLs, timestamps)
3. Also file complaint with Bangladesh Telecommunication Regulatory Commission (BTRC)

📋 Document list — ৳99–199 | 📄 Procedure guide — ৳999–1,999`,
  },

  bn: {
    property: `**ভূমি ও সম্পত্তি আইন — বাংলাদেশ**

**প্রযোজ্য আইন:**
• সম্পত্তি হস্তান্তর আইন ১৮৮২ • নিবন্ধন আইন ১৯০৮
• রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ১৯৫০ • ভূমি জরিপ ট্রাইব্যুনাল আইন ২০২৩
• তামাদি আইন ১৯০৮ — দখলের মামলায় ১২ বছর

**মূল পদক্ষেপ:**
১. দলিল, খতিয়ান (CS/RS/BS), নামজারি রেকর্ড, কর রশিদ সংগ্রহ করুন
২. AC Land অফিস বা land.gov.bd তে যাচাই করুন
৩. বিরোধে → দেওয়ানি আদালত | নামজারি → উপজেলা ভূমি অফিস

📋 ডকুমেন্ট লিস্ট — ৳৯৯–৩৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯–৪,৯৯৯
⚠️ শুধু তথ্য। প্রতিনিধিত্বের জন্য বার কাউন্সিল অ্যাডভোকেট নিন।`,

    criminal: `**ফৌজদারি আইন — বাংলাদেশ**

**প্রযোজ্য আইন:**
• দণ্ডবিধি ১৮৬০ • ফৌজদারি কার্যবিধি ১৮৯৮ • সাক্ষ্য আইন ১৮৭২
• ডিজিটাল নিরাপত্তা আইন ২০১৮ • নারী ও শিশু নির্যাতন দমন আইন ২০০০
• মাদকদ্রব্য নিয়ন্ত্রণ আইন ১৯৯০ • দুর্নীতি দমন কমিশন আইন ২০০৪

**আপনি যদি ভিকটিম হন:**
১. নিকটস্থ থানায় এজাহার (FIR) দায়ের করুন
২. পুলিশ তদন্ত → চার্জশিট → ম্যাজিস্ট্রেট/দায়রা আদালত
৩. সরাসরি ম্যাজিস্ট্রেটেও নালিশ করা যায়

**আপনি যদি আসামি হন:**
১. জামিনযোগ্য অপরাধ → জামিন আপনার অধিকার
২. অজামিনযোগ্য → দায়রা জজের কাছে আবেদন
৩. মিথ্যা মামলা → হাইকোর্টে আগাম জামিন
৪. নীরব থাকার অধিকার ও আইনজীবীর অধিকার — ব্যবহার করুন

**রিমান্ড:** সর্বোচ্চ মোট ১৫ দিন। আদালতে চ্যালেঞ্জ করা যায়।

📋 ডকুমেন্ট লিস্ট — ৳৯৯–২৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯–২,৯৯৯
⚠️ যেকোনো ফৌজদারি মামলায় অবিলম্বে অ্যাডভোকেট নিন।`,

    family: `**পারিবারিক আইন — বাংলাদেশ**

**প্রযোজ্য আইন:**
• মুসলিম পারিবারিক আইন অধ্যাদেশ ১৯৬১ • পারিবারিক আদালত অধ্যাদেশ ১৯৮৫
• অভিভাবক ও প্রতিপাল্য আইন ১৮৯০ • যৌতুক নিষিদ্ধ আইন ১৯৮০

**তালাক (স্বামী কর্তৃক):** ইউনিয়ন পরিষদ চেয়ারম্যানকে নোটিশ → ৯০ দিন সালিশ
**খোলা (স্ত্রী কর্তৃক):** পারিবারিক আদালতে আবেদন
**ভরণপোষণ ও হেফাজত:** পারিবারিক আদালত — সন্তানের কল্যাণ প্রাধান্য পায়
**দেনমোহর:** পারিবারিক আদালতে ঋণ হিসেবে আদায়যোগ্য

📋 ডকুমেন্ট লিস্ট — ৳৯৯–২৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯–২,৯৯৯`,

    labour: `**শ্রম আইন — বাংলাদেশ**

**প্রযোজ্য আইন:** বাংলাদেশ শ্রম আইন ২০০৬ (সংশোধিত ২০১৩, ২০১৮)

**আপনার অধিকার:**
• নোটিশ পিরিয়ড: ন্যূনতম ৩০ দিন
• গ্র্যাচুইটি: প্রতি বছরের জন্য ৩০ দিনের বেতন (১ বছর পর)
• অন্যায় বরখাস্তে ক্ষতিপূরণ

**পদক্ষেপ:**
১. অন্যায় বরখাস্তে → শ্রম আদালতে ৩০ দিনের মধ্যে
২. বকেয়া বেতন → কলকারখানা পরিদর্শন অধিদফতর
৩. গ্র্যাচুইটি → আগে নিয়োগকর্তার কাছে, তারপর শ্রম আদালত

📋 ডকুমেন্ট লিস্ট — ৳৯৯–২৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯–১,৯৯৯`,

    company: `**কোম্পানি আইন — বাংলাদেশ**

**প্রযোজ্য আইন:** কোম্পানি আইন ১৯৯৪ • অংশীদারিত্ব আইন ১৯৩২

**প্রাইভেট লিমিটেড নিবন্ধন:**
১. RJSC থেকে নাম ছাড়পত্র
২. MOA ও AOA প্রস্তুত
৩. Form I, VI, XII জমা → নিবন্ধন সনদ (১৫–২০ কার্যদিবস)

📋 RJSC ডকুমেন্ট লিস্ট — ৳১৯৯–৩৯৯ | 📄 পদ্ধতি গাইড — ৳১,৯৯৯–৪,৯৯৯`,

    tax: `**কর আইন — বাংলাদেশ**

**প্রযোজ্য আইন:** আয়কর আইন ২০২৩ • ভ্যাট ও সম্পূরক শুল্ক আইন ২০১২

**মূল বাধ্যবাধকতা:**
• ব্যক্তিগত রিটার্ন: ৩০ নভেম্বর | কোম্পানি রিটার্ন: ১৫ জুলাই
• TIN: আয়সীমার উপরে বাধ্যতামূলক
• ভ্যাট নিবন্ধন: টার্নওভার ৩০ লক্ষ টাকার উপরে

📋 ডকুমেন্ট লিস্ট — ৳৯৯–২৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯–২,৯৯৯`,

    nrb: `**প্রবাসী বিনিয়োগ আইন — বাংলাদেশ**

**মূল নিয়ম:**
• WHT: TIN থাকলে ২০% / না থাকলে ৩০%
• বাংলাদেশ-যুক্তরাষ্ট্র DTAA নেই — দ্বৈত কর US ফরেন ট্যাক্স ক্রেডিটে সামলান
• মুনাফা প্রত্যাবাসনের আগে BIDA নিবন্ধন বাধ্যতামূলক

**পদক্ষেপ:**
১. বাংলাদেশ e-TIN নিবন্ধন করুন (১০% WHT বাঁচবে)
২. ব্যাংক ওয়্যারে মূলধন পাঠান → এনক্যাশমেন্ট সার্টিফিকেট নিন
৩. BIDA নিবন্ধন করুন
৪. অনুমোদিত ডিলার ব্যাংকের মাধ্যমে মুনাফা পাঠান

📋 ডকুমেন্ট লিস্ট — ৳১৯৯–৩৯৯ | 📄 পদ্ধতি গাইড — ৳১,৯৯৯–৪,৯৯৯`,

    constitutional: `**সাংবিধানিক আইন — বাংলাদেশ**

**মূল মৌলিক অধিকার (তৃতীয় ভাগ):**
• অনুচ্ছেদ ২৭ — আইনের দৃষ্টিতে সমতা
• অনুচ্ছেদ ৩১ — আইনের আশ্রয় পাওয়ার অধিকার
• অনুচ্ছেদ ৩২ — জীবন ও ব্যক্তিস্বাধীনতার অধিকার
• অনুচ্ছেদ ৩৩ — গ্রেফতার ও আটক সম্পর্কিত রক্ষাকবচ
• অনুচ্ছেদ ৩৯ — চিন্তা ও বাক স্বাধীনতা
• অনুচ্ছেদ ৪৪ — মৌলিক অধিকার বলবৎ করার অধিকার

**অধিকার লঙ্ঘিত হলে:** সংবিধানের ১০২ অনুচ্ছেদে হাইকোর্ট বিভাগে রিট আবেদন
রিটের ধরন: হেবিয়াস কর্পাস • ম্যান্ডামাস • সার্শিওরারি • প্রহিবিশন

📋 ডকুমেন্ট লিস্ট — ৳২৯৯ | 📄 পদ্ধতি গাইড — ৳২,৯৯৯–৯,৯৯৯`,

    consumer: `**ভোক্তা অধিকার আইন — বাংলাদেশ**

**প্রযোজ্য আইন:** ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯

**আপনার অধিকার:**
• ত্রুটিপূর্ণ পণ্য/সেবার জন্য ফেরত বা ক্ষতিপূরণ
• সঠিক তথ্য পাওয়ার অধিকার
• অন্যায্য ব্যবসায়িক অনুশীলন থেকে সুরক্ষা

**পদক্ষেপ:**
১. বিক্রেতাকে লিখিত অভিযোগ করুন
২. জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদফতরে অভিযোগ
৩. প্রয়োজনে দেওয়ানি মামলা

📋 ডকুমেন্ট লিস্ট — ৳৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯`,

    cyber: `**সাইবার ও ডিজিটাল আইন — বাংলাদেশ**

**প্রযোজ্য আইন:**
• ডিজিটাল নিরাপত্তা আইন ২০১৮ • তথ্য ও যোগাযোগ প্রযুক্তি আইন ২০০৬

**সাধারণ অপরাধ:**
• হ্যাকিং, তথ্য চুরি → ৭–১৪ বছর
• অনলাইন মানহানি → ৩ বছর
• সাইবার প্রতারণা → ৫–৭ বছর

**আপনি ভিকটিম হলে:**
১. Cyber Crime Unit এ অভিযোগ — police.gov.bd
২. সব ডিজিটাল প্রমাণ সংরক্ষণ করুন (স্ক্রিনশট, URL)
৩. BTRC তেও অভিযোগ করুন

📋 ডকুমেন্ট লিস্ট — ৳৯৯–১৯৯ | 📄 পদ্ধতি গাইড — ৳৯৯৯–১,৯৯৯`,
  },
};

const FALLBACK: Record<string, string> = {
  en: `Thank you for your question.

Please describe your situation:
1. What happened — the core facts
2. Who is involved
3. What outcome you want

**JesAI covers:**
Land & Property • Family & Marriage • Criminal & Police • Employment
Company & RJSC • Tax & VAT • NRB Investment • Contracts
Constitutional Rights • Consumer Rights • Cyber/Digital

⚠️ Legal information only — not legal advice.`,

  bn: `আপনার প্রশ্নের জন্য ধন্যবাদ।

অনুগ্রহ করে আপনার পরিস্থিতি বর্ণনা করুন:
১. কী হয়েছে — মূল ঘটনা
২. কারা জড়িত
৩. আপনি কী চান

**JesAI যা কভার করে:**
জমি ও সম্পত্তি • পরিবার ও বিবাহ • ফৌজদারি ও পুলিশ • চাকরি
কোম্পানি ও RJSC • কর ও ভ্যাট • প্রবাসী বিনিয়োগ • চুক্তি
সাংবিধানিক অধিকার • ভোক্তা অধিকার • সাইবার/ডিজিটাল

⚠️ শুধুমাত্র আইনি তথ্য — পরামর্শ নয়।`,
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const lang = detectLanguage(message);
    const area = detectArea(message);

    // Step 1: NLC knowledge store (specific Q&A)
    const result = queryKnowledge(message);
    if (result.matched && result.qaEntry) {
      const { irac, escalate, escalateReason } = result.qaEntry;
      let response = `${irac.issue}\n\n`;
      response += `**${lang === "bn" ? "আইন কী বলে" : "What the law says"}**\n${irac.rule}\n\n`;
      response += `**${lang === "bn" ? "আপনার ক্ষেত্রে প্রয়োগ" : "How this applies"}**\n${irac.application}\n\n`;
      response += `**${lang === "bn" ? "আপনার করণীয়" : "What you should do"}**\n${irac.conclusion}`;
      if (escalate && escalateReason) {
        response += `\n\n⚠️ **${lang === "bn" ? "পেশাদার সহায়তা প্রয়োজন" : "Professional Help Required"}**\n${escalateReason}`;
      }
      if (result.rules.length > 0) {
        response += `\n\n**${lang === "bn" ? "প্রযোজ্য আইন" : "Applicable Laws"}**\n`;
        result.rules.slice(0, 3).forEach(r => { response += `• ${r.title} — ${r.source}\n`; });
      }
      return NextResponse.json({ response, metadata: { area: result.area, confidence: result.confidence, escalate: result.escalate, language: lang } });
    }

    // Step 2: General area response
    if (area && R[lang]?.[area]) {
      return NextResponse.json({ response: R[lang][area], metadata: { area, confidence: "medium", escalate: false, language: lang } });
    }
    if (area && R.en?.[area]) {
      return NextResponse.json({ response: R.en[area], metadata: { area, confidence: "medium", escalate: false, language: lang } });
    }

    // Step 3: Fallback
    return NextResponse.json({ response: FALLBACK[lang] || FALLBACK.en, metadata: { area: null, confidence: "low", escalate: false, language: lang } });

  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
