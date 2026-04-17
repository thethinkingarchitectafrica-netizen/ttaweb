import Section from "../components/Section";
import EventsView from "../components/EventsView";
import { eventsContent } from "../lib/content";
import { NetworkGraph } from "../components/Graphs";
import { getEvents } from "../lib/data-service";

export default async function EventsPage() {
  const { upcomingEvent, pastEvents } = await getEvents();

  return (
    <div className="bg-background min-h-screen pb-20">
      <NetworkGraph />
      <section className="pt-40 pb-20 container relative z-10">
        <div className="max-w-4xl">
          <h1 className="heading-1 mb-8 reveal">{eventsContent.hero.title}</h1>
          <p className="body-text text-xl opacity-80 reveal" style={{ animationDelay: "0.1s" }}>
             {eventsContent.hero.description}
          </p>
        </div>
      </section>

      <EventsView upcomingEvent={upcomingEvent} pastEvents={pastEvents} />

      <Section title="Host a Session">
        <div className="glass-card bg-surface/30 border-white/5 p-6 md:p-12 text-center flex flex-col items-center gap-6">
          <h2 className="heading-2">{eventsContent.hosting.title}</h2>
          <p className="body-text max-w-2xl opacity-70">
            {eventsContent.hosting.description}
          </p>
          <a href="/contact" className="button-secondary">
            {eventsContent.hosting.cta}
          </a>
        </div>
      </Section>
    </div>
  );
}
