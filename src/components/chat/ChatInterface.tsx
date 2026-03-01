"use client";

import { useState, useRef, useEffect } from "react";

type MessageRole = "user" | "ai" | "system";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ConversationState {
  stage:
    | "greeting"
    | "gathering_facts"
    | "clarifying"
    | "law_mapping"
    | "consequence"
    | "procedure"
    | "complete";
  lawArea: string | null;
  coreIssue: string | null;
  questionCount: number;
}

// JesAI reasoning engine — simulates the Mother AI workflow
function jesAIRespond(
  userMessage: string,
  state: ConversationState,
  history: Message[]
): { response: string; newState: ConversationState } {
  const msg = userMessage.toLowerCase().trim();
  const newState = { ...state };
  newState.questionCount = state.questionCount + 1;

  // Stage: greeting → gather facts
  if (state.stage === "greeting") {
    newState.stage = "gathering_facts";

    // Detect law area from initial message
    if (
      msg.includes("land") ||
      msg.includes("property") ||
      msg.includes("জমি") ||
      msg.includes("mutation") ||
      msg.includes("deed")
    ) {
      newState.lawArea = "Property & Land Law";
    } else if (
      msg.includes("divorce") ||
      msg.includes("marriage") ||
      msg.includes("talaq") ||
      msg.includes("custody") ||
      msg.includes("maintenance") ||
      msg.includes("dower")
    ) {
      newState.lawArea = "Family Law";
    } else if (
      msg.includes("arrest") ||
      msg.includes("fir") ||
      msg.includes("police") ||
      msg.includes("crime") ||
      msg.includes("bail") ||
      msg.includes("case") ||
      msg.includes("accused")
    ) {
      newState.lawArea = "Criminal Law";
    } else if (
      msg.includes("contract") ||
      msg.includes("agreement") ||
      msg.includes("breach") ||
      msg.includes("payment")
    ) {
      newState.lawArea = "Contract Law";
    } else if (
      msg.includes("job") ||
      msg.includes("employment") ||
      msg.includes("salary") ||
      msg.includes("fired") ||
      msg.includes("termination") ||
      msg.includes("labour")
    ) {
      newState.lawArea = "Labour Law";
    } else if (
      msg.includes("tax") ||
      msg.includes("vat") ||
      msg.includes("income") ||
      msg.includes("nbr")
    ) {
      newState.lawArea = "Tax Law";
    } else if (
      msg.includes("company") ||
      msg.includes("business") ||
      msg.includes("rjsc") ||
      msg.includes("corporate")
    ) {
      newState.lawArea = "Company & Commercial Law";
    } else if (
      msg.includes("constitution") ||
      msg.includes("rights") ||
      msg.includes("fundamental") ||
      msg.includes("writ") ||
      msg.includes("high court")
    ) {
      newState.lawArea = "Constitutional Law";
    }

    newState.coreIssue = userMessage;
    newState.stage = "clarifying";

    const areaText = newState.lawArea
      ? `\n\n📌 **Identified Area:** ${newState.lawArea}`
      : "";

    return {
      response: `Thank you for sharing your situation. Let me understand this properly.${areaText}

**Core Issue I've noted:** "${userMessage}"

To give you accurate legal information, I need a few clarifying details:

1. **Who are the parties involved?** (e.g., you, a family member, a company, government authority)
2. **When did this happen or when did the issue start?** (approximate date/year)
3. **What outcome are you hoping for?** (e.g., get money back, stop something, understand your rights)

Please answer any or all of these — even partial information helps me map the right laws for you.`,
      newState,
    };
  }

  // Stage: clarifying → law mapping
  if (state.stage === "clarifying") {
    newState.stage = "law_mapping";

    const lawArea = state.lawArea || "General Bangladesh Law";

    let lawMapping = "";
    let procedureInfo = "";

    if (lawArea === "Property & Land Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Transfer of Property Act 1882 — governs sale, mortgage, lease, gift of property
• Registration Act 1908 — mandatory registration of property documents
• State Acquisition and Tenancy Act 1950 — land ownership and tenancy rights
• Land Survey Tribunal Act 2023 — land dispute resolution
• Limitation Act 1908 — time limits for property claims`;

      procedureInfo = `**Procedural Steps:**
1. Collect all documents: deed, mutation record (khatian), CS/RS/BS maps
2. Check land records at local AC Land office or online (land.gov.bd)
3. For disputes: file case at Civil Court (Artha Rin Adalat for mortgage disputes)
4. For mutation: apply at Union Land Office with required documents
5. For registration issues: approach Sub-Registrar office`;
    } else if (lawArea === "Criminal Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Penal Code 1860 — defines offenses and punishments
• Code of Criminal Procedure 1898 (CrPC) — criminal trial process
• Special Powers Act, Digital Security Act, Anti-Corruption Act (if applicable)
• Evidence Act 1872 — what proof is admissible`;

      procedureInfo = `**Procedural Steps:**
1. **If victim:** File FIR (First Information Report) at nearest Police Station
2. Police investigates → files charge sheet (if evidence found)
3. Case goes to Magistrate Court → Sessions Court for serious offenses
4. **For bail:** Apply to Magistrate (for bailable offenses) or Sessions Judge
5. **If falsely accused:** Apply for anticipatory bail; challenge in High Court if needed`;
    } else if (lawArea === "Family Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Muslim Family Laws Ordinance 1961 — marriage, divorce, polygamy
• Family Courts Ordinance 1985 — family dispute resolution
• Guardians and Wards Act 1890 — child custody
• Dowry Prohibition Act 1980 — dower/dowry rights
• Hindu Marriage Act (for Hindu families)`;

      procedureInfo = `**Procedural Steps:**
1. **For divorce (Muslim):** Husband gives talaq notice to Union Parishad Chairman; 90-day reconciliation period
2. **For wife-initiated divorce (Khul):** File petition in Family Court
3. **For maintenance:** File suit in Family Court (District Judge level)
4. **For custody:** File application in Family Court with child's welfare as primary consideration
5. **Documents needed:** Nikah Nama (marriage certificate), NID, birth certificates`;
    } else if (lawArea === "Labour Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Bangladesh Labour Act 2006 (amended 2013, 2018) — core employment law
• Bangladesh Labour Rules 2015 — implementation rules
• EPZ Labour Act 2019 — for EPZ workers
• Workmen's Compensation Act 1923 — workplace injury`;

      procedureInfo = `**Procedural Steps:**
1. **For wrongful termination:** File complaint with Labour Court within 30 days
2. **For unpaid wages:** Complain to Department of Inspection for Factories and Establishments
3. **For gratuity/provident fund:** File claim with employer first, then Labour Court
4. **Documents needed:** Appointment letter, salary slips, termination letter, service record`;
    } else if (lawArea === "Contract Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Contract Act 1872 — formation, performance, breach, remedies
• Specific Relief Act 1877 — specific performance and injunctions
• Limitation Act 1908 — 3 years for contract suits (generally)
• Arbitration Act 2001 — if arbitration clause exists`;

      procedureInfo = `**Procedural Steps:**
1. **Send legal notice** to breaching party (through advocate)
2. **Attempt negotiation/mediation** first (saves time and cost)
3. **If arbitration clause:** Initiate arbitration proceedings
4. **File civil suit** in Civil Court (jurisdiction based on contract value/location)
5. **For specific performance:** File in Civil Court for court order to perform contract`;
    } else if (lawArea === "Tax Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Income Tax Ordinance 1984 (and Finance Acts) — income tax
• Value Added Tax and Supplementary Duty Act 2012 — VAT
• Customs Act 1969 — import/export duties
• NBR SROs and Notifications — regulatory updates`;

      procedureInfo = `**Procedural Steps:**
1. **For tax disputes:** File objection with Deputy Commissioner of Taxes (DCT)
2. **Appeal:** Commissioner of Taxes (Appeals) → Taxes Appellate Tribunal
3. **For VAT disputes:** Commissioner (Appeals) → VAT Appellate Tribunal
4. **Documents:** TIN certificate, tax returns, assessment orders, financial statements`;
    } else if (lawArea === "Company & Commercial Law") {
      lawMapping = `**Applicable Laws (Substantive):**
• Companies Act 1994 — company formation, governance, winding up
• Securities and Exchange Ordinance 1969 — capital markets
• Trade Organizations Ordinance 1961 — trade bodies
• Partnership Act 1932 — partnerships`;

      procedureInfo = `**Procedural Steps:**
1. **Company registration:** Apply to RJSC (Registrar of Joint Stock Companies)
2. **Required documents:** MOA, AOA, Form I, Form VI, Form XII, NID of directors
3. **For disputes:** Company Court (High Court Division) for winding up
4. **For securities violations:** Bangladesh Securities and Exchange Commission (BSEC)`;
    } else {
      lawMapping = `**Applicable Laws (Substantive):**
• Bangladesh Constitution 1972 — fundamental rights and state obligations
• Specific acts depend on your exact situation
• All Bangladesh laws available at: bdlaws.minlaw.gov.bd`;

      procedureInfo = `**General Procedural Guidance:**
1. Identify the specific right or obligation at issue
2. Determine which court or authority has jurisdiction
3. Gather relevant documents and evidence
4. Consider consulting a Bangladesh Bar Council advocate for your specific case`;
    }

    newState.stage = "consequence";

    return {
      response: `Based on your situation, here is the legal information:

---

${lawMapping}

---

${procedureInfo}

---

⚠️ **Consequence Awareness:**
• **If you act promptly:** You preserve your legal rights and remedies within limitation periods
• **If you delay:** Some rights may be time-barred (Limitation Act applies)
• **If you proceed without proper documentation:** Your case may be weakened

---

Do you want me to:
**A)** Explain any specific law in more detail
**B)** Walk through the step-by-step procedure for your specific situation
**C)** Explain what documents you need to gather
**D)** Explain the possible outcomes (positive/negative)

Type A, B, C, or D — or ask your specific follow-up question.`,
      newState,
    };
  }

  // Stage: consequence/follow-up
  if (state.stage === "consequence" || state.stage === "complete") {
    newState.stage = "complete";

    if (msg === "a" || msg.includes("explain") || msg.includes("detail")) {
      return {
        response: `I'll explain the key legal concepts for your situation in ${state.lawArea || "this area"}.

**Understanding the Law's Purpose:**
Every law in Bangladesh was created to balance individual rights with societal needs. The laws applicable to your situation were designed to:
• Protect the weaker party in disputes
• Provide clear remedies when rights are violated
• Ensure predictable outcomes for similar situations

**Key Legal Principles:**
• **Actus Reus** — the physical act or omission
• **Mens Rea** — the intention or knowledge behind the act
• **Burden of Proof** — who must prove what, and to what standard
• **Limitation** — time within which you must act

**Academic Note:**
Bangladesh law draws from British common law tradition, Islamic law (for personal matters), and indigenous customs. Courts interpret laws using both literal and purposive approaches.

Would you like me to explain any specific section or concept further? Or shall I help you understand the procedural steps in detail?`,
        newState,
      };
    }

    if (msg === "b" || msg.includes("step") || msg.includes("procedure") || msg.includes("how to")) {
      return {
        response: `Here is a detailed step-by-step procedural guide for your situation:

**Before You Begin — Checklist:**
□ Gather all relevant documents (originals + photocopies)
□ Note all dates, names, and amounts involved
□ Write a brief factual summary of events in chronological order
□ Identify all parties involved (full names, addresses, NID numbers if possible)

**Step 1: Informal Resolution (Try First)**
• Send a formal written notice to the other party
• Allow 15-30 days for response
• Keep copies of all correspondence

**Step 2: Alternative Dispute Resolution**
• Mediation through local government (Union Parishad/City Corporation)
• Arbitration if contract provides for it
• Village Court for minor disputes (up to BDT 75,000)

**Step 3: Formal Legal Action**
• Consult a Bangladesh Bar Council advocate
• File the appropriate application/plaint in the correct court
• Pay court fees (based on claim value)
• Serve notice on opposite party

**Step 4: Court Process**
• Written statement from defendant
• Framing of issues
• Evidence and witnesses
• Arguments
• Judgment and decree

**Important:** Limitation periods apply — act within the time allowed by law.

📌 **Remember:** This is procedural information. For actual legal representation, you need a certified advocate.`,
        newState,
      };
    }

    if (msg === "c" || msg.includes("document") || msg.includes("paper")) {
      return {
        response: `Here are the key documents typically needed for your type of situation:

**Identity Documents (Always Required):**
□ National Identity Card (NID) — original and photocopy
□ Passport (if available)
□ Birth Certificate

**Situation-Specific Documents:**

${
  state.lawArea === "Property & Land Law"
    ? `**For Property Matters:**
□ Original deed (দলিল) — sale deed, gift deed, etc.
□ Khatian (খতিয়ান) — CS, SA, RS, BS records
□ Mutation certificate (নামজারি)
□ Tax receipts (খাজনার রশিদ)
□ Survey maps (মৌজা ম্যাপ)
□ Succession certificate (if inherited)`
    : state.lawArea === "Family Law"
    ? `**For Family Matters:**
□ Nikah Nama (marriage certificate)
□ Divorce notice/talaq papers (if applicable)
□ Children's birth certificates
□ Income proof (for maintenance claims)
□ Bank statements
□ Property documents (for asset division)`
    : state.lawArea === "Criminal Law"
    ? `**For Criminal Matters:**
□ FIR copy (if filed)
□ Medical certificate (if injury involved)
□ Witness information
□ Any written evidence (messages, contracts, receipts)
□ CCTV footage or photographs (if available)`
    : `**General Documents:**
□ All written agreements or contracts
□ Correspondence (letters, emails, messages)
□ Payment receipts or bank statements
□ Witness contact information
□ Any official notices received`
}

**How to Obtain Missing Documents:**
• Land records: AC Land office or land.gov.bd
• Birth/death certificates: Union Parishad or City Corporation
• Court records: Concerned court's record room
• Company documents: RJSC office

Need help understanding any specific document? Ask me!`,
        newState,
      };
    }

    if (msg === "d" || msg.includes("outcome") || msg.includes("consequence") || msg.includes("result")) {
      return {
        response: `Here is a balanced consequence analysis for your situation:

**✅ Positive Outcomes (If You Proceed Correctly):**
• Your legal rights are formally recognized and protected
• You may receive compensation, relief, or enforcement of your rights
• A court order provides enforceable protection
• Sets a precedent for future similar situations
• Deters the other party from repeating the violation

**⚠️ Challenges to Consider:**
• Court proceedings in Bangladesh can take time (months to years)
• Legal costs: court fees + advocate fees + miscellaneous expenses
• Emotional and time investment required
• Outcome depends on quality of evidence and legal representation
• Appeals by the other party can extend the process

**❌ Risks of Inaction:**
• Limitation period may expire — permanently losing your right to sue
• The other party may take advantage of your inaction
• Evidence may be lost or destroyed over time
• Situation may worsen (e.g., property encroachment continues)

**⚖️ Balanced Assessment:**
The strength of your case depends on:
1. Quality and completeness of your documents
2. Credibility of witnesses
3. Whether the law clearly supports your position
4. The specific facts of your situation

**Recommendation:**
Consult a certified Bangladesh Bar Council advocate to assess the specific strength of your case before proceeding.

Is there anything else you'd like to know about your legal situation?`,
        newState,
      };
    }

    // General follow-up
    return {
      response: `Thank you for your question. Based on Bangladesh law and your situation:

**Legal Information:**
The laws of Bangladesh — as available on bdlaws.minlaw.gov.bd — provide specific rights and remedies for situations like yours. The key principle is that every right has a corresponding remedy, and every wrong has a corresponding legal response.

**What You Can Do:**
1. Review the applicable laws I've mentioned
2. Gather your documents and evidence
3. Consider the procedural steps outlined
4. Consult a certified advocate for personalized legal advice

**Important Reminder:**
JesAI provides legal literacy and information — not legal advice. For your specific situation, a certified Bangladesh Bar Council advocate can provide proper legal counsel and representation.

Do you have any other questions about Bangladesh law? You have ${Math.max(0, 20 - state.questionCount)} free questions remaining.`,
      newState,
    };
  }

  // Default fallback
  return {
    response: `I understand your question. Let me help you navigate Bangladesh law.

Could you please tell me more about your specific situation? The more details you share, the better I can map the relevant laws and procedures for you.

**To help you best, please share:**
• What happened (the core facts)
• Who is involved
• What you want to achieve

Remember: JesAI provides legal information and literacy — not legal advice. For legal representation, consult a certified Bangladesh Bar Council advocate.`,
    newState,
  };
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "ai",
  content: `আস্সালামু আলাইকুম! Welcome to **JesAI** — Bangladesh's Legal Literacy Assistant. 🇧🇩

I am your Mother Legal AI, trained on Bangladesh laws from **bdlaws.minlaw.gov.bd**. I can help you understand:

• Your **legal rights and duties** under Bangladesh law
• **Which laws apply** to your situation
• **Step-by-step procedures** for courts, applications, and filings
• **Consequences** of different legal actions

**How to start:** Simply describe your situation in plain language — no legal jargon needed. I'll ask clarifying questions, map the relevant laws, and guide you through the process.

📌 **You have 20 free questions.** After that, subscribe for unlimited access with human legal assistance.

⚠️ *JesAI provides legal information and literacy only — not legal advice. For legal services, consult a certified Bangladesh Bar Council advocate.*

---

**What is your legal situation or question today?**`,
  timestamp: new Date(),
};

