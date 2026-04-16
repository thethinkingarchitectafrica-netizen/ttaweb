"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
import { Save, Globe, Info, Search, Rocket, MessageCircle, Phone } from "lucide-react";
import { logAction } from "@/app/lib/admin-service";
import { aboutContent, communityContent, contactContent } from "@/app/lib/content";
import { useToast } from "@/app/components/Toast";

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const [config, setConfig] = useState<any>({
    seo: {
      title: "",
      description: "",
      keywords: ""
    },
    hero: {
      title: "",
      subHeadline: "",
      description: ""
    },
    footer: {
      tagline: "",
      copyright: ""
    },
    about_content: aboutContent,
    community_content: communityContent,
    contact_content: contactContent
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("site_config").select("*");
      if (data) {
        const newConfig = { ...config };
        data.forEach((item: any) => {
          if (newConfig[item.key] !== undefined) {
             newConfig[item.key] = item.value;
          }
        });
        setConfig(newConfig);
      }
      setLoading(false);
    };

    fetchConfig();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key, value: config[key] });
    
    if (error) toast(error.message, "error");
    else {
      await logAction("update_site_config", key);
      toast(`${key.replace(/_/g, ' ')} settings saved!`, "success");
    }
    setSaving(false);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="heading-1 text-5xl">Site Settings</h1>
        <p className="body-text opacity-50">Manage global branding, SEO, and copy.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* SEO Section */}
        <section className="glass-card p-10 flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={24} className="text-accent" />
                <h2 className="heading-3">Search Engine Optimization</h2>
              </div>
              <button 
                onClick={() => handleSave('seo')}
                disabled={saving}
                className="button-primary !py-3 flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save SEO</span>
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Meta Title</label>
                <input 
                  type="text"
                  value={config.seo.title}
                  onChange={e => setConfig({...config, seo: {...config.seo, title: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Keywords (comma separated)</label>
                <input 
                  type="text"
                  value={config.seo.keywords}
                  onChange={e => setConfig({...config, seo: {...config.seo, keywords: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="small-text uppercase tracking-widest opacity-70">Meta Description</label>
                <textarea 
                  rows={3}
                  value={config.seo.description}
                  onChange={e => setConfig({...config, seo: {...config.seo, description: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none resize-none"
                />
              </div>
           </div>
        </section>

        {/* Hero Section */}
        <section className="glass-card p-10 flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={24} className="text-accent" />
                <h2 className="heading-3">Home Hero Copy</h2>
              </div>
              <button 
                onClick={() => handleSave('hero')}
                disabled={saving}
                className="button-primary !py-3 flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save Hero</span>
              </button>
           </div>

           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Hero Title</label>
                <input 
                  type="text"
                  value={config.hero.title}
                  onChange={e => setConfig({...config, hero: {...config.hero, title: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-bold focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Sub-Headline</label>
                <input 
                  type="text"
                  value={config.hero.subHeadline}
                  onChange={e => setConfig({...config, hero: {...config.hero, subHeadline: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Main Description</label>
                <textarea 
                  rows={4}
                  value={config.hero.description}
                  onChange={e => setConfig({...config, hero: {...config.hero, description: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none resize-none"
                />
              </div>
           </div>
        </section>

        {/* Footer Section */}
        <section className="glass-card p-10 flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={24} className="text-accent" />
                <h2 className="heading-3">Footer & Branding</h2>
              </div>
              <button 
                onClick={() => handleSave('footer')}
                disabled={saving}
                className="button-primary !py-3 flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save Footer</span>
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Footer Tagline</label>
                <input 
                  type="text"
                  value={config.footer.tagline}
                  onChange={e => setConfig({...config, footer: {...config.footer, tagline: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Copyright Notice</label>
                <input 
                  type="text"
                  value={config.footer.copyright}
                  onChange={e => setConfig({...config, footer: {...config.footer, copyright: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
           </div>
        </section>

        {/* About Page Section */}
        <section className="glass-card p-10 flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={24} className="text-accent" />
                <h2 className="heading-3">About Page Content</h2>
              </div>
              <button 
                onClick={() => handleSave('about_content')}
                disabled={saving}
                className="button-primary !py-3 flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save About</span>
              </button>
           </div>
           
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Hero Title</label>
                <input 
                  type="text"
                  value={config.about_content.hero.title}
                  onChange={e => setConfig({...config, about_content: {...config.about_content, hero: {...config.about_content.hero, title: e.target.value}}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Opening Text</label>
                <textarea 
                  rows={3}
                  value={config.about_content.hero.opening}
                  onChange={e => setConfig({...config, about_content: {...config.about_content, hero: {...config.about_content.hero, opening: e.target.value}}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Pull Quote</label>
                <textarea 
                  rows={2}
                  value={config.about_content.pullQuote}
                  onChange={e => setConfig({...config, about_content: {...config.about_content, pullQuote: e.target.value}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 italic focus:ring-1 focus:ring-accent outline-none resize-none text-accent"
                />
              </div>
           </div>
        </section>

        {/* Community Page Section */}
        <section className="glass-card p-10 flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rocket size={24} className="text-accent" />
                <h2 className="heading-3">Community Settings</h2>
              </div>
              <button 
                onClick={() => handleSave('community_content')}
                disabled={saving}
                className="button-primary !py-3 flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save Community</span>
              </button>
           </div>
           
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="small-text uppercase tracking-widest opacity-70">Community Hero Description</label>
                <textarea 
                  rows={4}
                  value={config.community_content.hero.description}
                  onChange={e => setConfig({...config, community_content: {...config.community_content, hero: {...config.community_content.hero, description: e.target.value}}})}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {config.community_content.platforms.map((p: any, i: number) => (
                    <div key={p.id} className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl">
                       <label className="small-text uppercase tracking-widest opacity-40">{p.name} Link</label>
                       <input 
                         type="text"
                         value={p.link}
                         onChange={e => {
                            const newPlatforms = [...config.community_content.platforms];
                            newPlatforms[i].link = e.target.value;
                            setConfig({...config, community_content: {...config.community_content, platforms: newPlatforms}});
                         }}
                         className="bg-transparent border-b border-white/10 p-2 focus:border-accent outline-none"
                       />
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Contact Page Section */}
        <section className="glass-card p-10 flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone size={24} className="text-accent" />
                <h2 className="heading-3">Contact Channels</h2>
              </div>
              <button 
                onClick={() => handleSave('contact_content')}
                disabled={saving}
                className="button-primary !py-3 flex items-center gap-2"
              >
                <Save size={18} />
                <span>Save Contact</span>
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.contact_content.channels.items.map((channel: any, i: number) => (
                 <div key={channel.id} className="flex flex-col gap-2">
                    <label className="small-text uppercase tracking-widest opacity-70">{channel.label} Link</label>
                    <input 
                      type="text"
                      value={channel.link}
                      onChange={e => {
                         const newItems = [...config.contact_content.channels.items];
                         newItems[i].link = e.target.value;
                         setConfig({...config, contact_content: {...config.contact_content, channels: {...config.contact_content.channels, items: newItems}}});
                      }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-accent outline-none"
                    />
                 </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
