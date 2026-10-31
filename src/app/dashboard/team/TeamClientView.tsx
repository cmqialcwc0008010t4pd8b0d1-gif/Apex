"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Network, Users, Search, ShieldCheck, Filter, User } from "lucide-react";

export default function TeamClientView({
  user,
  networkData,
  totalMembers,
  level1Count,
  level2Count,
  level3Count,
}: {
  user: any;
  networkData: any[];
  totalMembers: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
}) {
  const [selectedLevel, setSelectedLevel] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = networkData.filter((member) => {
    const matchesLevel = selectedLevel === "ALL" || member.level === selectedLevel;
    const matchesQuery =
      searchQuery === "" ||
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.uniqueUserId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesQuery;
  });

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Team Network Visualization</h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect your multi-tier organizational tree across Level 1 down to Level 10.
        </p>
      </div>

      {/* Network Slabs Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Organization</div>
          <div className="text-xl font-bold text-white">{totalMembers} Members</div>
          <div className="text-[10px] text-teal-400">All Levels Combined</div>
        </div>

        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Level 1 (Direct)</div>
          <div className="text-xl font-bold text-teal-400">{level1Count} Students</div>
          <div className="text-[10px] text-slate-400">1st Degree Children</div>
        </div>

        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Level 2 (Tier 2)</div>
          <div className="text-xl font-bold text-emerald-400">{level2Count} Students</div>
          <div className="text-[10px] text-slate-400">2nd Degree Children</div>
        </div>

        <div className="finance-card p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Level 3 (Tier 3)</div>
          <div className="text-xl font-bold text-white">{level3Count} Students</div>
          <div className="text-[10px] text-slate-400">3rd Degree Children</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="finance-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedLevel("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedLevel === "ALL" ? "bg-teal-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            All Levels ({totalMembers})
          </button>
          <button
            onClick={() => setSelectedLevel(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedLevel === 1 ? "bg-teal-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Level 1 ({level1Count})
          </button>
          <button
            onClick={() => setSelectedLevel(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedLevel === 2 ? "bg-teal-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Level 2 ({level2Count})
          </button>
          <button
            onClick={() => setSelectedLevel(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedLevel === 3 ? "bg-teal-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Level 3 ({level3Count})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name or ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Network Hierarchy Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Network Members</h3>
            <p className="text-xs text-slate-400 mt-0.5">Parent-child hierarchical organization.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Showing {filteredData.length} records</span>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No team members found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold">Tier Level</th>
                  <th className="py-3 px-3 font-semibold">Student ID</th>
                  <th className="py-3 px-3 font-semibold">Full Name</th>
                  <th className="py-3 px-3 font-semibold">Direct Sponsor (Parent)</th>
                  <th className="py-3 px-3 font-semibold">Enrolled Date</th>
                  <th className="py-3 px-3 font-semibold">Account Status</th>
                  <th className="py-3 px-3 font-semibold">Membership</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredData.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-teal-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        L{member.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{member.uniqueUserId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{member.fullName}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {member.parentName} <span className="font-mono text-[10px] text-teal-400">({member.parentId})</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatDate(member.createdAt)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {member.accountStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.membershipStatus === "ACTIVE"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {member.membershipStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
