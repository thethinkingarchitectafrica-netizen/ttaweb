import { supabaseAdmin } from "../supabase";
import * as staticContent from "../content";

/**
 * Run this script (utility function) to migrate initial static data to Supabase.
 * Call this from an admin-only API route or a one-time script.
 */
export async function seedDatabase() {
  console.log("Starting Seeding...");

  // 1. Site Config
  const configs = [
    { key: 'hero', value: staticContent.siteContent.hero },
    { key: 'footer', value: staticContent.siteContent.footer },
    { key: 'seo', value: {
        title: "The Thinking Architect | Africa's Architecture Thinking Community",
        description: "TTA is a pan-African platform for architectural thinking. We host curated talks, written dialogues, and a community of architects and students committed to the culture of rigour in design.",
        keywords: "African architecture, architecture community Nigeria, architectural thinking, design education Africa, architecture talks, built environment Africa, The Thinking Architect"
    }}
  ];

  for (const config of configs) {
    const { error } = await supabaseAdmin
      .from("site_config")
      .upsert(config);
    if (error) console.error(`Error seeding ${config.key}:`, error);
  }

  // 2. Stats
  const { error: statsError } = await supabaseAdmin
    .from("stats")
    .upsert(staticContent.stats.map((s, idx) => ({ ...s, sort_order: idx + 1 })));
  if (statsError) console.error("Error seeding stats:", statsError);

  // 3. Sessions
  const { error: sessionsError } = await supabaseAdmin
    .from("sessions")
    .upsert(staticContent.sessions.map(s => ({
      ...s,
      thumbnail_url: s.thumbnailUrl,
      video_url: s.videoUrl,
      tags: s.tags || []
    })));
  if (sessionsError) console.error("Error seeding sessions:", sessionsError);

  // 4. Events
  const eventsToSeed = [
    { ...staticContent.upcomingEvent, is_upcoming: true },
    ...staticContent.pastEvents.map(e => ({ ...e, is_upcoming: false }))
  ];
  const { error: eventsError } = await supabaseAdmin
    .from("events")
    .upsert(eventsToSeed);
  if (eventsError) console.error("Error seeding events:", eventsError);

  // 5. Team
  const { error: teamError } = await supabaseAdmin
    .from("team_members")
    .upsert(staticContent.team.map((m, idx) => ({ ...m, sort_order: idx + 1 })));
  if (teamError) console.error("Error seeding team:", teamError);

  console.log("Seeding Completed.");
}
