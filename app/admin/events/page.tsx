"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { logAction } from "@/app/lib/admin-service";
import { Plus, Edit2, Trash2, Calendar as CalIcon, Clock, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export default function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (!error) {
        await logAction("delete_event", id);
        fetchEvents();
      }
    }
  };

  const toggleUpcoming = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("events")
      .update({ is_upcoming: !currentStatus })
      .eq("id", id);
    
    if (!error) {
      await logAction("toggle_event_status", id);
      fetchEvents();
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="heading-1 text-5xl">Events</h1>
          <p className="body-text opacity-50">Manage upcoming talks and past sessions.</p>
        </div>
        <Link href="/admin/events/new" className="button-primary flex items-center gap-2 w-fit">
          <Plus size={20} />
          <span>Schedule Event</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div key={event.id} className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-accent/20 transition-all">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${event.is_upcoming ? 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20' : 'bg-white/5 text-white/40'}`}>
                    {event.is_upcoming ? 'Upcoming' : 'Past'}
                  </span>
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 small-text opacity-60">
                  <div className="flex items-center gap-2">
                    <CalIcon size={14} className="text-accent" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-accent" />
                    <span>{event.speaker}</span>
                  </div>
                </div>

                <p className="body-text text-sm line-clamp-2 opacity-50">
                   {event.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleUpcoming(event.id, event.is_upcoming)}
                  className={`p-3 rounded-xl transition-all ${event.is_upcoming ? 'text-emerald-400 bg-emerald-400/5' : 'text-white/20 hover:text-white/40'}`}
                  title={event.is_upcoming ? "Mark as Past" : "Set as Upcoming"}
                >
                  {event.is_upcoming ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <Link 
                  href={`/admin/events/edit/${event.id}`}
                  className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-accent transition-all"
                >
                  <Edit2 size={20} />
                </Link>
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="p-3 rounded-xl hover:bg-red-400/10 text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
