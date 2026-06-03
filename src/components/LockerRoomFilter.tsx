"use client";

import { TEAMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface LockerRoomFilterProps {
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string | null) => void;
}

export default function LockerRoomFilter({ selectedTeamId, onSelectTeam }: LockerRoomFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 border-b border-dark-border">
      <div className="flex gap-2 px-4 w-max">
        <button
          onClick={() => onSelectTeam(null)}
          className={cn(
            "px-4 py-2 rounded-full font-athletic tracking-wide text-lg mt-1 transition-colors border",
            selectedTeamId === null
              ? "bg-neon-purple border-neon-purple text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]"
              : "bg-dark-surface border-dark-border text-gray-400 hover:text-white hover:border-gray-500"
          )}
        >
          All Teams
        </button>
        {TEAMS.map((team) => (
          <button
            key={team.id}
            onClick={() => onSelectTeam(team.id)}
            className={cn(
              "px-4 py-2 rounded-full font-athletic tracking-wide text-lg flex items-center gap-2 mt-1 transition-colors border",
              selectedTeamId === team.id
                ? "bg-vibrant-teal border-vibrant-teal text-black shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                : "bg-dark-surface border-dark-border text-gray-400 hover:text-white hover:border-gray-500"
            )}
          >
            <span className="text-base -mt-1 leading-none">{team.flag}</span>
            <span>{team.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
