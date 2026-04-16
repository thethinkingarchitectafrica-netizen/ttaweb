"use client";

import { motion } from "framer-motion";
import { Brain, MessageSquare, Video } from "lucide-react";
import { Feature } from "../lib/content";

const iconMap = {
  Thinking: Brain,
  Dialogue: MessageSquare,
  Visibility: Video,
};

interface PillarsProps {
  features: Feature[];
}

export default function Pillars({ features }: PillarsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      {features.map((feature, idx) => {
        const Icon = iconMap[feature.name as keyof typeof iconMap] || Brain;
        
        return (
          <motion.div
            key={feature.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card group flex flex-col gap-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(217,79,43,0.1)] hover:border-accent/30 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-300">
              <Icon size={24} strokeWidth={1.5} />
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="heading-3 text-2xl group-hover:text-accent transition-colors duration-300">
                {feature.name}
              </h3>
              <p className="body-text text-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {feature.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
