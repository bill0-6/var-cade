"use client";

import { UserLeaderboardEntry } from "@/lib/mockData";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  entries: UserLeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden sticky top-24">
      <div className="bg-gradient-to-r from-highlighter-yellow/20 to-vibrant-teal/20 p-4 border-b border-dark-border flex items-center gap-2">
        <Trophy className="w-6 h-6 text-highlighter-yellow" />
        <h2 className="font-athletic text-2xl tracking-wide text-white mt-1">Golden Boot</h2>
      </div>
      
      <div className="p-4 space-y-4">
        {entries.map((entry, index) => (
          <div key={entry.handle} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-athletic text-xl text-gray-500 w-4 text-center mt-1">
                {index + 1}
              </span>
              <span className="font-bold text-gray-200">
                {entry.handle}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-pitch-green">⚽</span>
              <span className="font-athletic text-lg text-pitch-green mt-1">
                {entry.golazos}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
