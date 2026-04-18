"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SessionsGrid from "./SessionsGrid";
import { Session } from "../lib/content";

const categories = ["All", "Talks", "Debates", "Guest Sessions"];

export default function SessionsArchive({ initialSessions }: { initialSessions: Session[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique tags from all sessions
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialSessions.forEach(s => {
      if (s.tags) s.tags.forEach(t => tags.add(t));
    });
    return ["All", ...Array.from(tags).sort()];
  }, [initialSessions]);

  const filteredSessions = useMemo(() => {
    return initialSessions.filter((session) => {
      const matchesCategory =
        activeCategory === "All" || session.category === activeCategory;
      const matchesTag = 
        activeTag === "All" || (session.tags && session.tags.includes(activeTag));
      const matchesSearch =
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.speaker?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [activeCategory, activeTag, searchQuery, initialSessions]);

  return (
    <div className="flex flex-col gap-10">
      {/* Controls Bar */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Search bar */}
          <div className="relative flex-1 max-w-xl">
             <input
              type="text"
              placeholder="Search sessions by title, speaker, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all font-body"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl w-full md:w-fit overflow-x-auto custom-scrollbar pb-2 md:pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-[14px] text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-accent text-black shadow-lg"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Tags */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 ml-4">
             <Filter size={10} />
             <span>Filter by Topic</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs transition-all border ${
                  activeTag === tag
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/50 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between border-t border-white/5 pt-8">
        <span className="small-text opacity-40 uppercase tracking-widest text-[10px] font-bold">
          Found {filteredSessions.length} {filteredSessions.length === 1 ? "match" : "matches"}
        </span>
        { (activeCategory !== "All" || activeTag !== "All" || searchQuery) && (
           <button 
            onClick={() => {
               setActiveCategory("All");
               setActiveTag("All");
               setSearchQuery("");
            }}
            className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
           >
             Clear all filters
           </button>
        )}
      </div>

      {/* Grid */}
      {filteredSessions.length > 0 ? (
        <SessionsGrid sessions={filteredSessions} />
      ) : (
        <div className="py-40 text-center glass-card bg-white/[0.02] border-white/5 rounded-[40px]">
          <div className="inline-flex items-center justify-center p-8 rounded-full bg-white/5 mb-8 text-white/10">
            <Search size={64} strokeWidth={1} />
          </div>
          <h3 className="heading-3 opacity-60">No sessions match your search.</h3>
          <p className="body-text mt-4 opacity-40 max-w-sm mx-auto">Try a different keyword or expand your filters to discover more architectural dialogues.</p>
        </div>
      )}
    </div>
  );
}
