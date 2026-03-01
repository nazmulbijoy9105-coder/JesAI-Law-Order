import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Bangladesh Law Areas – JesAI Legal Literacy",
  description:
    "Explore all areas of Bangladesh law — constitutional, criminal, property, family, contract, labour, company, and tax law. Free legal literacy from JesAI.",
};

const lawDomains = [
  {
    icon: "⚖️",
    title: "Constitutional Law",
    color: "from-emerald-900/40 to-emerald-800/10",
    border: "border-emerald-700/30",
    accent: "text-emerald-400",
    description:
      "The supreme law of Bangladesh. Establishes fundamental rights, state structure, separation of powers, and judicial review.",
    keyActs: [
      "Constitution of Bangladesh 1972",
      "Emergency Powers Rules",
      "Representation of the People Order 1972",
    ],
    rights: [
      "Right to equality (Art. 27)",
      "Right to life and liberty (Art. 32)",
      "Freedom of expression (Art. 39)",
      "Right to education (Art. 17)",
    ],
    remedies: ["Writ of Mandamus", "Writ of Certiorari", "Habeas Corpus", "Quo Warranto"],
    court: "High Court Division (Writ Jurisdiction)",
  },
  {
    icon: "🔒",
    title: "Criminal Law",
    color: "from-red-900/40 to-red-800/10",
    border: "border-red-700/30",
    accent: "text-red-400",
    description:
      "Governs offenses against the state and individuals. Defines crimes, punishments, and the criminal justice process.",
    keyActs: [
      "Penal Code 1860",
      "Code of Criminal Procedure 1898",
      "Evidence Act 1872",
      "Digital Security Act 2018",
      "Anti-Corruption Commission Act 2004",
      "Narcotics Control Act 1990",
    ],
    rights: [
      "Right to fair trial",
      "Presumption of innocence",
      "Right to legal representation",
      "Protection against double jeopardy",
    ],
    remedies: ["FIR filing", "Bail application", "Anticipatory bail", "Revision/Appeal"],
    court: "Magistrate Court → Sessions Court → High Court",
  },
  {
    icon: "🏠",
    title: "Property & Land Law",
    color: "from-amber-900/40 to-amber-800/10",
    border: "border-amber-700/30",
    accent: "text-amber-400",
    description:
      "Regulates ownership, transfer, and disputes over immovable property and land in Bangladesh.",
    keyActs: [
      "Transfer of Property Act 1882",
      "Registration Act 1908",
      "State Acquisition and Tenancy Act 1950",
      "Land Survey Tribunal Act 2023",
      "Immovable Property (Acquisition and Requisition) Ordinance 1982",
    ],
    rights: [
      "Right to own property",
      "Right to transfer property",
      "Right to quiet enjoyment",
      "Easement rights",
    ],
    remedies: ["Mutation (Namjari)", "Partition suit", "Injunction", "Declaration suit"],
    court: "Civil Court → District Judge → High Court",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Law",
    color: "from-purple-900/40 to-purple-800/10",
    border: "border-purple-700/30",
    accent: "text-purple-400",
    description:
      "Governs marriage, divorce, maintenance, custody, and inheritance based on personal laws (Muslim, Hindu, Christian).",
    keyActs: [
      "Muslim Family Laws Ordinance 1961",
      "Family Courts Ordinance 1985",
      "Guardians and Wards Act 1890",
      "Dowry Prohibition Act 1980",
      "Hindu Marriage Act",
      "Christian Marriage Act 1872",
    ],
    rights: [
      "Right to dower (Mehr)",
      "Right to maintenance",
      "Child custody rights",
      "Inheritance rights",
    ],
    remedies: ["Divorce petition", "Maintenance suit", "Custody application", "Dower recovery"],
    court: "Family Court (District Judge level)",
  },
  {
    icon: "📝",
    title: "Contract Law",
    color: "from-blue-900/40 to-blue-800/10",
    border: "border-blue-700/30",
    accent: "text-blue-400",
    description:
      "Governs agreements between parties — formation, performance, breach, and remedies for commercial and personal contracts.",
    keyActs: [
      "Contract Act 1872",
      "Specific Relief Act 1877",
      "Sale of Goods Act 1930",
      "Arbitration Act 2001",
      "Limitation Act 1908",
    ],
    rights: [
      "Right to enforce contract",
      "Right to damages on breach",
      "Right to specific performance",
      "Right to rescission",
    ],
    remedies: ["Damages", "Specific performance", "Injunction", "Rescission"],
    court: "Civil Court (based on claim value)",
  },
  {
    icon: "🏭",
    title: "Labour & Employment Law",
    color: "from-teal-900/40 to-teal-800/10",
    border: "border-teal-700/30",
    accent: "text-teal-400",
    description:
      "Protects workers' rights, regulates employment conditions, and governs industrial relations in Bangladesh.",
    keyActs: [
      "Bangladesh Labour Act 2006 (amended 2018)",
      "Bangladesh Labour Rules 2015",
      "EPZ Labour Act 2019",
      "Workmen's Compensation Act 1923",
      "Minimum Wages Ordinance 1961",
    ],
    rights: [
      "Right to minimum wage",
      "Right to gratuity",
      "Right against wrongful termination",
      "Right to safe workplace",
    ],
    remedies: ["Labour Court complaint", "Compensation claim", "Reinstatement order", "Wage recovery"],
    court: "Labour Court → Labour Appellate Tribunal",
  },
  {
    icon: "💼",
    title: "Company & Commercial Law",
    color: "from-indigo-900/40 to-indigo-800/10",
    border: "border-indigo-700/30",
    accent: "text-indigo-400",
    description:
      "Governs business entities, corporate governance, securities, and commercial transactions in Bangladesh.",
    keyActs: [
      "Companies Act 1994",
      "Securities and Exchange Ordinance 1969",
      "Partnership Act 1932",
      "Trade Organizations Ordinance 1961",
      "Bankruptcy Act 1997",
    ],
    rights: [
      "Shareholder rights",
      "Director duties and rights",
      "Creditor rights",
      "Minority shareholder protection",
    ],
    remedies: ["Winding up petition", "Injunction", "Derivative action", "BSEC complaint"],
    court: "Company Court (High Court Division)",
  },
  {
    icon: "💰",
    title: "Tax Law",
    color: "from-yellow-900/40 to-yellow-800/10",
    border: "border-yellow-700/30",
    accent: "text-yellow-400",
    description:
      "Governs income tax, VAT, customs duties, and other fiscal obligations under Bangladesh's tax regime.",
    keyActs: [
      "Income Tax Ordinance 1984",
      "VAT and Supplementary Duty Act 2012",
      "Customs Act 1969",
      "Stamp Act 1899",
      "NBR SROs and Notifications",
    ],
    rights: [
      "Right to appeal assessment",
      "Right to tax refund",
      "Right to fair hearing",
      "Right to see assessment order",
    ],
    remedies: ["DCT objection", "Commissioner (Appeals)", "Taxes Appellate Tribunal", "High Court"],
    court: "Taxes Appellate Tribunal → High Court",
  },
  {
    icon: "🏛️",
    title: "Administrative Law",
    color: "from-slate-800/40 to-slate-700/10",
    border: "border-slate-600/30",
    accent: "text-slate-300",
    description:
      "Controls government powers, ensures accountability of public authorities, and provides remedies against administrative excess.",
    keyActs: [
      "Constitution of Bangladesh 1972",
      "Administrative Tribunals Act 1980",
      "Public Service Commission Ordinance 1977",
      "Government Servants (Conduct) Rules 1979",
    ],
    rights: [
      "Right to natural justice",
      "Right against arbitrary action",
      "Right to reasons for decisions",
      "Right to judicial review",
    ],
    remedies: ["Writ petition", "Administrative Tribunal", "Ombudsman complaint", "RTI request"],
    court: "Administrative Tribunal → High Court (Writ)",
  },
  {
    icon: "📜",
    title: "Evidence Law",
    color: "from-rose-900/40 to-rose-800/10",
    border: "border-rose-700/30",
    accent: "text-rose-400",
    description:
      "Governs what evidence is admissible in court, burden of proof, and how facts are established in legal proceedings.",
    keyActs: [
      "Evidence Act 1872",
      "Oaths Act 1873",
      "Bankers' Books Evidence Act 1891",
      "Digital Security Act 2018 (digital evidence)",
    ],
    rights: [
      "Right against self-incrimination",
      "Right to cross-examine witnesses",
      "Privilege of communications",
      "Right to present evidence",
    ],
    remedies: ["Objection to evidence", "Application to exclude evidence", "Expert witness"],
    court: "All courts (evidence rules apply universally)",
  },
];

