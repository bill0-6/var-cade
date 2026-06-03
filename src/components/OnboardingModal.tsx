"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface OnboardingModalProps {
  onEnter: (handle: string) => void;
}

export default function OnboardingModal({ onEnter }: OnboardingModalProps) {
  const [handle, setHandle] = useState("");

  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setHandle(`@Fan_${randomNum}`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim().length > 1) {
      let finalHandle = handle.trim();
      if (!finalHandle.startsWith("@")) finalHandle = "@" + finalHandle;
      onEnter(finalHandle);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-dark-surface border border-neon-purple rounded-2xl shadow-[0_0_30px_rgba(138,43,226,0.3)] p-6 flex flex-col gap-6"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-neon-purple" />
          </div>
          <h2 className="font-athletic text-3xl text-white">Welcome to VAR-Cade</h2>
          <p className="text-gray-400 text-sm">Claim your handle to vote, post memes, and dominate the leaderboard. No sign-up required.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Your Handle</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-white text-lg focus:outline-none focus:border-neon-purple text-center tracking-wide font-bold"
              maxLength={20}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-vibrant-teal text-black font-athletic text-xl py-4 rounded-xl hover:bg-pitch-green transition-colors mt-2"
          >
            Enter Stadium
          </button>
        </form>
      </motion.div>
    </div>
  );
}
