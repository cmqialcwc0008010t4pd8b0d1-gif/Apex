import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Award, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export default async function BonusPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bonusSlabs = await prisma.bonusSetting.findMany({
    orderBy: { bonusAmount: "asc" },
  });

  // Calculate user direct and team counts
  const directCount = await prisma.user.count({
    where: { referredById: user.id },
  });

  const directList = await prisma.user.findMany({
    where: { referredById: user.id },
    select: { id: true },
  });
  const level2Count = await prisma.user.count({
    where: { referredById: { in: directList.map((d) => d.id) } },
  });
  const totalTeam = directCount + level2Count;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Team Performance Bonus Slabs</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configurable weekly achievement rewards acknowledging mentors who build active student study groups.
        </p>
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/80 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          <span>Reward Governance Notice:</span>
        </div>
        <p className="leading-relaxed">
          Bonus rewards are configurable and contingent on verified corporate treasury revenue. Actual bonus disbursements remain in disabled mode until the compensation structure has received independent regulatory clearance.
        </p>
      </div>

      {/* Student Current Standing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Direct Referrals</div>
          <div className="text-2xl font-bold text-teal-400">{directCount} Active Students</div>
          <div className="text-[10px] text-slate-400">Required for slab qualification</div>
        </div>

        <div className="finance-card p-5 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Total Team Size</div>
          <div className="text-2xl font-bold text-emerald-400">{totalTeam} Total Members</div>
          <div className="text-[10px] text-slate-400">Multi-tier organization volume</div>
        </div>
      </div>

      {/* Bonus Slabs Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Configured Achievement Slabs</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bonusSlabs.map((slab) => {
            const qualified = directCount >= slab.minDirectReferrals && totalTeam >= slab.minTeamSize;
            return (
              <div
                key={slab.id}
                className={`finance-card p-6 space-y-4 relative flex flex-col justify-between ${
                  qualified ? "border-teal-500 bg-teal-950/20" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{slab.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        slab.isActive ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {slab.isActive ? "ACTIVE" : "CONFIG ONLY"}
                    </span>
                  </div>

                  <div className="text-3xl font-extrabold text-white">
                    ${slab.bonusAmount.toFixed(0)} <span className="text-xs font-normal text-slate-400">/ {slab.periodType.toLowerCase()}</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Direct Referrals Required:</span>
                      <strong className="text-white">{slab.minDirectReferrals}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Team Required:</span>
                      <strong className="text-white">{slab.minTeamSize}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Maintenance Deduction:</span>
                      <strong className="text-white">{slab.maintenanceDeductionPct}%</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  {qualified ? (
                    <div className="p-2 rounded-lg bg-teal-950 text-teal-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-teal-800">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Threshold Qualified</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-500 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-800">
                      <Lock className="w-4 h-4" />
                      <span>Pending Thresholds</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
