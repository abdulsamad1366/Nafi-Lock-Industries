"use client";

import { useEffect, useState } from "react";

interface SalesRepAdminRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string | null;
  _count?: {
    distributorProfiles: number;
  };
}

export default function AdminSalesRepsPage() {
  const [reps, setReps] = useState<SalesRepAdminRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingRep, setEditingRep] = useState<SalesRepAdminRow | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchReps = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const res = await fetch("http://localhost:5001/api/admin/sales-reps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setReps(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReps();
  }, []);

  const handleOpenCreate = () => {
    setEditingRep(null);
    setName("");
    setEmail("");
    setPhone("");
    setShowModal(true);
  };

  const handleOpenEdit = (rep: SalesRepAdminRow) => {
    setEditingRep(rep);
    setName(rep.name);
    setEmail(rep.email);
    setPhone(rep.phone);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      const url = editingRep
        ? `http://localhost:5001/api/admin/sales-reps/${editingRep.id}`
        : "http://localhost:5001/api/admin/sales-reps";

      const method = editingRep ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (res.ok) {
        setShowModal(false);
        await fetchReps();
      } else {
        alert("Failed to save representative record");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sales representative?")) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nafi_admin_token") || "" : "";
      await fetch(`http://localhost:5001/api/admin/sales-reps/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchReps();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-divider">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Factory Sales Representatives
          </h1>
          <p className="text-xs text-muted">
            Manage regional account executives assigned to distributor commercial territories
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-xs"
        >
          Add Sales Rep +
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-xs text-muted font-mono">
          Loading representatives...
        </div>
      ) : reps.length === 0 ? (
        <div className="bg-surface border border-divider rounded-2xl p-12 text-center text-xs text-muted">
          No sales representatives added yet. Click &quot;Add Sales Rep +&quot; to register your first commercial executive.
        </div>
      ) : (
        <div className="bg-surface border border-divider rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-background/60 border-b border-divider text-muted font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Representative Name</th>
                <th className="p-4">Direct Email</th>
                <th className="p-4">Phone / WhatsApp</th>
                <th className="p-4">Assigned Dealers</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {reps.map((rep) => (
                <tr key={rep.id} className="hover:bg-background/40 transition-colors">
                  <td className="p-4 font-serif font-bold text-sm text-primary">
                    {rep.name}
                  </td>
                  <td className="p-4 font-mono text-muted">{rep.email}</td>
                  <td className="p-4 font-mono text-accent font-semibold">
                    {rep.phone}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-background border border-divider text-primary">
                      {rep._count?.distributorProfiles || 0} Accounts
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rep)}
                        className="px-3 py-1 bg-surface border border-divider hover:border-accent text-xs font-semibold rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rep.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface border border-divider rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-primary">
              {editingRep ? "Edit Sales Representative" : "Add Sales Representative"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@nafilockindustries.com"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 90455 82310"
                  className="w-full bg-background border border-divider rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-hidden focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-divider">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-muted hover:text-primary rounded-full border border-divider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-accent text-background font-serif font-bold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-md disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Representative"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
