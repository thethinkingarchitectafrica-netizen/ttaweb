import { NetworkGraph } from "./components/Graphs";
import Section from "./components/Section";
import Pillars from "./components/Pillars";
import {
  features as staticFeatures,
  stats as staticStats,
  upcomingEvent as staticUpcomingEvent,
  sessions as staticSessions,
  siteContent as staticSiteContent,
  footerLinks,
  quotes as staticQuotes,
} from "./lib/content";
import SessionsGrid from "./components/SessionsGrid";
import AnimatedCounter from "./components/AnimatedCounter";
import ScrollReveal from "./components/ScrollReveal";
import Image from "next/image";
import { getSiteConfig, getStats, getEvents, getSessions } from "./lib/data-service";

export default async function Home() {
  // Fetch dynamic content with fallbacks
  const [
    heroConfig,
    dbStats,
    eventData,
    dbSessions
  ] = await Promise.all([
    getSiteConfig('hero', staticSiteContent.hero),
    getStats(),
    getEvents(),
    getSessions()
  ]);

  const hero = heroConfig;
  const stats = dbStats;
  const { upcomingEvent } = eventData;
  const sessions = dbSessions;

  return (
    <>
      <NetworkGraph />
      {/* Decorative Background Glows */}
      <div className="bg-glow top-[10%] -left-[10%]" />
      <div className="bg-glow top-[40%] -right-[10%]" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }} />

      {/* 1. HERO SECTION */}
      <Section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24" watermark={true}>
        <div className="flex flex-col items-center text-center gap-10">
          <ScrollReveal delay={0.1}>
            <div className="tag">
              {hero.eyebrow}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2} direction="scale">
            <h1 className="heading-1">
              {hero.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col gap-6 items-center">
              <p className="body-text text-2xl font-medium text-white max-w-[40ch]">
                {hero.subHeadline}
              </p>
              <p className="body-text text-xl max-w-[60ch] opacity-70">
                {hero.description}
              </p>
              <p className="body-text text-xl font-bold text-accent mt-4">
                {hero.closing}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-6">
              <a className="button-primary" href={footerLinks.community[0].href}>
                Join the Community →
              </a>
              <a className="button-secondary" href="/events">
                Register for Next Talk
              </a>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* 2. WHAT IS TTA? */}
      <Section id="about" eyebrow="Definition" title="What is TTA?" className="bg-surface/5">
        <div className="glass-card flex flex-col justify-center gap-8 bg-accent/5 ring-1 ring-accent/10 p-12">
          <p className="heading-2 opacity-95 leading-tight max-w-[50ch]">
            TTA | The Thinking Architect is an intellectual platform for the built environment.
          </p>
          <div className="body-text text-xl flex flex-col gap-6">
            <p>
              We are not a professional body. We are not an institution. We are a community of architects, students, and thinkers who believe that design begins in the mind, long before it reaches the drawing board.
            </p>
            <p>
              Founded in January 2026, TTA operates at the intersection of architecture, design education, and African cultural identity. Through curated talks, written dialogues, and a growing community, we are building the next generation of practitioners who can think as sharply as they design.
            </p>
            <p className="text-white font-medium italic border-l-2 border-accent pl-6">
               Architecture is an intellectual discipline first. We treat it that way.
            </p>
          </div>
          <a href="/about" className="button-secondary w-fit mt-4 lowercase font-bold tracking-[0.2em] text-[12px]">
            Read our philosophy →
          </a>
        </div>
      </Section>

      {/* 3. COMMUNITY PULSE */}
      <Section id="numbers" eyebrow="Dynamic Impact" title="Community Pulse">
        <div className="bento-grid">
          {stats.map((stat: any) => (
            <div key={stat.label} className="bento-item-small glass-card flex flex-col items-center justify-center gap-3 group hover:ring-1 hover:ring-accent/30 transition-all text-center p-10">
              <AnimatedCounter value={stat.value} className="text-6xl font-black text-accent tracking-tighter" />
              <div className="small-text opacity-70 tracking-[0.3em] uppercase font-bold text-[11px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. UPCOMING EVENT */}
      <Section id="upcoming" eyebrow="Pulse" title="Next Session" className="bg-surface/5">
        <div className="glass-card flex flex-col md:flex-row gap-12 relative overflow-hidden group">
          {upcomingEvent?.flyer_url ? (
            <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none">
              <Image src={upcomingEvent.flyer_url} alt="" fill className="object-cover scale-150 blur-3xl" />
            </div>
          ) : (
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
            </div>
          )}
          
          <div className="flex-1 flex flex-col gap-6 relative z-10">
            <div className="tag w-fit">Featured Event</div>
            <h3 className="heading-1 !text-5xl">{upcomingEvent?.title}</h3>
            <div className="flex flex-col gap-1">
              <div className="text-accent text-xl font-medium">{upcomingEvent?.speaker}</div>
              <div className="body-text opacity-60 italic">{upcomingEvent?.date}</div>
            </div>
          </div>
          
          <div className="md:w-1/3 flex flex-col justify-center gap-8 relative z-10">
            {upcomingEvent?.flyer_url && (
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                <Image src={upcomingEvent.flyer_url} alt={upcomingEvent.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-4">
              <p className="body-text">{upcomingEvent?.description}</p>
              <div className="hero-buttons">
                <a className="button-primary w-full" href={upcomingEvent?.link || "#"}>
                  Register on Luma
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. THE THREE PILLARS */}
      <Section id="pillars" eyebrow="Framework" title="The Three Pillars">
        <Pillars features={staticFeatures} />
      </Section>
      
      {/* 5. FEATURED SESSIONS */}
      <Section id="sessions" eyebrow="Archive" title="Featured Sessions" className="bg-surface/5">
        <SessionsGrid sessions={sessions.slice(0, 3)} />
      </Section>

      <Section id="quotes" eyebrow="Thinking Aloud" title="Community Voices">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staticQuotes.map((item) => (
            <div key={item.name} className="glass-card flex flex-col gap-10 hover:translate-y-[-4px] transition-transform bg-white/[0.02] border-white/5 group">
              <p className="body-text text-lg italic leading-relaxed text-white/90 font-light">“{item.quote}”</p>
              <div className="flex items-center gap-5 mt-auto">
                <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-accent font-bold bg-accent/5 group-hover:bg-accent group-hover:text-black transition-colors text-lg">
                  {item.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">{item.name}</span>
                  <span className="small-text opacity-40 lowercase tracking-widest">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. JOIN CTA STRIP */}
      <Section id="cta" className="py-24 md:py-32" watermark={true}>
        <div className="bg-accent text-[#050505] flex flex-col items-center text-center gap-12 py-24 px-10 rounded-[64px] relative overflow-hidden shadow-[0_30px_60px_rgba(217,79,43,0.3)]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="heading-1 !text-black !text-7xl">We build the culture of rigour.</h2>
            <p className="text-black/80 text-2xl max-w-[50ch] leading-relaxed font-medium">
              Join a deliberate gathering of people who take architectural thinking seriously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 max-w-4xl w-full">
            <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-black/5 border border-black/10">
              <p className="text-black font-semibold text-center">Your entry point into a network of architects who think before they draw.</p>
              <a 
                className="button-primary !bg-black !text-white !border-black hover:!bg-white hover:!text-black !w-full" 
                href={footerLinks.community[0].href}
              >
                Join WhatsApp Community
              </a>
            </div>
            <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-black/5 border border-black/10">
              <p className="text-black font-semibold text-center">Long-form thinking on African architecture and professional practice.</p>
              <a 
                className="button-primary !bg-transparent !text-black !border-black hover:!bg-black hover:!text-white !w-full" 
                href={footerLinks.community[2].href}
              >
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
