import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a1628] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#006a4e] text-white font-bold text-lg">
                J
              </div>
              <span className="text-xl font-bold text-white">
                Jes<span className="text-[#c8a84b]">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Bangladesh&apos;s free legal literacy companion. Understand your rights,
              map laws to your situation, and navigate the legal system — from
              birth to death, land to sky.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-[#f42a41]/10 border border-[#f42a41]/20">
              <p className="text-xs text-[#f42a41] font-semibold">
                ⚠️ DISCLAIMER
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JesAI provides legal literacy and information only — NOT legal
                advice. For legal services, consult a certified Bangladesh Bar
                Council advocate.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/consult", label: "Ask JesAI" },
                { href: "/laws", label: "Law Areas" },
                { href: "/about", label: "About JesAI" },
                { href: "/about#how-it-works", label: "How It Works" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#4ade80] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Law Areas */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Law Areas
            </h3>
            <ul className="space-y-2">
              {[
                "Constitutional Law",
                "Criminal Law",
                "Property Law",
                "Family Law",
                "Contract Law",
                "Labour Law",
              ].map((area) => (
                <li key={area}>
                  <Link
                    href="/laws"
                    className="text-sm text-slate-400 hover:text-[#4ade80] transition-colors"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} JesAI. Legal literacy for every
            Bangladeshi citizen.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://bdlaws.minlaw.gov.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-[#c8a84b] transition-colors"
            >
              bdlaws.minlaw.gov.bd ↗
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-500">
              Powered by Bangladesh Law
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
