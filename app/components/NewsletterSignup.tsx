"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export default function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email: email.trim().toLowerCase(), source }]);

      if (error) {
        // Duplicate email is a unique constraint violation (code 23505)
        if (error.code === "23505") {
          setErrorMsg("You're already on the list!");
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-3 text-accent animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CheckCircle2 size={20} className="shrink-0" />
        <span className="body-text text-sm font-medium">You're on the list. Welcome to the discourse.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-0 group">
        <div className="relative flex-1">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-white/5 border border-white/10 border-r-0 rounded-l-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-accent text-black font-bold px-5 py-3.5 rounded-r-xl hover:bg-accent/80 transition-colors flex items-center gap-2 shrink-0 text-sm disabled:opacity-50"
        >
          {status === "loading" ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}
        </button>
      </form>
      {errorMsg && (
        <p className="text-xs text-white/40 pl-1">{errorMsg}</p>
      )}
    </div>
  );
}
