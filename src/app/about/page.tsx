import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About JesAI – Bangladesh Legal Literacy AI",
  description:
    "Learn about JesAI — the Mother Legal AI for Bangladesh. Understand our mission, how we work, and the principles behind legal literacy for every citizen.",
};

const modules = [
  {
    icon: "⚖️",
    title: "Constitutional Law",
    topics: "Fundamental rights, separation of powers, emergency powers, judicial review",
  },
  {
    icon: "📝",
    title: "Contract Law",
    topics: "Formation, performance, breach, remedies, specific contracts",
  },
  {
    icon: "⚡",
    title: "Tort Law",
    topics: "Negligence, liability, damages, defamation",
  },
  {
    icon: "🔒",
    title: "Criminal Law",
    topics: "Penal Code, CrPC, general offenses, special laws",
  },
  {
    icon: "🏠",
    title: "Property Law",
    topics: "Transfer of Property Act, land laws, easements, leases",
  },
  {
    icon: "💼",
    title: "Company & Commercial",
    topics: "Companies Act, contracts, securities, corporate governance",
  },
  {
    icon: "📋",
    title: "Civil Procedure",
    topics: "CPC, filing, pleadings, appeals, execution",
  },
  {
    icon: "📜",
    title: "Evidence Law",
    topics: "Bangladesh Evidence Act, admissibility, burden of proof",
  },
  {
    icon: "🏛️",
    title: "Administrative Law",
    topics: "Writs, judicial review, government powers",
  },
  {
    icon: "🏭",
    title: "Labour & Industrial",
    topics: "Employment rights, labour regulations, industrial disputes",
  },
  {
    icon: "💰",
    title: "Tax Law",
    topics: "Income Tax Ordinance, VAT, customs, NBR regulations",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Law",
    topics: "Marriage, divorce, maintenance, custody, inheritance",
  },
];

