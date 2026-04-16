"use client";

import { useState } from "react";
import Section from "../components/Section";
import { NetworkGraph } from "../components/Graphs";
import { Send, MessageCircle, Mail, ArrowRight } from "lucide-react";
import { contactContent } from "../lib/content";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../components/Toast";
const supabase = createClient();

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [content, setContent] = useState(contactContent);
  const toast = useToast();

  useState(() => {
    const fetchContent = async () => {
       const { data } = await supabase
         .from("site_config")
         .select("value")
         .eq("key", "contact_content")
         .single();
       
       if (data?.value) {
         setContent(data.value);
       }
    };
    fetchContent();
  });

  const { hero, channels, partnerships } = content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const submission = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      organization: formData.get("organization") as string,
      message: formData.get("message") as string,
    };

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([submission]);

      if (error) throw error;
      setFormStatus("success");
    } catch (err: any) {
      toast(`Submission failed: ${err.message}`, "error");
      setFormStatus("idle");
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <NetworkGraph />
      <section className="pt-40 pb-20 container relative z-10 text-center flex flex-col items-center">
        <h1 className="heading-1 mb-6 reveal">{hero.title}</h1>
        <p className="body-text text-xl max-w-2xl mx-auto opacity-80 reveal" style={{ animationDelay: "0.1s" }}>
          {hero.description}
        </p>
      </section>

      <section className="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 reveal" style={{ animationDelay: "0.2s" }}>
        {/* Contact Links */}
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="heading-3 text-accent uppercase tracking-widest mb-8">{channels.title}</h2>
            <div className="flex flex-col gap-6">
              {channels.items.map((item) => (
                <a key={item.id} href={item.link} className="glass-card flex items-center gap-6 p-6 hover:bg-white/[0.05] border-white/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                    {item.id === "whatsapp" ? <MessageCircle size={20} /> : item.id === "telegram" ? <Send size={20} /> : <Mail size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{item.label}</span>
                    <span className="small-text opacity-50 lowercase">{item.desc}</span>
                  </div>
                  <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-accent" size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership Form */}
        <div className="glass-card p-10 bg-surface/30 border-white/5">
          <h2 className="heading-3 text-accent uppercase tracking-widest mb-8">{partnerships.title}</h2>
          {formStatus === "success" ? (
             <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                   <Mail size={32} />
                </div>
                <h3 className="heading-3 mb-2">{partnerships.form.successTitle}</h3>
                <p className="body-text opacity-60">{partnerships.form.successText}</p>
                <button 
                  onClick={() => setFormStatus("idle")}
                  className="mt-8 text-accent text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  {partnerships.form.resetButton}
                </button>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text opacity-60 ml-1">{partnerships.form.nameLabel}</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="Inioluwa Oladipupo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-accent/50 transition-all font-body text-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text opacity-60 ml-1">Email Address</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="hello@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-accent/50 transition-all font-body text-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text opacity-60 ml-1">{partnerships.form.orgLabel}</label>
                <input 
                  required
                  name="organization"
                  type="text" 
                  placeholder="Architecture Studio"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-accent/50 transition-all font-body text-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text opacity-60 ml-1">{partnerships.form.messageLabel}</label>
                <textarea 
                  required
                  name="message"
                  rows={4}
                  placeholder="How can we collaborate?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-accent/50 transition-all font-body text-white resize-none" 
                />
              </div>
              <button 
                disabled={formStatus === "submitting"}
                type="submit" 
                className="button-primary w-full py-4 mt-4 disabled:opacity-50"
              >
                {formStatus === "submitting" ? partnerships.form.submittingText : partnerships.form.submitButton}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}


