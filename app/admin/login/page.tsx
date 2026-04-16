"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-10 flex flex-col gap-8 bg-accent/5 border-accent/20"
      >
        <div className="flex flex-col gap-2 text-center">
          <h1 className="heading-1 text-4xl">Admin Login</h1>
          <p className="body-text opacity-60">Authentication required for TTA Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="small-text uppercase tracking-widest opacity-70">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
              placeholder="admin@tta.site"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="small-text uppercase tracking-widest opacity-70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full py-5 text-lg font-bold"
          >
            {loading ? "Verifying..." : "Sign In to Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