const principles = [
  {
    icon: "🎯",
    title: "Core → Peripheral",
    desc: "Always start with the main issue; ignore noise initially. Focus on what matters most.",
  },
  {
    icon: "📜",
    title: "Substantive First",
    desc: "Understand the law's essence before steps. Know your rights before knowing the procedure.",
  },
  {
    icon: "⚠️",
    title: "Consequences Always Matter",
    desc: "Every response flags risks or outcomes — positive, negative, and neutral.",
  },
  {
    icon: "🔄",
    title: "Dynamic Updates",
    desc: "Laws evolve — JesAI continuously refreshes knowledge from bdlaws.minlaw.gov.bd.",
  },
  {
    icon: "👤",
    title: "Human Story Mapping",
    desc: "Every legal fact relates to human intent, action, and reaction. Law is about people.",
  },
  {
    icon: "🧠",
    title: "Dual Reasoning",
    desc: "Academic (concepts, history) and practical (steps, enforcement) reasoning combined.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navbar />

      {/* Hero */}
      <section className="relative border-b border-white/10 bg-[#0d2240]/50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-[#006a4e] flex items-center justify-center text-white font-bold text-3xl shadow-xl">
              J
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            About <span className="gradient-text">JesAI</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            JesAI is Bangladesh&apos;s Mother Legal AI — a free legal literacy
            companion that helps every citizen understand their rights, navigate
            the law, and predict consequences of legal actions.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Why JesAI Exists
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  From birth to death, laws regulate every aspect of human life
                  — property, family, education, business. Yet most Bangladeshi
                  citizens don&apos;t know their basic legal rights.
                </p>
                <p>
                  Laws evolve from ancient customs to codified statutes to
                  current acts. They protect, guide, and sometimes punish.
                  Understanding them shouldn&apos;t require a law degree.
                </p>
                <p>
                  <strong className="text-white">JesAI&apos;s mission</strong> is
                  simple: make Bangladesh&apos;s legal system understandable to
                  every citizen — for free.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: "🇧🇩",
                  text: "Built specifically for Bangladesh law",
                },
                {
                  icon: "📚",
                  text: "Based on bdlaws.minlaw.gov.bd — all public laws",
                },
                {
                  icon: "🆓",
                  text: "Legal literacy is free — always",
                },
                {
                  icon: "⚖️",
                  text: "Information only — not legal advice",
                },
                {
                  icon: "🔄",
                  text: "Continuously updated with new laws",
                },
                {
                  icon: "🧠",
                  text: "IRAC reasoning like a para-lawyer",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0d2240] px-4 py-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-[#0d2240]/30 border-y border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Core Reasoning Workflow
            </h2>
            <p className="text-slate-400">
              JesAI follows a structured legal reasoning process for every query.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                num: "1",
                title: "Receive User Input",
                desc: "Facts, situation, or query in plain language",
                color: "bg-[#006a4e]",
              },
              {
                num: "2",
                title: "Identify Core Facts",
                desc: "Separate primary facts from secondary details",
                color: "bg-[#006a4e]",
              },
              {
                num: "3",
                title: "Ask Clarifying Questions",
                desc: "Progressive questioning to complete the picture",
                color: "bg-[#005a40]",
              },
              {
                num: "4",
                title: "Map to Substantive Law",
                desc: "What rights and obligations exist under Bangladesh law?",
                color: "bg-[#c8a84b]",
              },
              {
                num: "5",
                title: "Map to Procedural Law",
                desc: "How to enforce those rights — courts, steps, documents",
                color: "bg-[#c8a84b]",
              },
              {
                num: "6",
                title: "Predict Consequences",
                desc: "Positive, negative, or neutral outcomes of each path",
                color: "bg-[#b8943b]",
              },
              {
                num: "7",
                title: "Structured Output",
                desc: "Main guidance + stepwise procedure + disclaimer",
                color: "bg-[#0d2240] border border-white/20",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#0a1628] p-4"
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-lg ${step.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {step.num}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Key Principles
            </h2>
            <p className="text-slate-400">
              The guiding principles behind JesAI&apos;s legal reasoning.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-white/10 bg-[#0d2240] p-5"
              >
                <div className="text-2xl mb-3">{p.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Law Modules */}
      <section className="py-16 bg-[#0d2240]/30 border-y border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Core LLB Subjects Covered
            </h2>
            <p className="text-slate-400">
              JesAI is trained on all core LLB subjects as taught in Bangladesh
              law schools and as codified in Bangladesh statutes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => (
              <div
                key={mod.title}
                className="rounded-xl border border-white/10 bg-[#0a1628] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{mod.icon}</span>
                  <span className="text-sm font-semibold text-white">
                    {mod.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{mod.topics}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Subscription */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Free vs. Subscription
            </h2>
            <p className="text-slate-400">
              Legal literacy is free. Advanced analysis and human assistance
              require subscription.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-[#006a4e]/30 bg-gradient-to-br from-[#006a4e]/20 to-[#006a4e]/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🆓</span>
                <div>
                  <h3 className="text-lg font-bold text-white">Free Tier</h3>
                  <p className="text-xs text-[#4ade80]">20 questions • No registration</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "Legal literacy and information",
                  "Law mapping to your situation",
                  "Procedural step guidance",
                  "Document checklist",
                  "Consequence awareness",
                  "All Bangladesh law areas",
                  "IRAC-based reasoning",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-[#4ade80]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscription */}
            <div className="rounded-2xl border border-[#c8a84b]/30 bg-gradient-to-br from-[#c8a84b]/20 to-[#c8a84b]/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="text-lg font-bold text-white">Subscription</h3>
                  <p className="text-xs text-[#c8a84b]">Unlimited • Human assistance</p>
                </div>
              </div>
              <ul className="space-y-2">
                {[
                  "Everything in Free tier",
                  "Unlimited questions",
                  "Deep legal analysis",
                  "Human legal assistant review",
                  "Cross-border law queries",
                  "Priority response",
                  "Document review guidance",
                  "Case strategy information",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-[#c8a84b]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full rounded-xl bg-[#c8a84b] text-[#0a1628] py-2.5 text-sm font-bold hover:bg-[#b8943b] transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="py-12 bg-[#f42a41]/5 border-y border-[#f42a41]/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#f42a41] mb-4">
              ⚠️ Important Legal Disclaimer
            </h2>
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
              <p>
                JesAI provides <strong className="text-white">legal literacy and information only</strong> —
                not legal advice, legal services, or legal representation.
              </p>
              <p>
                The information provided by JesAI is based on publicly available
                Bangladesh laws from{" "}
                <a
                  href="https://bdlaws.minlaw.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4ade80] hover:underline"
                >
                  bdlaws.minlaw.gov.bd
                </a>{" "}
                and is for educational and awareness purposes only.
              </p>
              <p>
                For actual legal advice, representation, or services, please
                consult a certified advocate registered with the{" "}
                <strong className="text-white">Bangladesh Bar Council</strong>.
                Only licensed advocates can provide legal advice under Bangladesh law.
              </p>
              <p>
                Laws are dynamic and may change. Always verify current law with
                official sources or a qualified legal professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Understand Your Legal Rights?
          </h2>
          <p className="text-slate-400 mb-6">
            Start with 20 free questions. No registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consult"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006a4e] px-8 py-4 text-base font-semibold text-white hover:bg-[#005a40] transition-all shadow-lg"
            >
              Ask JesAI Now
            </Link>
            <Link
              href="/laws"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Explore Law Areas
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
