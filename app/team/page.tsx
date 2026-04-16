import Section from "../components/Section";
import { teamContent } from "../lib/content";
import { getTeam } from "../lib/data-service";
import Image from "next/image";

export default async function TeamPage() {
  const team = await getTeam();
  const founder = team[0];
  const others = team.slice(1);

  return (
    <>
      <Section title={teamContent.hero.title}>
        <div className="flex flex-col gap-10 reveal">
          <div className="max-w-4xl flex flex-col gap-6">
            <p className="body-text text-2xl leading-relaxed text-white whitespace-pre-wrap">
              {teamContent.hero.description}
            </p>
          </div>
        </div>
      </Section>

      <Section title="The Founder">
        <div className="glass-card flex flex-col md:flex-row gap-10 items-center bg-accent/5 border-accent/20">
          <div className="w-40 h-40 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-5xl font-bold text-accent shrink-0 relative overflow-hidden rotate-3 transition-transform hover:rotate-0">
            {founder.image_url ? (
              <Image src={founder.image_url} alt={founder.name} fill className="object-cover" />
            ) : (
              founder.name.split(' ').map((n: string) => n[0]).join('')
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="heading-2">{founder.name}</h3>
              <div className="small-text text-accent">{founder.role}</div>
            </div>
            <p className="body-text whitespace-pre-wrap">{founder.bio}</p>
            <a className="button-primary w-fit mt-2" href={founder.link ?? "#"} aria-label="LinkedIn">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </Section>

      <Section title="Team">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((member: any) => (
            <div key={member.name} className="glass-card flex flex-col gap-5 border-white/5 group hover:border-accent/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold group-hover:bg-accent/10 group-hover:text-accent transition-all relative overflow-hidden">
                {member.image_url ? (
                   <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                ) : (
                   member.name.split(' ').map((n: string) => n[0]).join('')
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="heading-3">{member.name}</h4>
                <div className="small-text opacity-70">{member.role}</div>
              </div>
              {member.bio ? (
                <p className="body-text text-sm line-clamp-4">{member.bio}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title={teamContent.cta.title} className="bg-surface/5">
        <div className="max-w-2xl">
          <p className="body-text text-xl mb-8 opacity-80">{teamContent.cta.description}</p>
          <a href="/contact" className="button-primary">
            {teamContent.cta.button} →
          </a>
        </div>
      </Section>
    </>
  );
}
