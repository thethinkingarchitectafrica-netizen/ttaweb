"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ExternalLink, Search, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function EventsView({ 
  upcomingEvent, 
  pastEvents 
}: { 
  upcomingEvent: any, 
  pastEvents: any[] 
}) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");

  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    pastEvents.forEach(e => {
      if (e.topics) e.topics.forEach((t: string) => topics.add(t));
    });
    return ["All", ...Array.from(topics).sort()];
  }, [pastEvents]);

  const filteredPastEvents = useMemo(() => {
    return pastEvents.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTopic = 
        activeTopic === "All" || (event.topics && event.topics.includes(activeTopic));

      return matchesSearch && matchesTopic;
    });
  }, [pastEvents, searchQuery, activeTopic]);

  return (
    <>
      <section className="container mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
          <div className="flex gap-8">
            {["upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                  activeTab === tab ? "text-accent" : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeTab === "past" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 max-w-md relative"
              >
                <input 
                  type="text"
                  placeholder="Search past events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {activeTab === "past" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex flex-wrap gap-2 overflow-hidden"
            >
              {allTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeTopic === topic 
                      ? "bg-white text-black border-white" 
                      : "bg-transparent text-white/40 border-white/5 hover:border-white/20"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="container pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "upcoming" ? (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              {[upcomingEvent].map((event) => (
                <div key={event.id} className="glass-card flex flex-col md:flex-row gap-10 p-10 bg-accent/5 border-accent/20 group overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
                   
                   <div className="flex-1 flex flex-col gap-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="tag !text-[10px]">Upcoming Session</span>
                        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                           <Calendar size={14} />
                           <span>{event.date}</span>
                        </div>
                      </div>

                      {event.flyer_url && (
                        <div className="md:hidden w-full aspect-[3/4] rounded-2xl overflow-hidden relative border border-white/10 mb-4">
                          <Image src={event.flyer_url} alt={event.title} fill className="object-cover" />
                        </div>
                      )}

                      <h2 className="heading-2 !text-4xl md:!text-5xl group-hover:text-accent transition-colors duration-500">
                        {event.title}
                      </h2>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-3 text-white/80">
                            <User size={18} className="text-accent" />
                            <span className="font-semibold">{event.speaker}</span>
                         </div>
                         <p className="body-text opacity-70 leading-relaxed max-w-2xl text-lg">
                           {event.description}
                         </p>
                      </div>
                   </div>

                   {event.flyer_url && (
                      <div className="hidden md:block md:w-1/3 aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700">
                         <Image src={event.flyer_url} alt={event.title} fill className="object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                   )}

                   <div className="md:w-1/4 flex flex-col justify-center gap-4 relative z-10">
                      <a href={event.link} className="button-primary w-full text-center py-5">
                        Register on Luma
                      </a>
                      <p className="small-text text-center opacity-40 uppercase tracking-widest text-[9px] font-bold">Limited seats available</p>
                   </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="past"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPastEvents.length > 0 ? (
                filteredPastEvents.map((event) => (
                  <div key={event.id} className="glass-card flex flex-col gap-6 border-white/5 hover:border-accent/30 transition-all p-8 group overflow-hidden">
                    {event.flyer_url ? (
                      <div className="aspect-video relative rounded-xl overflow-hidden mb-2 border border-white/5">
                         <Image src={event.flyer_url} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="aspect-video relative rounded-xl overflow-hidden mb-2 bg-white/5 flex items-center justify-center text-white/10">
                         <ImageIcon size={40} strokeWidth={1} />
                      </div>
                    )}
                    <div className="text-accent text-[11px] font-bold uppercase tracking-widest">{event.date}</div>
                    <h3 className="heading-3 group-hover:text-accent transition-colors leading-tight min-h-[3rem] text-xl">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 small-text opacity-50 font-medium">
                      <User size={14} className="text-accent" />
                      {event.speaker}
                    </div>
                    <p className="body-text text-sm opacity-60 line-clamp-3 mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                       <span className="small-text opacity-30 italic text-[11px]">{event.attendance || "Live Session"}</span>
                       <a href={event.link} className="text-accent flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:translate-x-1 transition-transform">
                          Watch <ExternalLink size={14} />
                       </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                   <p className="heading-3 opacity-30">No past events match your search.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
