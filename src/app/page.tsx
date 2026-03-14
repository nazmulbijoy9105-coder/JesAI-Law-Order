import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const lawAreas = [
  {
    icon: "⚖️",
    title: "Constitutional Law",
    desc: "Fundamental rights, writ jurisdiction, all 17 amendments, arrest safeguards under Bangladesh Constitution 1972.",
    color: "from-green-900/40 to-green-800/20",
    border: "border-green-700/30",
  },
  {
    icon: "🔒",
    title: "Criminal Law",
    desc: "Penal Code, CrPC, FIR, bail, remand, trial procedures and special criminal laws.",
    color: "from-red-900/40 to-red-800/20",
    border: "border-red-700/30",
  },
  {
    icon: "🏠",
    title: "Property & Land Law",
    desc: "Transfer of Property Act, land mutation, khatian, namajaari, deed registration and disputes.",
    color: "from-amber-900/40 to-amber-800/20",
    border: "border-amber-700/30",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Law",
    desc: "Marriage, divorce, talaq, mehr, maintenance, custody under Muslim, Hindu & Christian laws.",
    color: "from-purple-900/40 to-purple-800/20",
    border: "border-purple-700/30",
  },
  {
    icon: "🏭",
    title: "Labour Law",
    desc: "Employment rights, wrongful termination, gratuity, provident fund and Labour Act 2006.",
    color: "from-teal-900/40 to-teal-800/20",
    border: "border-teal-700/30",
  },
  {
    icon: "💼",
    title: "Company & Commercial",
    desc: "Companies Act 1994, RJSC registration, MOA/AOA, directors, annual compliance.",
    color: "from-indigo-900/40 to-indigo-800/20",
    border: "border-indigo-700/30",
  },
  {
    icon: "💰",
    title: "Tax Law",
    desc: "Income Tax Act 2023, VAT, NBR regulations, TIN, tax returns and compliance.",
    color: "from-yellow-900/40 to-yellow-800/20",
    border: "border-yellow-700/30",
  },
  {
    icon: "✈️",
    title: "NRB Investment",
    desc: "WHT, BIDA registration, repatriation, FBAR, cross-border investment compliance.",
    color: "from-blue-900/40 to-blue-800/20",
    border: "border-blue-700/30",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Share Your Situation",
    desc: "Describe your facts in plain language — no legal jargon needed.",
    icon: "💬",
  },
  {
    step: "02",
    title: "JesAI Analyses Your Facts",
    desc: "JesAI identifies the relevant legal issues and maps them to Bangladesh law.",
    icon: "🔍",
  },
  {
    step: "03",
    title: "Law Explained Clearly",
    desc: "Get a plain-language explanation of your rights, duties, and procedural options.",
    icon: "🗺️",
  },
  {
    step: "04",
    title: "Step-by-Step Guidance",
    desc: "Understand what to do next — from filing an FIR to registering a company.",
    icon: "🎯",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#006a4e]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#c8a84b]/10 blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#006a4e] via-[#f42a41] to-[#006a4e]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#006a4e]/40 bg-[#006a4e]/10 px-4 py-1.5 text-sm text-[#4ade80] mb-8">
              <span className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
              Free Legal Literacy for Every Bangladeshi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Legal Rights,{" "}
              <span className="gradient-text">Explained Simply</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              JesAI is Bangladesh&apos;s Legal AI — mapping your situation to the
              right laws, explaining your rights, and guiding you step by step.
              From land disputes to criminal matters, company registration to family law.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/consult"
                className="flex items-center gap-2 rounded-xl bg-[#006a4e] px-8 py-4 text-base font-semibold text-white hover:bg-[#005a40] transition-all shadow-lg hover:shadow-[#006a4e]/30 hover:shadow-xl"
              >
                <span>Ask JesAI Now</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/laws"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                Explore Law Areas
              </Link>
            </div>

            {/* Free tier badge — consistent with MAX_QUESTIONS=20 */}
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#c8a84b]/30 bg-[#c8a84b]/10 px-6 py-3">
              <span className="text-2xl">🎁</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#c8a84b]">
                  20 Free Questions
                </p>
                <p className="text-xs text-slate-400">
                  No registration required to start
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar — fixed false claims */}
      <section className="border-y border-white/10 bg-[#0d2240]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "225+",  label: "Validated Q&A Pairs"   },
              { value: "8",     label: "Law Modules Live"       },
              { value: "Free",  label: "Legal Literacy"         },
              { value: "24/7",  label: "Always Available"       },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[#c8a84b]">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Law Areas Grid — Contract Law removed */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              All Areas of Bangladesh Law
            </h2>
            {/* Fixed: no false bdlaws claim */}
            <p className="text-slate-400 max-w-2xl mx-auto">
              NLC-validated legal knowledge covering every major area of
              Bangladesh law — substantive rights and procedural guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lawAreas.map((area) => (
              <Link
                key={area.title}
                href="/consult"
                className={`group relative rounded-xl border ${area.border} bg-gradient-to-br ${area.color} p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
              >
                <div className="text-3xl mb-3">{area.icon}</div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {area.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {area.desc}
                </p>
                <div className="mt-3 text-xs text-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity">
                  Ask JesAI →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — IRAC removed */}
      <section className="py-20 bg-[#0d2240]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              How JesAI Works
            </h2>
            {/* Fixed: IRAC removed */}
            <p className="text-slate-400 max-w-xl mx-auto">
              Describe your situation in plain language. JesAI maps it to the
              relevant Bangladesh laws and guides you through your options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#006a4e]/50 to-transparent z-0" />
                )}
                <div className="relative z-10 rounded-xl border border-white/10 bg-[#0a1628] p-6">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <div className="text-xs font-bold text-[#c8a84b] mb-2 tracking-widest">
                    STEP {step.step}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Pillars */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Two Pillars of Law
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              JesAI covers both dimensions of Bangladesh law to give you
              complete guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-[#006a4e]/30 bg-gradient-to-br from-[#006a4e]/20 to-[#006a4e]/5 p-8">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-xl font-bold text-white mb-3">Substantive Law</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Defines your <strong className="text-white">rights, duties, and offenses</strong>.
                What the law says about your situation — what you can do, what you cannot,
                and what consequences follow.
              </p>
              <ul className="space-y-2">
                {[
                  "Penal Code — what is a crime",
                  "Specific Relief Act — what relief you can get",
                  "Transfer of Property Act — your property rights",
                  "Contract Act — your contractual obligations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-[#4ade80] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#c8a84b]/30 bg-gradient-to-br from-[#c8a84b]/20 to-[#c8a84b]/5 p-8">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-white mb-3">Procedural Law</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Guides <strong className="text-white">how to enforce</strong> your rights.
                The steps, forms, courts, and timelines that lawyers, courts,
                police, and officials must follow.
              </p>
              <ul className="space-y-2">
                {[
                  "CPC — how to file a civil suit",
                  "CrPC — how criminal cases proceed",
                  "Evidence Act — what proof is needed",
                  "Court fees, limitation periods, appeals",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-[#c8a84b] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-8 bg-[#f42a41]/5 border-y border-[#f42a41]/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-300">
            <span className="font-bold text-[#f42a41]">⚠️ Important Disclaimer: </span>
            JesAI provides <strong>legal literacy and information only</strong> — not legal advice.
            For legal services, representation, or advice, please consult a certified advocate
            registered with the{" "}
            <strong className="text-white">Bangladesh Bar Council</strong>.
            Legal literacy is free; legal service requires professional assistance.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-[#006a4e]/30 bg-gradient-to-br from-[#006a4e]/20 to-[#0d2240] p-12">
            <div className="text-5xl mb-6">🇧🇩</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Know Your Rights. Know Your Laws.
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Every Bangladeshi citizen deserves to understand the laws that
              govern their life. Start with 20 free questions — no registration required.
            </p>
            <Link
              href="/consult"
              className="inline-flex items-center gap-2 rounded-xl bg-[#006a4e] px-10 py-4 text-base font-semibold text-white hover:bg-[#005a40] transition-all shadow-lg"
            >
              Start Free Consultation
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