export default function LawsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navbar />

      {/* Header */}
      <section className="relative border-b border-white/10 bg-[#0d2240]/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#006a4e]/40 bg-[#006a4e]/10 px-3 py-1 text-xs text-[#4ade80] mb-4">
              📚 Bangladesh Law Reference
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              All Areas of Bangladesh Law
            </h1>
            <p className="text-slate-400 leading-relaxed">
              A comprehensive overview of Bangladesh&apos;s legal domains — based on
              statutes available at{" "}
              <a
                href="https://bdlaws.minlaw.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4ade80] hover:underline"
              >
                bdlaws.minlaw.gov.bd
              </a>
              . Click any area to ask JesAI about it.
            </p>
          </div>
        </div>
      </section>

      {/* Law Domains */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lawDomains.map((domain) => (
              <div
                key={domain.title}
                className={`rounded-2xl border ${domain.border} bg-gradient-to-br ${domain.color} p-6 hover:scale-[1.01] transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{domain.icon}</span>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {domain.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {domain.court}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/consult"
                    className={`text-xs ${domain.accent} border border-current/30 px-3 py-1 rounded-full hover:bg-white/5 transition-colors flex-shrink-0`}
                  >
                    Ask JesAI →
                  </Link>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {domain.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Key Acts */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Key Acts
                    </h3>
                    <ul className="space-y-1">
                      {domain.keyActs.slice(0, 4).map((act) => (
                        <li key={act} className="text-xs text-slate-500 flex items-start gap-1">
                          <span className={`${domain.accent} mt-0.5 flex-shrink-0`}>•</span>
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rights */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Your Rights
                    </h3>
                    <ul className="space-y-1">
                      {domain.rights.map((right) => (
                        <li key={right} className="text-xs text-slate-500 flex items-start gap-1">
                          <span className="text-[#4ade80] mt-0.5 flex-shrink-0">✓</span>
                          {right}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Remedies */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Remedies
                    </h3>
                    <ul className="space-y-1">
                      {domain.remedies.map((remedy) => (
                        <li key={remedy} className="text-xs text-slate-500 flex items-start gap-1">
                          <span className="text-[#c8a84b] mt-0.5 flex-shrink-0">→</span>
                          {remedy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IRAC Methodology */}
      <section className="py-12 bg-[#0d2240]/30 border-y border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            JesAI Uses IRAC Reasoning
          </h2>
          <p className="text-slate-400 mb-8">
            Every legal analysis follows the IRAC framework — the same method
            used by lawyers and courts.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                letter: "I",
                word: "Issue",
                desc: "What is the legal question?",
                color: "bg-[#006a4e]",
              },
              {
                letter: "R",
                word: "Rule",
                desc: "Which Bangladesh law applies?",
                color: "bg-[#c8a84b]",
              },
              {
                letter: "A",
                word: "Application",
                desc: "How does the law apply to your facts?",
                color: "bg-[#0d2240] border border-white/20",
              },
              {
                letter: "C",
                word: "Conclusion",
                desc: "What are your rights and next steps?",
                color: "bg-[#f42a41]",
              },
            ].map((item) => (
              <div
                key={item.letter}
                className="rounded-xl border border-white/10 bg-[#0a1628] p-5 text-center"
              >
                <div
                  className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3`}
                >
                  {item.letter}
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  {item.word}
                </div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Have a Legal Question?
          </h2>
          <p className="text-slate-400 mb-6">
            Ask JesAI about any of these law areas. Get free legal literacy
            guidance based on Bangladesh law.
          </p>
          <Link
            href="/consult"
            className="inline-flex items-center gap-2 rounded-xl bg-[#006a4e] px-8 py-4 text-base font-semibold text-white hover:bg-[#005a40] transition-all shadow-lg"
          >
            Ask JesAI — 20 Questions Free
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
