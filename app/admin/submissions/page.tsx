"use client";

import { useEffect, useState } from "react";
import { getSubmissions, updateSubmissionStatus } from "@/app/lib/admin-service";
import { Mail, Clock, Building, CheckCircle, Trash2, MailOpen, Inbox } from "lucide-react";
import { useToast } from "@/app/components/Toast";

export default function SubmissionsInbox() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
      await updateSubmissionStatus(id, newStatus);
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      toast("Failed to update status.", "error");
    }
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
        <h1 className="heading-1 text-5xl">Inquiries</h1>
        <p className="body-text opacity-50 uppercase tracking-[0.2em] text-[10px]">Contact Form Submissions</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {submissions.length === 0 ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center gap-4 opacity-30">
            <Inbox size={48} />
            <p className="body-text">No submissions yet.</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div 
              key={submission.id} 
              className={`glass-card p-8 flex flex-col gap-6 transition-all border-l-4 ${submission.status === 'unread' ? 'border-l-accent bg-accent/[0.02]' : 'border-l-transparent opacity-60'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="heading-3 text-xl">{submission.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs opacity-50 uppercase tracking-widest mt-1">
                    <div className="flex items-center gap-1">
                      <Mail size={12} />
                      <span className="lowercase">{submission.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building size={12} />
                      <span>{submission.organization || "Independent"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleToggleStatus(submission.id, submission.status)}
                    className={`p-2 rounded-lg transition-colors ${submission.status === 'unread' ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    title={submission.status === 'unread' ? "Mark as Read" : "Mark as Unread"}
                  >
                    {submission.status === 'unread' ? <Mail size={18} /> : <MailOpen size={18} />}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-white/5">
                <p className="body-text text-sm leading-relaxed whitespace-pre-wrap">{submission.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
