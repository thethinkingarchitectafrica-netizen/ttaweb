"use client";

import { useEffect, useState } from "react";
import { getSubscribers, deleteSubscriber } from "@/app/lib/admin-service";
import { Mail, Clock, Trash2, User, Search, Download } from "lucide-react";
import { useToast } from "@/app/components/Toast";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;
    try {
      await deleteSubscriber(email);
      setSubscribers(subscribers.filter(s => s.email !== email));
    } catch (err) {
      toast("Failed to remove subscriber.", "error");
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ["Email", "Name", "Source", "Subscribed At"];
    const rows = filteredSubscribers.map(s => [
      s.email,
      s.name || "",
      s.source || "footer",
      new Date(s.subscribed_at).toISOString()
    ]);
    const content = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tta_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="heading-1 text-5xl">Community</h1>
          <p className="body-text opacity-50 uppercase tracking-[0.2em] text-[10px]">Newsletter Subscribers</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="glass-card p-2 border-white/5 flex items-center gap-4 px-6 bg-white/[0.02]">
        <Search size={20} className="opacity-20" />
        <input 
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent py-4 text-white outline-none placeholder:opacity-30"
        />
        <div className="px-3 py-1 bg-white/5 rounded text-[10px] uppercase font-bold opacity-40">
           {filteredSubscribers.length} found
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/40">
              <th className="p-6 font-bold">Subscriber</th>
              <th className="p-6 font-bold">Source</th>
              <th className="p-6 font-bold">Date Joined</th>
              <th className="p-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSubscribers.map((sub) => (
              <tr key={sub.email} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent ring-1 ring-accent/20">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{sub.email}</span>
                      <span className="text-xs opacity-40 capitalize">{sub.name || "Anonymous Member"}</span>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-xs opacity-60 uppercase tracking-widest">{sub.source || 'footer'}</span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-xs opacity-60">
                    <Clock size={14} />
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(sub.email)}
                      className="p-3 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                      title="Remove Subscriber"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubscribers.length === 0 && (
           <div className="p-20 text-center opacity-20 flex flex-col items-center gap-4">
              <Mail size={48} />
              <p className="body-text">No subscribers found.</p>
           </div>
        )}
      </div>
    </div>
  );
}
