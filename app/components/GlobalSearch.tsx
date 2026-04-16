"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Search, X, PlayCircle, Calendar, Users, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  type: "session" | "event" | "team";
  description?: string;
  href: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<{ sessions: any[], events: any[], team: any[] }>({
    sessions: [],
    events: [],
    team: []
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && data.sessions.length === 0) {
      fetchData();
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // We'll use a client-side fetcher or the existing data service logic
      // For global search, we'll hit simplified endpoints or the existing ones
      const [resSessions, resEvents, resTeam] = await Promise.all([
        fetch("/api/sessions").then(r => r.json()),
        fetch("/api/events").then(r => r.json()),
        fetch("/api/team").then(r => r.json())
      ]);

      setData({
        sessions: resSessions || [],
        events: resEvents.pastEvents ? [...resEvents.pastEvents, resEvents.upcomingEvent] : [],
        team: resTeam || []
      });
    } catch (err) {
      console.error("Search fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchStr = query.toLowerCase();
    const matches: SearchResult[] = [];

    data.sessions.forEach(s => {
      if (s.title.toLowerCase().includes(searchStr) || s.description?.toLowerCase().includes(searchStr)) {
        matches.push({ id: s.id, title: s.title, type: "session", description: s.speaker, href: `/sessions` });
      }
    });

    data.events.forEach(e => {
      if (e.title.toLowerCase().includes(searchStr) || e.description?.toLowerCase().includes(searchStr)) {
        matches.push({ id: e.id, title: e.title, type: "event", description: e.date, href: `/events` });
      }
    });

    data.team.forEach(t => {
      if (t.name.toLowerCase().includes(searchStr) || t.role.toLowerCase().includes(searchStr)) {
        matches.push({ id: t.id, title: t.name, type: "team", description: t.role, href: `/team` });
      }
    });

    return matches.slice(0, 10);
  }, [query, data]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Search Trigger Button (for UI availability) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all ml-4"
      >
        <Search size={16} />
        <span className="text-xs font-medium">Search Library</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold">
           <Command size={10} />
           <span>K</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 backdrop-blur-xl bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-6 border-b border-white/5">
                <Search className="text-accent" size={24} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type to search dialogue, events, and people..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xl text-white outline-none placeholder:text-white/20 font-light"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                {!query.trim() ? (
                  <div className="p-8 text-center flex flex-col items-center gap-4 opacity-30 mt-10 mb-10">
                    <Command size={48} strokeWidth={1} />
                    <p className="body-text text-sm uppercase tracking-widest font-bold">Search all of TTA</p>
                  </div>
                ) : loading ? (
                  <div className="p-20 flex justify-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {results.map((res) => (
                      <button
                        key={`${res.type}-${res.id}`}
                        onClick={() => handleSelect(res.href)}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group text-left w-full"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors">
                          {res.type === "session" && <PlayCircle size={20} />}
                          {res.type === "event" && <Calendar size={20} />}
                          {res.type === "team" && <Users size={20} />}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="text-white font-medium">{res.title}</span>
                          <span className="text-xs text-white/40 uppercase tracking-widest mt-0.5">{res.description || res.type}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">
                          <Search size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center opacity-30">
                    <p className="body-text">No results found for "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd> to navigate</div>
                    <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> to select</div>
                 </div>
                 <div>Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Esc</kbd> to close</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
