"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { uploadFile } from "@/app/lib/storage";
import { logAction } from "@/app/lib/admin-service";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, Briefcase, User, Info, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/components/Toast";

export default function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    link: "",
    sort_order: 0,
    image_url: ""
  });

  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        setFormData({
          name: data.name || "",
          role: data.role || "",
          bio: data.bio || "",
          link: data.link || "",
          sort_order: data.sort_order || 0,
          image_url: data.image_url || ""
        });
        if (data.image_url) setImagePreview(data.image_url);
      }
      setLoading(false);
    };

    fetchMember();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData({...formData, image_url: ""}); // Mark for replacement
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const path = `team/${Date.now()}-${imageFile.name}`;
        finalImageUrl = await uploadFile(imageFile, "media", path);
      }

      const { error } = await supabase
        .from("team_members")
        .update({
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          link: formData.link,
          image_url: finalImageUrl,
          sort_order: formData.sort_order
        })
        .eq("id", id);

      if (error) throw error;
      toast("Team member updated!", "success");
      await logAction("update_team_member", formData.name, id);
      router.push("/admin/team");
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
        <Link href="/admin/team" className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="heading-1 text-4xl">Edit Team Member</h1>
          <p className="small-text opacity-40 uppercase tracking-widest text-[10px]">Update Profile Details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-card p-10 flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Full Name</label>
                <div className="relative">
                   <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-50" />
                   <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Role</label>
                <div className="relative">
                   <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-50" />
                   <input 
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Bio</label>
              <div className="relative">
                <Info size={18} className="absolute left-4 top-4 text-accent opacity-50" />
                <textarea 
                  rows={5}
                  required
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-card p-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
               <label className="small-text uppercase tracking-widest opacity-70">Headshot</label>
               <div 
                 className={`relative aspect-square w-full max-w-[200px] mx-auto rounded-3xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 transition-all ${!imagePreview ? 'hover:border-accent/40 bg-white/[0.02]' : ''}`}
               >
                 {imagePreview ? (
                   <>
                     <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                     <button 
                       type="button"
                       onClick={() => { setImagePreview(null); setImageFile(null); setFormData({...formData, image_url: ""}); }}
                       className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-400 transition-colors z-10"
                     >
                       <X size={14} />
                     </button>
                   </>
                 ) : (
                   <>
                     <Upload size={24} className="opacity-20" />
                     <span className="text-[10px] opacity-40 text-center px-4">Upload New</span>
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
              <label className="small-text uppercase tracking-widest opacity-70">Social/Portfolio Link</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type="url"
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="small-text uppercase tracking-widest opacity-70">Sort Order</label>
              <input 
                type="number"
                value={formData.sort_order}
                onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none text-white transition-all"
              />
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
