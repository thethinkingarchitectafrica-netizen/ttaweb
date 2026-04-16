"use client";

import { motion } from "framer-motion";

interface LogoProps {
  variant?: "monogram" | "badge";
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function Logo({
  variant = "monogram",
  size = 40,
  className = "",
  animate = true,
}: LogoProps) {
  const transition: any = {
    duration: 2.5,
    ease: "easeInOut",
    delay: 0.2,
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  if (variant === "monogram") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 410 350"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(1.25, 249.4)">
          <motion.path
            d="M 92.625 0 C 83.23 -2.08 74.98 -6.26 67.87 -6.26 C 60.75 -10.45 55.18 -16.06 51.15 -23.09 C 47.12 -30.13 45.10 -37.98 45.10 -46.64 L 45.10 -123.2 L 3.29 -123.2 L 3.29 -154 L 123.65 -154 L 123.65 -123.2 L 82.06 -123.2 L 82.06 -43.34 C 82.06 -39.96 83.23 -37.03 85.57 -34.53 C 87.92 -32.03 90.86 -30.79 94.39 -30.79 L 106.48 -30.79 L 106.48 0 Z"
            variants={animate ? pathVariants : {}}
            initial="hidden"
            animate="visible"
            transition={transition}
          />
        </g>
        <g transform="translate(126.6, 249.4)">
          <motion.path
            d="M 92.625 0 C 83.23 -2.08 74.98 -6.26 67.87 -6.26 C 60.75 -10.45 55.18 -16.06 51.15 -23.09 C 47.12 -30.13 45.10 -37.98 45.10 -46.64 L 45.10 -123.2 L 3.29 -123.2 L 3.29 -154 L 123.65 -154 L 123.65 -123.2 L 82.06 -123.2 L 82.06 -43.34 C 82.06 -39.96 83.23 -37.03 85.57 -34.53 C 87.92 -32.03 90.86 -30.79 94.39 -30.79 L 106.48 -30.79 L 106.48 0 Z"
            variants={animate ? pathVariants : {}}
            initial="hidden"
            animate="visible"
            transition={{ ...transition, delay: 0.4 }}
          />
        </g>
        <g transform="translate(243.2, 249.4)">
          <motion.path
            d="M 0 0 L 49.93 -136.18 C 52.43 -142.93 56.54 -148.03 62.26 -151.48 C 67.98 -154.92 74.43 -156.65 81.62 -156.65 C 88.81 -156.65 95.26 -155 100.98 -151.7 C 106.7 -148.39 110.81 -143.3 113.31 -136.4 L 163.46 0 L 123.65 0 L 113.96 -29.7 L 48.62 -29.7 L 38.5 0 Z M 58.07 -60.28 L 104.5 -60.28 L 84.92 -121.67 C 84.62 -122.54 84.22 -123.16 83.71 -123.53 C 83.20 -123.90 82.58 -124.09 81.84 -124.09 C 81.11 -124.09 80.48 -123.86 79.96 -123.42 C 79.45 -122.98 79.12 -122.39 78.98 -121.67 Z"
            variants={animate ? pathVariants : {}}
            initial="hidden"
            animate="visible"
            transition={{ ...transition, delay: 0.6 }}
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1500 1500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.circle
        cx="750"
        cy="750"
        r="415"
        stroke="currentColor"
        strokeWidth="20"
        variants={animate ? pathVariants : {}}
        initial="hidden"
        animate="visible"
        transition={transition}
      />
      <motion.circle
        cx="750"
        cy="750"
        r="400"
        stroke="currentColor"
        strokeWidth="10"
        strokeOpacity="0.2"
        variants={animate ? pathVariants : {}}
        initial="hidden"
        animate="visible"
        transition={{ ...transition, delay: 0.3 }}
      />
      <g transform="translate(560, 600) scale(1.5)">
         <motion.path
            d="M 92.625 0 C 83.23 -2.08 74.98 -6.26 67.87 -6.26 C 60.75 -10.45 55.18 -16.06 51.15 -23.09 C 47.12 -30.13 45.10 -37.98 45.10 -46.64 L 45.10 -123.2 L 3.29 -123.2 L 3.29 -154 L 123.65 -154 L 123.65 -123.2 L 82.06 -123.2 L 82.06 -43.34 C 82.06 -39.96 83.23 -37.03 85.57 -34.53 C 87.92 -32.03 90.86 -30.79 94.39 -30.79 L 106.48 -30.79 L 106.48 0 Z"
            fill="currentColor"
            variants={animate ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : {}}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
          />
      </g>
    </svg>
  );
}
