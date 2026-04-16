"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { uploadFile } from "@/app/lib/storage";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, PlayCircle, User, Clock, Link as LinkIcon, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/components/Toast";

export default function EditSession({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    description: "",
    date: "",
    duration: "",
    videoUrl: "",
    category: "Talks" as const,
    tags: "",
    thumbnail_url: ""
  });

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        setFormData({
          title: data.title || "",
          speaker: data.speaker || "",
          description: data.description || "",
          date: data.date || "",
          duration: data.duration || "",
          videoUrl: data.video_url || "",
          category: data.category || "Talks",
          tags: data.tags ? data.tags.join(", ") : "",
          thumbnail_url: data.thumbnail_url || ""
        });
        if (data.thumbnail_url) setThumbnailPreview(data.thumbnail_url);
      }
      setLoading(false);
    };

    fetchSession();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setFormData({ ...formData, thumbnail_url: "" }); // Mark for replacement
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalThumbnailUrl = formData.thumbnail_url;
      if (thumbnailFile) {
        const path = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
        finalThumbnailUrl = await uploadFile(thumbnailFile, "media", path);
      }

      const { error } = await supabase
        .from("sessions")
        .update({
          title: formData.title,
          speaker: formData.speaker,
          description: formData.description,
          date: formData.date,
          duration: formData.duration,
          video_url: formData.videoUrl,
          thumbnail_url: finalThumbnailUrl,
          category: formData.category,
          tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
        })
        .eq("id", id);

      if (error) throw error;
      toast("Session updated successfully!", "success");
      router.push("/admin/sessions");
    } catch (err: any) {
      toast(`Error: ${err.message}`, "error");
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4">
        <Link href="/admin/sessions" className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="heading-1 text-4xl">Edit Session</h1>
          <p className="small-text opacity-40 uppercase tracking-widest text-[10px]">Update Archive Entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-card p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Session Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Speaker</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-50" />
                  <input
                    type="text"
                    required
                    value={formData.speaker}
                    onChange={e => setFormData({ ...formData, speaker: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all appearance-none"
                >
                  <option value="Talks">Talks</option>
                  <option value="Debates">Debates</option>
                  <option value="Guest Sessions">Guest Sessions</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Description</label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Date</label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Duration</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-50" />
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-card p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="small-text uppercase tracking-widest opacity-70">Session Thumbnail</label>
              <div
                className={`relative aspect-video rounded-2xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 transition-all ${!thumbnailPreview ? 'hover:border-accent/40 bg-white/[0.02]' : ''}`}
              >
                {thumbnailPreview ? (
                  <>
                    <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => { setThumbnailPreview(null); setThumbnailFile(null); setFormData({ ...formData, thumbnail_url: "" }); }}
                      className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-red-400 transition-colors z-10"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="opacity-20" />
                    <span className="text-xs opacity-40 text-center px-4">Upload New Image</span>
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

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">YouTube / Video URL</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Tags (comma separated)</label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-10 -translate-y-1/2 opacity-30" />
                <textarea
                  rows={3}
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="button-primary w-full py-6 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
