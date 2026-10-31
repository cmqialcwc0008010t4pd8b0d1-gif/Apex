import { Lock, ShieldAlert, AlertTriangle, FileText } from "lucide-react";

export default function AdminInvestmentPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Investment Architecture & Regulatory Vault</h2>
        <p className="text-xs text-slate-400 mt-1">
          Future-ready module placeholder held strictly inactive under securities and fund management compliance policies.
        </p>
      </div>

      {/* Mandatory Statutory Prohibition Banner */}
      <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/80 space-y-3">
        <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>STATUTORY REGULATORY INACTIVATION NOTICE</span>
        </div>
        <p className="text-xs text-rose-200/90 leading-relaxed">
          In strict compliance with international securities legislation and non-custodial educational standards, this module is <strong>PERMANENTLY DISABLED</strong> in current production code. Under no circumstances does ApexEdge Trading Academy solicit investor capital, pool trading funds, guarantee yields, distribute trading profits, or act as an asset custodian.
        </p>
      </div>

      {/* Prohibited Operations Matrix */}
      <div className="finance-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white pb-2 border-b border-slate-800">
          Prohibited Operations Matrix (Enforced at Database Layer)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Collection of Investment Funds</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Disabled &mdash; No deposit accounts or investment ledgers allowed.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Pooled Trading Accounts (PAMM/MAM)</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Disabled &mdash; Platform does not connect to broker trade copiers.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Guaranteed Returns / Daily ROI</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Disabled &mdash; Speculative returns are mathematically unpredictable.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Profit Distribution Engine</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Disabled &mdash; No dividend, interest, or equity yields disbursed.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions for Future Architecture Evaluation */}
      <div className="finance-card p-6 space-y-3">
        <h4 className="text-sm font-bold text-white">Pre-Requisites for Future Architectural Activation:</h4>
        <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5 leading-relaxed">
          <li>Independent legal opinion letter from accredited securities counsel.</li>
          <li>Formal licensing as an Alternative Investment Fund Manager (AIFM) or Registered Investment Advisor (RIA) in applicable jurisdictions.</li>
          <li>Segregated qualified third-party custodian integration (e.g. Copper, BitGo, or Tier-1 Prime Broker).</li>
          <li>Comprehensive accredited investor verification and AML/KYC identity audits.</li>
        </ul>
      </div>
    </div>
  );
}
