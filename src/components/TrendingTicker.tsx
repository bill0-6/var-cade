"use client";

import { TEAMS } from "@/lib/mockData";

export default function TrendingTicker() {
  const trendingTeams = [
    { id: "MEX", name: "Mexico" },
    { id: "USA", name: "USA" },
    { id: "ARG", name: "Argentina" },
    { id: "ENG", name: "England" },
    { id: "BRA", name: "Brazil" },
    { id: "FRA", name: "France" },
    { id: "JPN", name: "Japan" },
    { id: "SEN", name: "Senegal" },
  ].map(t => TEAMS.find(team => team.id === t.id) || t);

  // Duplicate for infinite scrolling effect
  const marqueeItems = [...trendingTeams, ...trendingTeams, ...trendingTeams, ...trendingTeams];

  return (
    <div className="w-full bg-dark-surface border-b border-dark-border overflow-hidden relative h-10 flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark-surface to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max animate-[ticker_20s_linear_infinite] hover:[animation-play-state:paused] items-center whitespace-nowrap">
        <span className="font-athletic text-sm text-highlighter-yellow ml-6 mr-4 tracking-wider">
          🔥 TRENDING:
        </span>
        
        {marqueeItems.map((team: any, i) => (
          <div key={`${team.id}-${i}`} className="flex items-center text-gray-300 font-bold tracking-wide">
            <span className="ml-2 mr-1">{team.flag}</span>
            <span>{team.name}</span>
            <span className="mx-4 text-dark-border">•</span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 4)); }
        }
      `}} />
    </div>
  );
}
