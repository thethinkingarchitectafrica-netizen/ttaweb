"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { logAction } from "@/app/lib/admin-service";
import { Session } from "../../lib/content";
import { Plus, Edit2, Trash2, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SessionsAdmin() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) {
      setSessions(data as Session[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (!error) {
        await logAction("delete_session", id);
        fetchSessions();
      }
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.speaker?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="heading-1 text-5xl">Sessions</h1>
          <p className="body-text opacity-50">Manage the TTA lecture archive.</p>
        </div>
        <Link href="/admin/sessions/new" className="button-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          <span>Add Session</span>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
        <input 
          type="text"
          placeholder="Search by title or speaker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:ring-1 focus:ring-accent transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-accent/20 transition-all">
              <div className="relative w-full md:w-32 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0">
                <Image 
                  src={session.thumbnailUrl} 
                  alt={session.title} 
                  fill 
                  className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
              
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <h3 className="text-xl font-bold truncate">{session.title}</h3>
                <div className="flex items-center gap-2 text-sm opacity-50">
                  <span className="text-accent">{session.speaker}</span>
                  <span>•</span>
                  <span>{session.date}</span>
                  <span>•</span>
                  <span>{session.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={session.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                  title="View Video"
                >
                  <ExternalLink size={18} />
                </a>
                <Link 
                  href={`/admin/sessions/edit/${session.id}`}
                  className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-accent transition-all"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(session.id)}
                  className="p-3 rounded-xl hover:bg-red-400/10 text-white/40 hover:text-red-400 transition-all"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="py-20 text-center glass-card border-dashed border-white/10 opacity-50">
              No sessions found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
