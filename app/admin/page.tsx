"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { 
  PlayCircle, 
  Calendar, 
  Users, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    sessions: 0,
    events: 0,
    team: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: sessionsCount },
        { count: eventsCount },
        { count: teamCount }
      ] = await Promise.all([
        supabase.from("sessions").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        sessions: sessionsCount || 0,
        events: eventsCount || 0,
        team: teamCount || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total Sessions", value: stats.sessions, icon: PlayCircle, href: "/admin/sessions", color: "text-blue-400" },
    { label: "Active Events", value: stats.events, icon: Calendar, href: "/admin/events", color: "text-emerald-400" },
    { label: "Team Members", value: stats.team, icon: Users, href: "/admin/team", color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="heading-1 text-5xl">Dashboard</h1>
        <p className="body-text opacity-50">Welcome to the TTA management portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.label} 
              href={card.href}
              className="glass-card p-8 flex flex-col gap-6 hover:ring-1 hover:ring-accent/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                  <Icon size={24} />
                </div>
                <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="small-text uppercase tracking-widest opacity-40">{card.label}</span>
                <span className="text-4xl font-black">{loading ? "..." : card.value}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="glass-card p-10 bg-accent/5 border-accent/20 flex flex-col gap-6">
        <h2 className="heading-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/sessions/new" className="button-primary">Create New Session</Link>
          <Link href="/admin/events/new" className="button-secondary">Schedule Event</Link>
          <Link href="/admin/site" className="button-secondary border-white/10 hover:border-white/20">Update SEO Metadata</Link>
        </div>
      </div>
    </div>
  );
}
