// Types
export type Stat = { label: string; value: string };

export type Feature = {
  name: string;
  description: string;
  status: "Live" | "Coming Soon";
};

export type EventCard = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  link: string;
  attendance?: string;
  isUpcoming?: boolean;
  topics?: string[];
};

export type Quote = { quote: string; name: string; role: string };

export type TeamMember = { name: string; role: string; bio?: string; link?: string };

export type Session = {
  id: string;
  title: string;
  speaker?: string;
  description: string;
  date: string;
  duration?: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: "Talks" | "Debates" | "Guest Sessions";
  tags?: string[];
};

// Re-exports from modular files
export * from "./content/navigation";
export * from "./content/about";
export * from "./content/community";
export * from "./content/contact";
export * from "./content/events";
export * from "./content/sessions";
export * from "./content/team";
export * from "./content/site";
