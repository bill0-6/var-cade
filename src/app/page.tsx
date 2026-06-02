"use client";

import { useEffect, useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import LockerRoomFilter from "@/components/LockerRoomFilter";
import TrendingTicker from "@/components/TrendingTicker";
import MemeCard from "@/components/MemeCard";
import Leaderboard from "@/components/Leaderboard";
import MemePredictor from "@/components/MemePredictor";
import MemeGeneratorModal from "@/components/MemeGeneratorModal";
import MobileSwipeStack from "@/components/MobileSwipeStack";
import { Meme, TEAMS, UserProfile } from "@/lib/mockData";
import { Plus, Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ handle: string, golazos: number }[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    handle: "@you_the_legend",
    memeKarma: 0,
    currentPrediction: null,
  });
  const [votedMemeIds, setVotedMemeIds] = useState<string[]>([]);
  
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Rate Limiting Refs
  const lastVoteTime = useRef<number>(0);
  const lastPostTime = useRef<number>(0);
  
  const [mobileTab, setMobileTab] = useState<"feed" | "gamify">("feed");
  const isMobile = useMediaQuery("(max-width: 1024px)");

  // Initial Data Load & Realtime Subscriptions
  useEffect(() => {
    setMounted(true);

    const savedProfile = localStorage.getItem("varCadeProfile");
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    const savedVoted = localStorage.getItem("varCadeVoted");
    if (savedVoted) setVotedMemeIds(JSON.parse(savedVoted));

    const fetchMemes = async () => {
      const { data } = await supabase.from('memes').select('*').order('created_at', { ascending: false });
      if (data) {
        setMemes(data.map(m => ({
          id: m.id,
          imageUrl: m.image_url,
          handle: m.handle,
          teamId: m.team_id,
          caption: m.caption,
          golazos: m.golazos,
          redCards: m.red_cards,
          timestamp: m.created_at
        })));
      }
    };

    const fetchLeaderboard = async () => {
      const { data } = await supabase.from('predictions').select('handle, meme_karma').order('meme_karma', { ascending: false }).limit(5);
      if (data) {
        setLeaderboard(data.map(d => ({ handle: d.handle, golazos: d.meme_karma })));
      }
    };

    fetchMemes();
    fetchLeaderboard();

    // Realtime Subs
    const memesSub = supabase.channel('memes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memes' }, fetchMemes)
      .subscribe();
      
    const predsSub = supabase.channel('predictions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'predictions' }, fetchLeaderboard)
      .subscribe();

    return () => {
      supabase.removeChannel(memesSub);
      supabase.removeChannel(predsSub);
    };
  }, []);

  const handleVote = async (id: string, type: "golazo" | "redCard") => {
    if (votedMemeIds.includes(id)) return;

    // Rate Limit: 1 vote per second
    const now = Date.now();
    if (now - lastVoteTime.current < 1000) {
      console.warn("Rate limited: Please wait a moment before voting again.");
      return;
    }
    lastVoteTime.current = now;

    // Optimistic UI update
    setVotedMemeIds(prev => {
      const next = [...prev, id];
      localStorage.setItem("varCadeVoted", JSON.stringify(next));
      return next;
    });

    setMemes(prev => prev.map(meme => {
      if (meme.id === id) {
        return {
          ...meme,
          golazos: type === "golazo" ? meme.golazos + 1 : meme.golazos,
          redCards: type === "redCard" ? meme.redCards + 1 : meme.redCards,
        };
      }
      return meme;
    }));

    // DB Mutation
    try {
      const { error: insertError } = await supabase.from('votes').insert({
        meme_id: id,
        handle: userProfile.handle,
        vote_type: type
      });

      if (insertError) {
        if (insertError.code === '23505') return; // Ignore unique constraint double-vote gracefully
        console.error("Vote failed", insertError);
        return;
      }

      const currentMeme = memes.find(m => m.id === id);
      if (currentMeme) {
        await supabase.from('memes').update({
          golazos: type === "golazo" ? currentMeme.golazos + 1 : currentMeme.golazos,
          red_cards: type === "redCard" ? currentMeme.redCards + 1 : currentMeme.redCards,
        }).eq('id', id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostMeme = async (newMemeData: Omit<Meme, "id" | "timestamp" | "golazos" | "redCards" | "handle">) => {
    // Rate Limit: 1 post per 30 seconds
    const now = Date.now();
    if (now - lastPostTime.current < 30000) {
      alert("Please wait 30 seconds before posting another meme to prevent spam.");
      return;
    }
    lastPostTime.current = now;

    const { error } = await supabase.from('memes').insert({
      image_url: newMemeData.imageUrl,
      handle: userProfile.handle,
      team_id: newMemeData.teamId,
      caption: newMemeData.caption,
    });
    if (error) console.error("Failed to post meme", error);
  };

  const handlePredict = async (teamId: string) => {
    const newKarma = userProfile.memeKarma + 10;
    const updatedProfile = {
      ...userProfile,
      currentPrediction: teamId,
      memeKarma: newKarma,
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("varCadeProfile", JSON.stringify(updatedProfile));

    const { error } = await supabase.from('predictions').upsert({
      handle: updatedProfile.handle,
      current_prediction: teamId,
      meme_karma: newKarma,
    }, { onConflict: 'handle' });
    
    if (error) console.error("Failed to update prediction", error);
  };

  const filteredMemes = memes.filter((m) => {
    if (selectedTeamId) return m.teamId === selectedTeamId;
    return true;
  });

  const activeTeam = TEAMS.find(t => t.id === activeTeamId);
  const themeClass = activeTeam?.themeColor || "from-dark-bg via-dark-bg to-dark-bg";

  if (!mounted) return null;

  return (
    <>
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br transition-all duration-1000 ease-in-out opacity-40 ${themeClass}`} />
      
      <TrendingTicker />
      <NavBar />
      <LockerRoomFilter
        selectedTeamId={selectedTeamId}
        onSelectTeam={(teamId) => {
          setSelectedTeamId(teamId);
        }}
      />
      
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 pb-24">
        {(!isMobile || mobileTab === "feed") && (
          <div className="w-full lg:w-2/3 max-w-2xl mx-auto lg:mx-0 flex flex-col gap-2">
            {isMobile ? (
              <MobileSwipeStack 
                memes={filteredMemes}
                onVote={handleVote}
                onEmptyClick={() => setIsModalOpen(true)}
                onVisible={setActiveTeamId}
              />
            ) : (
              <>
                {filteredMemes.length === 0 ? (
                  <div className="text-center py-20 text-gray-500 font-athletic text-2xl border border-dashed border-dark-border rounded-xl">
                    No memes found for this selection. Upload one!
                  </div>
                ) : (
                  filteredMemes.map((meme) => (
                    <MemeCard 
                      key={meme.id} 
                      meme={meme} 
                      onVote={handleVote} 
                      onVisible={setActiveTeamId}
                      hasVoted={votedMemeIds.includes(meme.id)}
                    />
                  ))
                )}
              </>
            )}
          </div>
        )}
        
        {(!isMobile || mobileTab === "gamify") && (
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <MemePredictor 
              karma={userProfile.memeKarma}
              currentPrediction={userProfile.currentPrediction}
              onPredict={handlePredict}
            />
            <Leaderboard entries={leaderboard.length > 0 ? leaderboard : []} />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {mobileTab === "feed" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-20 right-6 lg:bottom-10 lg:right-10 w-16 h-16 bg-neon-purple rounded-full shadow-[0_0_20px_rgba(138,43,226,0.6)] flex items-center justify-center text-white z-40 hover:bg-fuchsia-600 transition-colors"
          style={{
            boxShadow: activeTeam ? `0 0 20px ${activeTeam.themeColor.includes('green') ? '#39FF14' : activeTeam.themeColor.includes('blue') ? '#00E5FF' : '#8A2BE2'}40` : undefined
          }}
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}

      {/* Mobile Bottom Navigation Tabs */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-dark-surface/95 backdrop-blur-md border-t border-dark-border z-30 flex">
          <button 
            onClick={() => setMobileTab("feed")}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${mobileTab === "feed" ? "text-vibrant-teal" : "text-gray-500"}`}
          >
            <Flame className="w-6 h-6" />
            <span className="font-athletic text-sm mt-1">The Feed</span>
          </button>
          <button 
            onClick={() => setMobileTab("gamify")}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors ${mobileTab === "gamify" ? "text-highlighter-yellow" : "text-gray-500"}`}
          >
            <Trophy className="w-6 h-6" />
            <span className="font-athletic text-sm mt-1">Predict & Win</span>
          </button>
        </div>
      )}

      <MemeGeneratorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPost={handlePostMeme} 
      />
    </>
  );
}
