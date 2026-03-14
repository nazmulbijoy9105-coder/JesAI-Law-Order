import Navbar from "@/components/layout/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Ask JesAI – Free Legal Consultation | Bangladesh Legal Literacy",
  description:
    "Get free legal literacy guidance from JesAI. Describe your situation and JesAI will map it to Bangladesh laws, explain your rights, and guide you through procedures.",
};

export default function ConsultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628]">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">

        {/* ── Desktop Sidebar ─────────────────────────────── */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0 space-y-4">

          {/* JesAI Info Card */}
          <div className="rounded-xl border border-[#006a4e]/30 bg-[#0d2240] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#006a4e] flex items-center justify-center text-white font-bold text-xl">
                J
              </div>
              <div>
                <h2 className="text-white font-bold">JesAI</h2>
                <p className="text-xs text-[#4ade80]">Bangladesh Legal AI</p>
              </div>
            </div>
            {/* Fixed: removed IRAC and bdlaws false claim */}
            <p className="text-xs text-slate-400 leading-relaxed">
              NLC-validated legal knowledge covering Bangladesh law across all major
              practice areas. Powered by{" "}
              <span className="text-[#4ade80]">Neum Lex Counsel</span>.
            </p>
          </div>

          {/* How JesAI Thinks — IRAC removed */}
          <div className="rounded-xl border border-white/10 bg-[#0d2240] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">
              How JesAI Works
            </h3>
            <div className="space-y-3">
              {[
                { icon: "👂", label: "Listens to your facts" },
                { icon: "🗺️", label: "Maps to Bangladesh laws" },
                { icon: "⚖️", label: "Explains your rights" },
                { icon: "📋", label: "Step-by-step guidance" },
                { icon: "🎯", label: "Predicts consequences" },
                { icon: "🔗", label: "Connects to NLC advocates" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Law Areas — updated to match built modules */}
          <div className="rounded-xl border border-white/10 bg-[#0d2240] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">
              Law Areas Covered
            </h3>
            <div className="space-y-1.5">
              {[
                { icon: "⚖️", label: "Constitutional Law",  built: true  },
                { icon: "🔒", label: "Criminal Law",         built: true  },
                { icon: "🏠", label: "Property & Land",      built: true  },
                { icon: "👨‍👩‍👧", label: "Family Law",          built: false },
                { icon: "🏭", label: "Labour Law",           built: false },
                { icon: "💼", label: "Company Law",          built: true  },
                { icon: "💰", label: "Tax Law",              built: true  },
                { icon: "✈️", label: "NRB Investment",       built: true  },
              ].map((area) => (
                <div
                  key={area.label}
                  className="flex items-center gap-2 text-xs py-1"
                >
                  <span>{area.icon}</span>
                  <span className={area.built ? "text-slate-300" : "text-slate-500"}>{area.label}</span>
                  {!area.built && <span className="ml-auto text-[10px] text-slate-600">soon</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-[#f42a41]/20 bg-[#f42a41]/5 p-4">
            <p className="text-xs font-bold text-[#f42a41] mb-1">
              ⚠️ Important
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              JesAI provides <strong className="text-white">legal literacy</strong> and{" "}
              <strong className="text-white">information only</strong> — not legal advice.
              For legal services, consult a certified{" "}
              <strong className="text-white">Bangladesh Bar Council</strong> advocate.
            </p>
          </div>
        </aside>

        {/* ── Chat Area ───────────────────────────────────── */}
        <main className="flex-1 rounded-xl border border-white/10 bg-[#0a1628] overflow-hidden flex flex-col min-h-[600px] lg:min-h-0">
          <div className="border-b border-white/10 px-4 py-3 bg-[#0d2240]/50">
            <h1 className="text-sm font-semibold text-white">
              JesAI Legal Consultation
            </h1>
            {/* Fixed: 20 free consistent with ChatInterface MAX_QUESTIONS */}
            <p className="text-xs text-slate-400">
              Free legal literacy · Bangladesh law · 20 questions free
            </p>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  );
}
