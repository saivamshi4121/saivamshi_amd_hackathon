"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-complete after 4.5 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f] overflow-hidden"
        >
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#ff006e] rounded-full blur-[100px] opacity-20 animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#00f5ff] rounded-full blur-[100px] opacity-20 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-[#ffbe0b] rounded-full blur-[100px] opacity-10 animate-pulse delay-500" />
          </div>

          {/* Skip Button */}
          <button
            onClick={handleComplete}
            className="absolute top-8 right-8 z-50 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-white/50 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
          >
            Skip Intro
          </button>

          {/* Logo Container */}
          <div className="relative z-10 w-full max-w-[400px] aspect-square flex flex-col items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,245,255,0.2)]">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#00f5ff", stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: "#ff006e", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#ffbe0b", stopOpacity: 1 }} />
                </linearGradient>
                <filter id="logoGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Ring */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ originX: "200px", originY: "200px" }}
              >
                <circle cx="200" cy="80" r="6" fill="#00f5ff" />
                <circle cx="320" cy="200" r="6" fill="#ff006e" />
                <circle cx="200" cy="320" r="6" fill="#ffbe0b" />
                <circle cx="80" cy="200" r="6" fill="#00f5ff" />
              </motion.g>

              {/* Inner Ring (Reverse) */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ originX: "200px", originY: "200px" }}
              >
                <circle cx="200" cy="120" r="4" fill="#ffbe0b" opacity="0.6" />
                <circle cx="280" cy="200" r="4" fill="#00f5ff" opacity="0.6" />
                <circle cx="200" cy="280" r="4" fill="#ff006e" opacity="0.6" />
                <circle cx="120" cy="200" r="4" fill="#ffbe0b" opacity="0.6" />
              </motion.g>

              {/* Core */}
              <motion.circle
                cx="200"
                cy="200"
                r="30"
                fill="url(#logoGrad)"
                filter="url(#logoGlow)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.1, 1] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Pulse Core */}
              <motion.circle
                cx="200"
                cy="200"
                r="10"
                fill="#fff"
                animate={{ r: [10, 15, 10], opacity: [0.8, 0.4, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Title Text */}
              <motion.text
                x="200"
                y="360"
                textAnchor="middle"
                fontSize="32"
                fontWeight="900"
                fill="url(#logoGrad)"
                filter="url(#logoGlow)"
                initial={{ opacity: 0, y: 380 }}
                animate={{ opacity: 1, y: 360 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                TriggerNudge
              </motion.text>
            </svg>

            {/* Loading Indicator */}
            <div className="absolute bottom-10 flex flex-col items-center gap-3">
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-mono">
                Initializing AI Coach
              </span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
