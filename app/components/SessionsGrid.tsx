"use client";

import { motion } from "framer-motion";
import { PlayCircle, Calendar } from "lucide-react";
import { Session } from "../lib/content";
import Image from "next/image";

interface SessionsGridProps {
  sessions: Session[];
}

export default function SessionsGrid({ sessions }: SessionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {sessions.map((session, idx) => (
        <motion.a
          key={session.id}
          href={session.videoUrl || "#"}
          target={session.videoUrl ? "_blank" : undefined}
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="group relative flex flex-col glass-card border-white/5 bg-surface/30 overflow-hidden hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(217,79,43,0.1)] transition-all duration-500 cursor-pointer"
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden rounded-t-2xl">
            <Image
              src={session.thumbnailUrl}
              alt={session.title}
              width={800}
              height={450}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                <PlayCircle size={40} fill="currentColor" stroke="none" className="text-[#050505]" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-8 gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 small-text opacity-50 font-medium">
                <span className="text-accent">{session.speaker}</span>
                <span className="opacity-30">·</span>
                <span>{session.date}</span>
                {session.duration && (
                  <>
                    <span className="opacity-30">·</span>
                    <span>{session.duration}</span>
                  </>
                )}
                {session.tags && session.tags.length > 0 && (
                  <>
                    <span className="opacity-30">·</span>
                    <span>{session.tags.join(", ")}</span>
                  </>
                )}
              </div>
              <h3 className="heading-3 text-2xl group-hover:text-accent transition-colors duration-300">
                {session.title}
              </h3>
            </div>
            
            <p className="body-text flex-1 opacity-60 leading-relaxed text-[17px] line-clamp-2">
              {session.description}
            </p>

            <div className="flex items-center gap-3 font-semibold text-accent group-hover:translate-x-1 transition-transform duration-300">
               <span className="tracking-wide text-sm uppercase">Watch Recording</span>
               <PlayCircle size={20} />
            </div>
          </div>
          
          {/* Subtle Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-500" />
        </motion.a>
      ))}
    </div>
  );
}
