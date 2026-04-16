"use client";

import { useEffect, useState } from "react";
import { getAdminLogs } from "@/app/lib/admin-service";
import { Activity, Clock, User, Shield, Info } from "lucide-react";

export default function ActivityFeed() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getAdminLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toUpperCase();
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
      <div className="flex flex-col gap-2">
        <h1 className="heading-1 text-5xl">Activity Audit</h1>
        <p className="body-text opacity-50 uppercase tracking-[0.2em] text-[10px]">Track Admin Actions</p>
      </div>

      <div className="flex flex-col gap-4">
        {logs.length === 0 ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center gap-4 opacity-30 text-center">
            <Activity size={48} />
            <p className="body-text">No activity logged yet.<br/>Actions will appear here as you manage the site.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                   <Activity size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-accent tracking-tighter">{formatAction(log.action)}</span>
                    <span className="body-text text-sm opacity-60">{log.target_name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] opacity-40 uppercase tracking-widest font-medium">
                    <div className="flex items-center gap-1">
                      <User size={10} />
                      <span>{log.user_email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/20">
                <Shield size={14} />
                <span className="text-[10px] uppercase tracking-widest">Verified Action</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
