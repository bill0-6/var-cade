"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { TEAMS, Meme } from "@/lib/mockData";
import { supabase } from "@/lib/supabaseClient";
import DOMPurify from "dompurify";

interface MemeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (meme: Omit<Meme, "id" | "timestamp" | "golazos" | "redCards" | "handle">) => void;
}

export default function MemeGeneratorModal({ isOpen, onClose, onPost }: MemeGeneratorModalProps) {
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [teamId, setTeamId] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImagePreview(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!selectedFile) {
      setError("Please upload an image.");
      return;
    }
    if (!teamId) {
      setError("Please select a team.");
      return;
    }
    if (!caption.trim()) {
      setError("Please write a caption.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('meme-images')
        .upload(fileName, selectedFile);
        
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('meme-images')
        .getPublicUrl(fileName);

      onPost({
        imageUrl: publicUrlData.publicUrl,
        teamId,
        caption: DOMPurify.sanitize(caption),
      });
      
      // Reset form
      setLocalImagePreview(null);
      setSelectedFile(null);
      setTeamId("");
      setCaption("");
      setError("");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload image. Make sure the 'meme-images' bucket exists.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isUploading ? onClose : undefined}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-dark-surface border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-dark-border flex justify-between items-center bg-gradient-to-r from-neon-purple/20 to-transparent">
              <h2 className="font-athletic text-2xl text-white mt-1">Post a Meme</h2>
              <button onClick={onClose} disabled={isUploading} className="p-2 bg-dark-bg rounded-full hover:bg-gray-800 transition disabled:opacity-50">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-6">
              {/* Image Upload Area */}
              <div 
                className={`relative w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors ${
                  localImagePreview ? 'border-vibrant-teal bg-black' : 'border-dark-border bg-dark-bg hover:border-neon-purple hover:bg-dark-bg/50 cursor-pointer'
                }`}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {localImagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={localImagePreview} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-500 mb-2" />
                    <span className="font-athletic text-lg text-gray-400">Tap to Upload Image</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-400">Select Team</label>
                  <select 
                    value={teamId} 
                    onChange={(e) => setTeamId(e.target.value)}
                    disabled={isUploading}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>Select a World Cup Team</option>
                    {TEAMS.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.flag} {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-gray-400">Caption</label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={isUploading}
                    placeholder="Write a banger caption..."
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-purple resize-none h-24 disabled:opacity-50"
                    maxLength={150}
                  />
                  <span className="text-xs text-right text-gray-500">{caption.length}/150</span>
                </div>
              </div>

              {error && (
                <div className="text-red-card text-sm font-bold bg-red-card/10 p-3 rounded-lg border border-red-card/20">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-dark-border bg-dark-bg flex justify-end">
              <button 
                onClick={handlePost}
                disabled={isUploading}
                className="bg-vibrant-teal text-black font-athletic text-xl px-8 py-3 rounded-full hover:bg-pitch-green transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="mt-1">{isUploading ? 'Uploading...' : 'Post Meme'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
