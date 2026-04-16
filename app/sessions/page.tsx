import Section from "../components/Section";
import SessionsArchive from "../components/SessionsArchive";
import { getSessions } from "../lib/data-service";
import { sessionsContent } from "../lib/content";

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <Section title="Sessions Archive" eyebrow="Dialogue">
        <div className="max-w-2xl mb-12">
          <p className="body-text text-xl opacity-70 leading-relaxed">
            {sessionsContent.hero.description}
          </p>
        </div>
        
        <SessionsArchive initialSessions={sessions} />
      </Section>
    </div>
  );
}
