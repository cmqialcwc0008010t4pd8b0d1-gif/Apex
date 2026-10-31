import Link from "next/link";
import { ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-[#070D19] border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                APEX<span className="text-teal-400">EDGE</span> ACADEMY
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              An independent financial education platform delivering institutional market structure, order book liquidity analysis, and quantitative risk management.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@apexedgetrading.internal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>+1-800-APEX-EDU (Compliance Desk)</span>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Curriculum</h4>
            <ul className="space-y-2">
              <li><Link href="/courses" className="hover:text-teal-400 transition-colors">All Courses</Link></li>
              <li><Link href="/courses#price-action" className="hover:text-teal-400 transition-colors">Price Action & Structure</Link></li>
              <li><Link href="/courses#risk-management" className="hover:text-teal-400 transition-colors">Risk Management 101</Link></li>
              <li><Link href="/courses#psychology" className="hover:text-teal-400 transition-colors">Trader Psychology</Link></li>
              <li><Link href="/how-it-works" className="hover:text-teal-400 transition-colors">Interactive Games</Link></li>
            </ul>
          </div>

          {/* Membership & Network */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/membership" className="hover:text-teal-400 transition-colors">Membership Overview</Link></li>
              <li><Link href="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link></li>
              <li><Link href="/referral-program" className="hover:text-teal-400 transition-colors">Referral Architecture</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">Knowledge Base & FAQ</Link></li>
              <li><Link href="/login" className="hover:text-teal-400 transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-teal-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/risk-disclosure" className="text-amber-400/90 hover:text-amber-300 transition-colors">Risk Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Risk Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500 space-y-3 leading-relaxed">
          <p className="font-semibold text-slate-400">
            MANDATORY RISK DISCLOSURE & REGULATORY STATUS:
          </p>
          <p>
            ApexEdge Trading Academy operates exclusively as an educational publishing platform. We are not registered as an investment advisor, broker-dealer, or portfolio manager with any regulatory agency. The educational materials, articles, and interactive simulations provided are solely for intellectual enrichment. Under no circumstances should any content be construed as financial advice or an inducement to trade live capital. Speculative trading entails severe risk of total capital loss.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 text-slate-500">
            <p>&copy; {new Date().getFullYear()} ApexEdge Trading Academy. All rights reserved.</p>
            <p className="text-[11px] mt-2 sm:mt-0 text-slate-400">Self-Contained Secure Architecture &bull; V1.0 Production Release</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
