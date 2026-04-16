import { EventCard } from "../content";

export const eventsContent = {
  hero: {
    title: "Events",
    description: "TTA events are not networking sessions. They are structured intellectual encounters between speakers, ideas, and an audience prepared to engage seriously.\n\nRegister below. Come ready to think."
  },
  tabs: {
    upcoming: "Upcoming Events",
    past: "Past Events"
  },
  emptyState: {
    title: "No upcoming events at the moment.",
    description: "Follow TTA on Instagram or join the WhatsApp community to be the first to hear about new sessions."
  },
  pastIntro: "Conversations that have already happened — but are worth returning to.",
  hosting: {
    title: "Host a Session",
    description: "Do you have a project, a theory, or a perspective that deserves critical engagement? We are always looking for speakers who can bring rigour and depth to the TTA platform.",
    cta: "Inquire about speaking"
  }
};

export const upcomingEvent: EventCard = {
  id: "session-3",
  title: "Building Your Name Before You Build Buildings",
  speaker: "Sana Tabassum",
  date: "April 18, 2026",
  description: "Every architect builds two things: structures and reputation. One is tangible and takes years of practice. The other is invisible, starts forming the moment you enter the profession, and is far harder to repair once damaged.\n\nThis session explores how young architects can think intentionally about their professional identity: before the commissions come, before the firm name is established, and before the work speaks loudly enough on its own.",
  link: "#",
  isUpcoming: true,
  topics: [
    "Positioning yourself in a saturated market",
    "The architecture of your own narrative",
    "When to be known for a niche, and when to resist it",
    "Building a name through the quality of your thinking, rather than just your portfolio"
  ]
};

export const pastEvents: EventCard[] = [
  {
    id: "event-12",
    title: "Adaptive Reuse in West Africa",
    speaker: "Kunle Ajayi",
    date: "March 23, 2026",
    description: "Case studies on turning obsolete structures into community assets.",
    link: "#",
    attendance: "480 registered",
  },
  {
    id: "event-11",
    title: "Portfolio Storytelling",
    speaker: "Inioluwa Oladipupo",
    date: "February 24, 2026",
    description: "Building narrative flow into project presentations for employers and clients.",
    link: "#",
    attendance: "530 registered",
  },
];