const QUICK_TOPICS = [
  "Land/property dispute",
  "Divorce or family matter",
  "Police case or FIR",
  "Employment/job issue",
  "Contract breach",
  "Tax or VAT question",
  "Company registration",
  "Constitutional rights",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: "greeting",
    lawArea: null,
    coreIssue: null,
    questionCount: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idCounterRef = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;
    if (questionCount >= 20) return;

    const userMessage: Message = {
      id: (idCounterRef.current++).toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setQuestionCount((c) => c + 1);

    // Simulate AI thinking delay
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 600)
    );

    const { response, newState } = jesAIRespond(
      messageText,
      conversationState,
      messages
    );

    const aiMessage: Message = {
      id: (idCounterRef.current++).toString(),
      role: "ai",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setConversationState(newState);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Convert markdown-like formatting to HTML-safe JSX
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // Bold text
      const formatted = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-semibold">$1</strong>'
      );
      // Bullet points
      if (line.startsWith("•") || line.startsWith("□")) {
        return (
          <div
            key={i}
            className="ml-2"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
      // Headers (lines ending with :)
      if (line.match(/^\*\*.*\*\*:?$/) || line.startsWith("**")) {
        return (
          <div
            key={i}
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
      if (line === "---") {
        return <hr key={i} className="border-white/10 my-2" />;
      }
      return (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }}
        />
      );
    });
  };

  const freeRemaining = Math.max(0, 20 - questionCount);

  return (
    <div className="flex flex-col h-full">
      {/* Free questions counter */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0d2240]/50">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-xs text-slate-400">JesAI is active</span>
          {conversationState.lawArea && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-[#c8a84b]">
                📌 {conversationState.lawArea}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              freeRemaining > 10
                ? "bg-[#006a4e]/20 text-[#4ade80]"
                : freeRemaining > 5
                ? "bg-[#c8a84b]/20 text-[#c8a84b]"
                : "bg-[#f42a41]/20 text-[#f42a41]"
            }`}
          >
            {freeRemaining} free questions left
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                message.role === "ai"
                  ? "bg-[#006a4e] text-white"
                  : "bg-[#c8a84b] text-[#0a1628]"
              }`}
            >
              {message.role === "ai" ? "J" : "U"}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "ai"
                  ? "bg-[#0d2240] border border-white/10 text-slate-300 rounded-tl-sm"
                  : "bg-[#006a4e] text-white rounded-tr-sm"
              }`}
            >
              {message.role === "ai" ? (
                <div className="space-y-0.5">
                  {formatMessage(message.content)}
                </div>
              ) : (
                <p>{message.content}</p>
              )}
              <div
                className={`text-[10px] mt-2 ${
                  message.role === "ai" ? "text-slate-600" : "text-green-200/60"
                }`}
              >
                {message.timestamp.toLocaleTimeString("en-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble flex gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#006a4e] flex items-center justify-center text-sm font-bold text-white">
              J
            </div>
            <div className="bg-[#0d2240] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="typing-dot h-2 w-2 rounded-full bg-[#4ade80]" />
                <div className="typing-dot h-2 w-2 rounded-full bg-[#4ade80]" />
                <div className="typing-dot h-2 w-2 rounded-full bg-[#4ade80]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick topic chips (show only at start) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-500 mb-2">Quick topics:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => sendMessage(topic)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#006a4e]/40 bg-[#006a4e]/10 text-[#4ade80] hover:bg-[#006a4e]/20 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Limit reached */}
      {questionCount >= 20 && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-[#c8a84b]/10 border border-[#c8a84b]/30 text-center">
          <p className="text-sm text-[#c8a84b] font-semibold">
            You&apos;ve used all 20 free questions
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Subscribe for unlimited access with human legal assistance
          </p>
          <button className="mt-2 px-4 py-1.5 rounded-lg bg-[#c8a84b] text-[#0a1628] text-xs font-bold hover:bg-[#b8943b] transition-colors">
            Subscribe Now
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 p-4 bg-[#0a1628]">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping || questionCount >= 20}
            placeholder={
              questionCount >= 20
                ? "Subscribe to continue..."
                : "Describe your legal situation in plain language..."
            }
            rows={2}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-[#0d2240] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#006a4e]/60 focus:ring-1 focus:ring-[#006a4e]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping || questionCount >= 20}
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-[#006a4e] flex items-center justify-center text-white hover:bg-[#005a40] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            aria-label="Send message"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
          JesAI provides legal information only — not legal advice. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
