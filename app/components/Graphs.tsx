"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Sparkline = ({ color = "#D94F2B", delay = 0 }) => {
  return (
    <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" className="opacity-40">
      <motion.path
        d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20"
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay, ease: "easeInOut" }}
      />
    </svg>
  );
};

export const StrategyRadar = () => {
  const pillars = ["Strategy", "Process", "Climate", "Culture", "People"];
  const points = [
    { x: 50, y: 10 },  // Strategy
    { x: 90, y: 40 },  // Process
    { x: 75, y: 85 },  // Climate
    { x: 25, y: 85 },  // Culture
    { x: 10, y: 40 },  // People
  ];

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background Grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
          <polygon
            key={scale}
            points={points.map(p => `${50 + (p.x - 50) * scale},${50 + (p.y - 50) * scale}`).join(' ')}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.1"
          />
        ))}
        
        {/* Axis Lines */}
        {points.map((p, i) => (
          <line
            key={i}
            x1="50" y1="50"
            x2={p.x} y2={p.y}
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.1"
          />
        ))}

        {/* The Data Shape */}
        <motion.polygon
          points={polygonPath}
          fill="rgba(217, 79, 43, 0.2)"
          stroke="#D94F2B"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ originX: "50px", originY: "50px" }}
        />

        {/* Labels (Conceptual) */}
        {pillars.map((label, i) => (
          <text
            key={label}
            x={points[i].x + (points[i].x > 50 ? 5 : -5)}
            y={points[i].y + (points[i].y > 50 ? 5 : -5)}
            textAnchor={points[i].x > 50 ? "start" : "end"}
            className="text-[4px] fill-white/40 font-bold uppercase tracking-widest"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
};

export const NetworkGraph = () => {
  const [nodes, setNodes] = useState<{ id: number; r: number; cx: string; cy: string; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate stable random values only on the client
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNodes([...Array(15)].map((_, i) => ({
      id: i,
      r: Math.random() * 3 + 1,
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    })));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg width="100%" height="100%" className="w-full h-full">
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            r={node.r}
            cx={node.cx}
            cy={node.cy}
            fill="#D94F2B"
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              delay: node.delay
            }}
          />
        ))}
      </svg>
    </div>
  );
};
