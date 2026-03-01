"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/consult", label: "Ask JesAI" },
    { href: "/laws", label: "Law Areas" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1628]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#006a4e] text-white font-bold text-lg shadow-lg group-hover:bg-[#005a40] transition-colors">
              J
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-white tracking-tight">
                Jes<span className="text-[#c8a84b]">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase">
                Legal Literacy
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-[#006a4e]/20 text-[#4ade80] border border-[#006a4e]/40"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/consult"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#006a4e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005a40] transition-colors shadow-lg"
            >
              <span>Free Consultation</span>
              <span className="text-xs bg-[#c8a84b] text-[#0a1628] px-1.5 py-0.5 rounded font-bold">
                20 FREE
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-[#006a4e]/20 text-[#4ade80]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <Link
                href="/consult"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#006a4e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#005a40] transition-colors"
              >
                Free Consultation
                <span className="text-xs bg-[#c8a84b] text-[#0a1628] px-1.5 py-0.5 rounded font-bold">
                  10 FREE
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
