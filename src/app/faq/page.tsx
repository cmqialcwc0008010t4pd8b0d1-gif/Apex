import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is ApexEdge Trading Academy?",
      a: "ApexEdge is an independent digital financial education platform focused on article-based deep dives into institutional market structure, liquidity engineering, and mathematical risk management. We also provide interactive scenario challenges and daily habit-building lessons.",
    },
    {
      q: "Why are the courses article-based instead of video?",
      a: "Academic and cognitive retention studies consistently show that active reading, note-taking, and studying written formulas and annotated chart diagrams provide superior conceptual retention compared to passive video watching. Our articles feature callout boxes, important risk notes, and searchable terminology.",
    },
    {
      q: "How much does membership cost and how do I pay?",
      a: "Membership is a one-time fee of $20 with no recurring monthly subscriptions. Payments are conducted via external blockchain transfer (USDT on BEP20 or TRC20 network) to a treasury wallet configured by our administration. Once you submit your transaction hash and receipt, our compliance officers verify it on-chain.",
    },
    {
      q: "How long does manual payment review take?",
      a: "The standard verification window is 2 to 3 hours. All payments are verified manually on the blockchain explorer to ensure exact network, receiving address, and dollar amount accuracy.",
    },
    {
      q: "Can I withdraw my membership fee or earn investment dividends?",
      a: "No. ApexEdge is strictly an educational institution. Membership fees are not investment capital, pooled fund deposits, or interest-bearing balances. We do not engage in automated trading, fund management, or profit distribution.",
    },
    {
      q: "How does the referral program work?",
      a: "Each registered user receives a unique Student ID and referral link. Referral relationships are tracked across 10 levels. In accordance with direct-selling legal compliance standards, multi-level cash distributions remain disabled until regulatory clearance is formalized. All relationship records are maintained in an immutable ledger.",
    },
    {
      q: "What if I forget my password?",
      a: "Because we do not rely on paid SMS/OTP third parties, we provide an admin-assisted identity recovery workflow where you can submit a password reset ticket with your unique Student ID and registered mobile number.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Help & Clarifications</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Everything you need to know about our curriculum, manual payment processing, and platform policies.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="finance-card p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-start gap-3">
                  <span className="text-teal-400 font-mono">Q{i + 1}.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-slate-300 pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
