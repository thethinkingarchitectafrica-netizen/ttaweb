import Section from "../components/Section";
import { NetworkGraph } from "../components/Graphs";
import { aboutContent } from "../lib/content";
import { getSiteConfig } from "../lib/data-service";

export default async function AboutPage() {
  const content = await getSiteConfig("about_content", aboutContent);
  const { hero, pullQuote, sections } = content;

  return (
    <div className="bg-background min-h-screen pb-20">
      <NetworkGraph />
      <div className="bg-glow top-[10%] -left-[10%]" />
      
      {/* 1. HERO / INTRODUCTION */}
      <section className="pt-40 pb-20 container relative z-10">
        <div className="max-w-4xl">
          <h1 className="heading-1 mb-12 reveal-dramatic">{hero.title}</h1>
          <div className="reveal-dramatic" style={{ animationDelay: "0.2s" }}>
            <p className="body-text text-3xl leading-snug text-white font-medium mb-10">
              {hero.opening}
            </p>
            <div className="max-w-3xl">
              <p className="body-text text-xl leading-loose opacity-80 mb-8">
                {hero.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY PULL QUOTE */}
      <div className="container py-20 reveal" style={{ animationDelay: "0.4s" }}>
         <div className="max-w-4xl mx-auto border-y border-white/5 py-16 px-4">
            <blockquote className="editorial text-4xl md:text-5xl text-center leading-tight tracking-tight">
              “{pullQuote}”
            </blockquote>
         </div>
      </div>

      {/* 3. WHAT WE DO */}
      <Section id="what-we-do" title={sections.whatWeDo.title}>
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          <p className="body-text text-xl leading-loose">
            {sections.whatWeDo.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
            {sections.whatWeDo.items.map((item: any, i: number) => (
              <div key={i} className="flex flex-col gap-4">
                <h3 className="heading-3 text-accent text-lg uppercase tracking-widest">{item.title}</h3>
                <p className="body-text text-base leading-relaxed opacity-70">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="body-text text-lg opacity-60 italic mt-8">
            {sections.whatWeDo.closing}
          </p>
        </div>
      </Section>

      {/* 4. VISION */}
      <Section id="vision" title={sections.vision.title} className="bg-surface/5">
        <div className="max-w-3xl mx-auto">
          <p className="body-text text-2xl text-white mb-10">
            {sections.vision.subtitle}
          </p>
          
          <div className="flex flex-col gap-8 mb-16">
            <p className="body-text text-lg leading-relaxed opacity-70">
              {sections.vision.description}
            </p>
            <p className="body-text text-lg leading-relaxed opacity-70 italic border-l-2 border-accent pl-6">
              {sections.vision.footer}
            </p>
          </div>
        </div>
      </Section>

      {/* 5. WHY AFRICA */}
      <Section id="why-africa" title={sections.whyAfrica.title}>
        <div className="max-w-3xl mx-auto">
          <p className="body-text text-xl leading-loose mb-12">
            {sections.whyAfrica.description}
          </p>
          
          <div className="body-text text-xl leading-loose opacity-80 whitespace-pre-wrap">
            {sections.whyAfrica.body}
          </div>
        </div>
      </Section>
    </div>
  );
}


