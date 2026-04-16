import { Stat, Feature, Quote } from "../content";

export const stats: Stat[] = [
  { label: "Architects, students & thinkers", value: "1,200+" },
  { label: "Across live & recorded sessions", value: "4,500+" },
  { label: "Deep-dive architectural conversations", value: "15" },
  { label: "A pan-African, global reach", value: "12" },
];

export const features: Feature[] = [
  {
    name: "Thinking",
    description: "Theory, ideas, frameworks",
    status: "Live",
  },
  {
    name: "Dialogue",
    description: "Live sessions, debates, guest talks",
    status: "Live",
  },
  {
    name: "Visibility",
    description: "Media, storytelling, YouTube archive",
    status: "Live",
  },
];

export const quotes: Quote[] = [
  {
    quote: "TTA is the first space where I've heard the African city discussed as a design challenge worthy of serious intellectual attention, rather than just a problem to be solved with imported solutions.",
    name: "Architecture graduate student",
    role: "Lagos",
  },
  {
    quote: "The curriculum of thinking here is different. TTA doesn't just ask what to build. It asks why. That question has changed how I approach every brief.",
    name: "Early-career architect",
    role: "Accra",
  },
  {
    quote: "I've attended talks at universities and international conferences. The quality of dialogue at TTA sessions is sharper. The questions asked here stay with you.",
    name: "Urban designer",
    role: "Ibadan",
  },
];

export const siteContent = {
  hero: {
    eyebrow: "The Thinking Architect",
    title: "Think Deeply. Design Responsibly. Act Strategically.",
    subHeadline: "The foundation of good design is not software, trends, or speed. It is thought. TTA exists at that foundation.",
    description: "The Thinking Architect is an intellectual platform for architects, designers, and spatial thinkers across Africa and the diaspora. We believe that rigorous thinking precedes responsible practice: the built environment is always a consequence of the ideas held by those who shape it.",
    closing: "We build the culture of rigour."
  },
  footer: {
    tagline: "Building the culture of rigour in African architecture.",
    copyright: "2026 TTA | The Thinking Architect. All rights reserved."
  }
};
