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
        {/* Sidebar */}
        <aside className="lg:w-72 flex-shrink-0 space-y-4">
          {/* JesAI Info Card */}
          <div className="rounded-xl border border-[#006a4e]/30 bg-[#0d2240] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#006a4e] flex items-center justify-center text-white font-bold text-xl">
                J
              </div>
              <div>
                <h2 className="text-white font-bold">JesAI</h2>
                <p className="text-xs text-[#4ade80]">Mother Legal AI</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained on all Bangladesh laws from{" "}
              <a
                href="https://bdlaws.minlaw.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4ade80] hover:underline"
              >
                bdlaws.minlaw.gov.bd
              </a>
              . JesAI uses IRAC reasoning to map your facts to the law.
            </p>
          </div>

          {/* How JesAI Thinks */}
          <div className="rounded-xl border border-white/10 bg-[#0d2240] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">
              How JesAI Thinks
            </h3>
            <div className="space-y-3">
              {[
                { icon: "👂", label: "Listens to your facts" },
                { icon: "❓", label: "Asks clarifying questions" },
                { icon: "🗺️", label: "Maps to Bangladesh laws" },
                { icon: "⚖️", label: "Substantive + Procedural" },
                { icon: "🎯", label: "Predicts consequences" },
                { icon: "📋", label: "Gives step-by-step guidance" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Law Areas Quick Access */}
          <div className="rounded-xl border border-white/10 bg-[#0d2240] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">
              Law Areas Covered
            </h3>
            <div className="space-y-1.5">
              {[
                { icon: "⚖️", label: "Constitutional Law" },
                { icon: "🔒", label: "Criminal Law" },
                { icon: "🏠", label: "Property & Land" },
                { icon: "👨‍👩‍👧", label: "Family Law" },
                { icon: "📝", label: "Contract Law" },
                { icon: "🏭", label: "Labour Law" },
                { icon: "💼", label: "Company Law" },
                { icon: "💰", label: "Tax Law" },
                { icon: "🏛️", label: "Administrative Law" },
                { icon: "📜", label: "Evidence Law" },
              ].map((area) => (
                <div
                  key={area.label}
                  className="flex items-center gap-2 text-xs text-slate-400 py-1"
                >
                  <span>{area.icon}</span>
                  <span>{area.label}</span>
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

        {/* Chat Area */}
        <main className="flex-1 rounded-xl border border-white/10 bg-[#0a1628] overflow-hidden flex flex-col min-h-[600px] lg:min-h-0">
          <div className="border-b border-white/10 px-4 py-3 bg-[#0d2240]/50">
            <h1 className="text-sm font-semibold text-white">
              JesAI Legal Consultation
            </h1>
            <p className="text-xs text-slate-400">
              Free legal literacy • Bangladesh law • 20 questions free
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
