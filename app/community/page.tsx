import Section from "../components/Section";
import { NetworkGraph } from "../components/Graphs";
import { MessageCircle, Send } from "lucide-react";
import { communityContent } from "../lib/content";
import { getSiteConfig } from "../lib/data-service";

export default async function CommunityPage() {
  const content = await getSiteConfig("community_content", communityContent);
  const { hero, platforms, membership } = content;
  return (
    <div className="bg-background min-h-screen pb-20">
      <NetworkGraph />
      <section className="pt-40 pb-20 container relative z-10 text-center flex flex-col items-center">
        <h1 className="heading-1 mb-6 reveal">{hero.title}</h1>
        <p className="body-text text-xl max-w-2xl mx-auto opacity-80 reveal" style={{ animationDelay: "0.2s" }}>
          {hero.description}
        </p>
      </section>

      <Section id="platforms" className="pt-0">
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto reveal" style={{ animationDelay: "0.4s" }}>
          {platforms.map((platform: any) => (
            <div key={platform.id} className="glass-card flex-1 flex flex-col items-center text-center p-6 md:p-12 bg-white/[0.02] border-white/5 hover:border-accent/20 transition-all group">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
                {platform.id === "whatsapp" ? <MessageCircle size={40} /> : <Send size={40} />}
              </div>
              <h3 className="heading-3 mb-4">{platform.name}</h3>
              <p className="body-text mb-8 opacity-70 leading-relaxed">
                {platform.description}
              </p>
              <a href={platform.link} className="button-primary w-full mt-auto">
                {platform.cta}
              </a>
            </div>
          ))}
        </div>
      </Section>

      <section className="container py-20 text-center opacity-40">
        <p className="small-text tracking-widest uppercase">{membership.footer}</p>
      </section>
    </div>
  );
}

