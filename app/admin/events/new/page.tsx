"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { logAction } from "@/app/lib/admin-service";
import { uploadFile } from "@/app/lib/storage";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, User, AlignLeft, Link as LinkIcon, Users, Tag, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/components/Toast";

export default function NewEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    date: "",
    description: "",
    link: "",
    attendance: "",
    is_upcoming: true,
    topics: "",
    flyer_url: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFlyerFile(file);
      setFlyerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let flyerUrl = "";
      if (flyerFile) {
        const path = `flyers/${Date.now()}-${flyerFile.name}`;
        flyerUrl = await uploadFile(flyerFile, "media", path);
      }

      const { error } = await supabase.from("events").insert([{
        title: formData.title,
        speaker: formData.speaker,
        date: formData.date,
        description: formData.description,
        link: formData.link,
        attendance: formData.attendance,
        is_upcoming: formData.is_upcoming,
        topics: formData.topics.split(",").map(t => t.trim()).filter(t => t !== ""),
        flyer_url: flyerUrl
      }]);

      if (error) throw error;
      toast("Event scheduled!", "success");
      await logAction("create_event", formData.title);
      router.push("/admin/events");
    } catch (err: any) {
      toast(`Error: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="heading-1 text-4xl">Schedule Event</h1>
          <p className="small-text opacity-40 uppercase tracking-widest text-[10px]">Create New Encounter</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-card p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Event Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                placeholder="e.g. The Future of African Urbanism"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Date</label>
                <div className="relative">
                   <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-50" />
                   <input 
                    type="text"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                    placeholder="e.g. May 12, 2026"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Speaker</label>
                <div className="relative">
                   <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-50" />
                   <input 
                    type="text"
                    required
                    value={formData.speaker}
                    onChange={e => setFormData({...formData, speaker: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                    placeholder="e.g. David Adjaye"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Description</label>
              <textarea 
                rows={5}
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all resize-none"
                placeholder="What is this event about?"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* 1. Flyer Card */}
          <div className="glass-card p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="small-text uppercase tracking-widest opacity-70">Event Flyer / Poster</label>
              <div
                className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 transition-all ${!flyerPreview ? 'hover:border-accent/40 bg-white/[0.02]' : 'bg-black/20'}`}
              >
                {flyerPreview ? (
                  <>
                    <Image src={flyerPreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => { setFlyerPreview(null); setFlyerFile(null); }}
                      className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-red-400 transition-colors z-10"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="opacity-20" />
                    <span className="text-xs opacity-40 text-center px-4">Upload Event Flyer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 2. Metadata Card */}
          <div className="glass-card p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="small-text uppercase tracking-widest opacity-70">Status</label>
              <button
                type="button"
                onClick={() => setFormData({...formData, is_upcoming: !formData.is_upcoming})}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${formData.is_upcoming ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                <span className="font-bold tracking-widest text-[10px] uppercase">{formData.is_upcoming ? 'Upcoming' : 'Past'}</span>
                <div className={`w-10 h-5 rounded-full relative transition-all ${formData.is_upcoming ? 'bg-emerald-400' : 'bg-white/20'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_upcoming ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Registration Link</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type="url"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                  placeholder="https://lu.ma/..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Attendance Note</label>
              <div className="relative">
                <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type="text"
                  value={formData.attendance}
                  onChange={e => setFormData({...formData, attendance: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                  placeholder="e.g. 500+ registered"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Topics (comma separated)</label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-10 -translate-y-1/2 opacity-30" />
                <textarea 
                  rows={3}
                  value={formData.topics}
                  onChange={e => setFormData({...formData, topics: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all resize-none"
                  placeholder="Urbanism, Heritage, Design..."
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="button-primary w-full py-6 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            <span>{loading ? "Saving..." : "Schedule Event"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
