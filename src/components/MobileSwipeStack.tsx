"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { Meme } from "@/lib/mockData";
import MemeCard from "./MemeCard";
import { Plus } from "lucide-react";

interface MobileSwipeStackProps {
  memes: Meme[];
  onVote: (id: string, type: "golazo" | "redCard") => void;
  onEmptyClick: () => void;
  onVisible?: (teamId: string) => void;
}

export default function MobileSwipeStack({ memes, onVote, onEmptyClick, onVisible }: MobileSwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when feed changes substantially (e.g. filters)
  useEffect(() => {
    setCurrentIndex(0);
  }, [memes.length]);

  const currentMeme = memes[currentIndex];
  
  // Update ambient background for the current meme
  useEffect(() => {
    if (currentMeme && onVisible) {
      onVisible(currentMeme.teamId);
    }
  }, [currentMeme, onVisible]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const controls = useAnimation();

  const handleDragEnd = async (e: any, info: PanInfo) => {
    const threshold = window.innerWidth * 0.35; // 35% of screen width
    
    if (info.offset.x > threshold) {
      // Swiped Right - Golazo
      await controls.start({ x: window.innerWidth, opacity: 0, transition: { duration: 0.3 } });
      onVote(currentMeme.id, "golazo");
      setCurrentIndex((i) => i + 1);
      x.set(0);
      controls.set({ x: 0, opacity: 1 });
    } else if (info.offset.x < -threshold) {
      // Swiped Left - Red Card
      await controls.start({ x: -window.innerWidth, opacity: 0, transition: { duration: 0.3 } });
      onVote(currentMeme.id, "redCard");
      setCurrentIndex((i) => i + 1);
      x.set(0);
      controls.set({ x: 0, opacity: 1 });
    } else {
      // Snap back
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  if (currentIndex >= memes.length || memes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center h-full">
        <h2 className="font-athletic text-3xl text-white mb-2">End of Feed</h2>
        <p className="text-gray-400 mb-8">You've seen all the memes for this selection.</p>
        <button
          onClick={onEmptyClick}
          className="bg-neon-purple text-white px-6 py-3 rounded-full font-athletic text-xl flex items-center gap-2 hover:bg-fuchsia-600 transition-colors shadow-[0_0_15px_rgba(138,43,226,0.5)]"
        >
          <Plus className="w-5 h-5" />
          <span className="mt-1">Upload More!</span>
        </button>
      </div>
    );
  }

  const nextMeme = memes[currentIndex + 1];

  return (
    <div className="relative w-full max-w-sm mx-auto h-[70vh] flex items-center justify-center perspective-1000">
      {/* Next Card (Background) */}
      {nextMeme && (
        <div className="absolute inset-0 scale-95 opacity-50 pointer-events-none transform translate-y-4 transition-all duration-300">
          <MemeCard meme={nextMeme} onVote={() => {}} />
        </div>
      )}

      {/* Current Card (Foreground) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, opacity }}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      >
        <div className="pointer-events-none">
          {/* We make inner items pointer-events-none so drag doesn't get interrupted, 
              but we need to intercept button clicks. 
              Actually, Framer Motion drag handles clicks fine if we just wrap it. */}
        </div>
        <MemeCard 
          meme={currentMeme} 
          onVote={(id, type) => {
            // If they click the button instead of swipe
            onVote(id, type);
            setCurrentIndex((i) => i + 1);
          }} 
        />
      </motion.div>
      
      {/* Swipe Indicators */}
      <motion.div 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-card/90 text-white font-athletic text-2xl px-4 py-2 rounded-lg rotate-12 z-20 pointer-events-none"
        style={{ opacity: useTransform(x, [-100, -200], [0, 1]) }}
      >
        RED CARD
      </motion.div>
      <motion.div 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-pitch-green/90 text-black font-athletic text-2xl px-4 py-2 rounded-lg -rotate-12 z-20 pointer-events-none"
        style={{ opacity: useTransform(x, [100, 200], [0, 1]) }}
      >
        GOLAZO!
      </motion.div>
    </div>
  );
}
