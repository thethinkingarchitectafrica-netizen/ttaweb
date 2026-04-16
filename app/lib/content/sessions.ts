import { Session } from "../content";

export const sessionsContent = {
  hero: {
    title: "Sessions Archive",
    description: "Every TTA session is a record of a conversation worth having. Browse the archive — read the summaries, revisit the questions, and access recordings where available.\n\nThe thinking here does not expire."
  },
  searchPlaceholder: "Search sessions by topic, speaker, or keyword...",
  emptyState: {
    title: "No sessions found matching your criteria.",
    description: "Try a broader search, or browse all sessions below."
  }
};

export const sessions: Session[] = [
  {
    id: "session-1",
    title: "The Future of Urbanism in Africa",
    speaker: "TTA Panel",
    description: "A deep dive into how digitalization and infrastructure are reshaping our cities.",
    date: "April 12, 2026",
    duration: "45 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://youtube.com",
    category: "Talks",
    tags: ["Urbanism", "Digitalization"]
  },
  {
    id: "session-2",
    title: "Responsive Design for Arid Climates",
    speaker: "Guest Architect",
    description: "Frameworks for building naturally cooled structures without high energy costs.",
    date: "March 28, 2026",
    duration: "60 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1518005020455-eca307d084bc?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://youtube.com",
    category: "Guest Sessions",
    tags: ["Sustainability", "Climate"]
  },
  {
    id: "session-3",
    title: "Material Innovation: Bamboo & Clay",
    speaker: "Inioluwa Oladipupo",
    description: "Reimagining traditional materials for the 21st-century architectural context.",
    date: "March 15, 2026",
    duration: "50 min",
    thumbnailUrl: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://youtube.com",
    category: "Talks",
    tags: ["Materials", "Innovation"]
  },
];
