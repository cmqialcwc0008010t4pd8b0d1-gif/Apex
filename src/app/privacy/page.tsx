import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120]">
      <PublicNavbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Data Protection</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Privacy & Data Governance Policy</h1>
            <p className="text-xs text-slate-400 mt-1">How we secure your identity and educational records.</p>
          </div>

          <div className="finance-card p-8 md:p-10 text-slate-300 leading-relaxed text-sm space-y-6">
            <div className="article-prose space-y-4">
              <h3 className="text-white font-bold text-lg">1. Information We Collect</h3>
              <p>
                We collect your full name, normalized mobile telephone number, and permanent unique student identifier. We never store plain-text passwords. All passwords are encrypted using one-way cryptographic hashing algorithms (bcrypt with high salt iterations).
              </p>

              <h3 className="text-white font-bold text-lg">2. No Third-Party Telephony Sharing</h3>
              <p>
                We do not integrate with third-party SMS marketing aggregators or sell student phone numbers. Your phone number is utilized strictly as an authentication identifier.
              </p>

              <h3 className="text-white font-bold text-lg">3. Financial Ledger Confidentiality</h3>
              <p>
                Blockchain transaction hashes and manual payment receipts submitted for verification are archived in a secure, audit-logged database and are solely inspected by certified compliance officers.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
