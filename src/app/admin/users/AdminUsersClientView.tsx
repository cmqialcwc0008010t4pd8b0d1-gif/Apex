"use client";

import { useState } from "react";
import { updateUserManagement } from "@/app/actions/admin";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils";
import { Users, Search, ShieldCheck, Lock, Edit3, CheckCircle2, User, Phone, Calendar } from "lucide-react";

export default function AdminUsersClientView({ users }: { users: any[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit fields
  const [editRole, setEditRole] = useState("USER");
  const [editAccountStatus, setEditAccountStatus] = useState("ACTIVE");
  const [editMembershipStatus, setEditMembershipStatus] = useState("PENDING");

  const openEditModal = (u: any) => {
    setSelectedUser(u);
    setEditRole(u.role);
    setEditAccountStatus(u.accountStatus);
    setEditMembershipStatus(u.membershipStatus);
  };

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("userId", selectedUser.id);
    formData.append("role", editRole);
    formData.append("accountStatus", editAccountStatus);
    formData.append("membershipStatus", editMembershipStatus);

    await updateUserManagement(formData);
    setSaving(false);
    setSelectedUser(null);
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.uniqueUserId.toLowerCase().includes(search.toLowerCase()) ||
      u.mobileNumber.includes(search);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.membershipStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Student & User Management</h2>
        <p className="text-xs text-slate-400 mt-1">
          Full student directory, permanent unique identifiers, membership states, and account status controls.
        </p>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="finance-card p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Manage User: {selectedUser.fullName} ({selectedUser.uniqueUserId})
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white text-xs">
                Close
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div>Mobile: <strong className="text-white font-mono">{selectedUser.mobileNumber}</strong></div>
              <div>Referral Code: <strong className="text-teal-400 font-mono">{selectedUser.referralCode}</strong></div>
              <div>Sponsor: <span className="text-slate-300">{selectedUser.referrer ? `${selectedUser.referrer.fullName} (${selectedUser.referrer.uniqueUserId})` : "Direct Academy"}</span></div>
              <div>Enrolled: <span className="text-slate-400">{formatDate(selectedUser.createdAt)}</span></div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="USER">Student (Standard User)</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="FINANCE_ADMIN">Finance Admin</option>
                  <option value="COURSE_MANAGER">Course Manager</option>
                  <option value="SUPPORT_ADMIN">Support Admin</option>
                  <option value="ANALYST">Analyst</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Access Standing</label>
                <select
                  value={editAccountStatus}
                  onChange={(e) => setEditAccountStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="ACTIVE">ACTIVE (Normal Access)</option>
                  <option value="SUSPENDED">SUSPENDED (Locked by Compliance)</option>
                  <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Membership Syllabus Access</label>
                <select
                  value={editMembershipStatus}
                  onChange={(e) => setEditMembershipStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="ACTIVE">ACTIVE (Full $20 Curriculum Access)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Manual Verification in Progress)</option>
                  <option value="PENDING">PENDING (Awaiting Payment Submission)</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                >
                  {saving ? "Saving Changes..." : "Save User Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="finance-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or mobile..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Membership Statuses</option>
            <option value="ACTIVE">Active Membership</option>
            <option value="PENDING">Pending Activation</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Student (User)</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="FINANCE_ADMIN">Finance Admin</option>
          </select>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="finance-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Registered Users Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing {filteredUsers.length} accounts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Student ID</th>
                <th className="py-3 px-3 font-semibold">Full Name</th>
                <th className="py-3 px-3 font-semibold">Mobile Number</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold">Account Status</th>
                <th className="py-3 px-3 font-semibold">Membership</th>
                <th className="py-3 px-3 font-semibold">Direct Referrals</th>
                <th className="py-3 px-3 font-semibold">Articles Read</th>
                <th className="py-3 px-3 font-semibold text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-bold text-teal-400">{u.uniqueUserId}</td>
                  <td className="py-3 px-3 font-semibold text-white">{u.fullName}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{u.mobileNumber}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.accountStatus === "ACTIVE"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-rose-950 text-rose-400 border border-rose-800"
                      }`}
                    >
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.membershipStatus === "ACTIVE"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}
                    >
                      {u.membershipStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-bold">{u._count?.directReferrals || 0}</td>
                  <td className="py-3 px-3 text-teal-400 font-bold">{u._count?.articleProgress || 0}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
