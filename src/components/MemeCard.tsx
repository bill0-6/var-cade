"use client";

import { Meme, TEAMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RectangleHorizontal, Check } from "lucide-react";
import { useState } from "react";

interface MemeCardProps {
  meme: Meme;
  onVote: (id: string, type: "golazo" | "redCard") => void;
  onVisible?: (teamId: string) => void;
  hasVoted?: boolean;
}

export default function MemeCard({ meme, onVote, onVisible, hasVoted }: MemeCardProps) {
  const [showToast, setShowToast] = useState(false);
  const team = TEAMS.find((t) => t.id === meme.teamId);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://var-cade.app/meme/${meme.id}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onViewportEnter={() => onVisible?.(meme.teamId)}
      viewport={{ amount: 0.6 }}
      className="bg-dark-surface rounded-xl overflow-hidden border border-dark-border shadow-lg mb-6 relative"
    >
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-white drop-shadow-md">{meme.handle}</span>
          <span className="text-sm text-gray-300 line-clamp-2 mt-1 drop-shadow-md">{meme.caption}</span>
        </div>
        {team && (
          <div className="flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full border border-dark-border backdrop-blur-sm shrink-0 ml-2">
            <span className="text-lg leading-none">{team.flag}</span>
            <span className="font-athletic tracking-wide mt-1 text-sm">{team.id}</span>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative w-full aspect-[4/5] bg-dark-bg flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meme.imageUrl}
          alt={meme.caption}
          className="w-full h-full object-cover"
        />
        
        {/* Marketing Watermark */}
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-athletic tracking-widest text-white/70 select-none pointer-events-none shadow-sm border border-white/10">
          VAR-CADE.COM
        </div>
      </div>

      {/* VAR Booth (Footer) */}
      <div className="p-4 bg-dark-surface border-t border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={!hasVoted ? { scale: 0.85 } : {}}
            onClick={() => !hasVoted && onVote(meme.id, "golazo")}
            disabled={hasVoted}
            className={cn("flex items-center gap-2 group transition-opacity", hasVoted ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}
          >
            <div className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center group-hover:border-pitch-green group-hover:bg-pitch-green/10 transition-colors">
              <span className="text-xl">⚽</span>
            </div>
            <span className="font-athletic text-xl mt-1 text-pitch-green">{meme.golazos}</span>
          </motion.button>
          
          <motion.button
            whileTap={!hasVoted ? { scale: 0.85 } : {}}
            onClick={() => !hasVoted && onVote(meme.id, "redCard")}
            disabled={hasVoted}
            className={cn("flex items-center gap-2 group transition-opacity", hasVoted ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}
          >
            <div className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center group-hover:border-red-card group-hover:bg-red-card/10 transition-colors">
              <RectangleHorizontal className="w-5 h-5 text-red-card transform rotate-90" />
            </div>
            <span className="font-athletic text-xl mt-1 text-red-card">{meme.redCards}</span>
          </motion.button>
        </div>

        <div className="relative flex items-center gap-2">
          {hasVoted && (
             <span className="text-xs font-bold text-gray-500 bg-dark-bg px-2 py-1 rounded-md flex items-center gap-1">
               <Check className="w-3 h-3" /> Voted
             </span>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center hover:text-vibrant-teal hover:border-vibrant-teal transition-colors"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          
          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -40 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 bottom-full bg-vibrant-teal text-black px-3 py-1 rounded-md text-sm font-bold shadow-lg whitespace-nowrap"
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
