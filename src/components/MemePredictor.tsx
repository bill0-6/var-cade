"use client";

import { MATCHES, TEAMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Trophy, Star, TrendingUp } from "lucide-react";

interface MemePredictorProps {
  karma: number;
  currentPrediction: string | null;
  onPredict: (teamId: string) => void;
}

export default function MemePredictor({ karma, currentPrediction, onPredict }: MemePredictorProps) {
  // Extract unique teams from today's matches
  const matchTeams = Array.from(new Set(MATCHES.flatMap(m => [m.team1Id, m.team2Id])))
    .map(id => TEAMS.find(t => t.id === id)!)
    .filter(Boolean);

  return (
    <div className="bg-dark-surface rounded-xl border border-dark-border overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-neon-purple/20 to-vibrant-teal/20 p-4 border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-neon-purple" />
          <h2 className="font-athletic text-2xl tracking-wide text-white mt-1">Predictor</h2>
        </div>
        <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-dark-border shadow-inner">
          <Star className="w-4 h-4 text-highlighter-yellow fill-highlighter-yellow" />
          <span className="font-athletic text-lg text-highlighter-yellow mt-1">{karma} Karma</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-gray-300 text-sm">
          Predict which team will generate the most memes today! Earn +10 Karma for participating.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {matchTeams.map((team) => {
            const isSelected = currentPrediction === team.id;
            return (
              <button
                key={team.id}
                onClick={() => onPredict(team.id)}
                disabled={currentPrediction !== null && !isSelected}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                  isSelected
                    ? "bg-vibrant-teal/20 border-vibrant-teal text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                    : currentPrediction !== null
                    ? "bg-dark-bg/50 border-dark-bg text-gray-600 cursor-not-allowed grayscale"
                    : "bg-dark-bg border-dark-border hover:border-gray-500 hover:bg-dark-bg/80 text-gray-300"
                )}
              >
                <span className="text-2xl mb-1 leading-none">{team.flag}</span>
                <span className="font-athletic tracking-wide text-sm">{team.name}</span>
                {isSelected && (
                  <span className="mt-2 text-xs font-bold text-vibrant-teal bg-vibrant-teal/10 px-2 py-0.5 rounded">
                    LOCKED IN
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
