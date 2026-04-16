"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { logAction } from "@/app/lib/admin-service";
import { Plus, Edit2, Trash2, Mail } from "lucide-react";
import Link from "next/link";

export default function TeamAdmin() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setMembers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (!error) {
        await logAction("delete_team_member", id);
        fetchMembers();
      }
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="heading-1 text-5xl">Team</h1>
          <p className="body-text opacity-50">Manage the TTA core team and contributors.</p>
        </div>
        <Link href="/admin/team/new" className="button-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          <span>Add Member</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-8 flex flex-col gap-6 group hover:border-accent/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/team/edit/${member.id}`}
                    className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-accent transition-all"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="p-3 rounded-xl hover:bg-red-400/10 text-white/20 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="small-text text-accent uppercase tracking-widest text-[11px]">{member.role}</p>
              </div>

              <p className="body-text text-sm opacity-50 line-clamp-3">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
