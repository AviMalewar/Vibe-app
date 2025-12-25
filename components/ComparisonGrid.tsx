
import React from 'react';
import { StudentProfile } from '../types';
import Button from './Button';

interface ComparisonGridProps {
  profiles: StudentProfile[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ profiles, onClose, onRemove }) => {
  const categories = [
    { label: 'Vibe Match', key: 'vibe_score' },
    { label: 'Branch & Year', key: 'branch_year' },
    { label: 'Lifestyle', key: 'lifestyle' },
    { label: 'Bio', key: 'bio' },
    { label: 'Interests', key: 'interests' },
    { label: 'Movies', key: 'movies' },
  ];

  // Helper to calculate a deterministic pseudo-score for demo purposes
  // In a real app, this would come from the Gemini API
  const getMatchScore = (p1: StudentProfile, p2: StudentProfile) => {
    if (p1.id === p2.id) return 100;
    let score = 50;
    if (p1.branch === p2.branch) score += 15;
    if (p1.lifestyle === p2.lifestyle) score += 15;
    const commonInterests = p1.interests.filter(i => p2.interests.includes(i));
    score += commonInterests.length * 5;
    return Math.min(score, 99);
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 mb-4">No students selected for comparison.</p>
        <Button onClick={onClose}>Go Back</Button>
      </div>
    );
  }

  const referenceProfile = profiles[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white">Side-by-Side</h2>
          <p className="text-purple-400 font-bold uppercase tracking-widest text-xs mt-1">
            Comparing {profiles.length} Peer Vibes • 
            <span className="text-white/40 ml-2 italic">"{referenceProfile.name}" is your reference</span>
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>Back to Gallery</Button>
      </div>

      <div className="overflow-x-auto pb-8 custom-scrollbar">
        <div className="min-w-[900px] grid" style={{ gridTemplateColumns: `180px repeat(${profiles.length}, 1fr)` }}>
          {/* Header Row: Avatars & Names */}
          <div className="p-4 border-b border-white/5"></div>
          {profiles.map(profile => (
            <div key={profile.id} className="p-6 text-center border-b border-white/5 relative group">
              <button 
                onClick={() => onRemove(profile.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative inline-block mb-4">
                <img src={profile.avatar} className={`w-24 h-24 rounded-2xl mx-auto border-2 ${profile.id === referenceProfile.id ? 'border-purple-500' : 'border-white/10'}`} alt="" />
                {profile.id === referenceProfile.id && (
                  <div className="absolute -top-2 -left-2 bg-purple-500 text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-lg">Reference</div>
                )}
              </div>
              <h3 className="text-xl font-black text-white truncate">{profile.name}</h3>
            </div>
          ))}

          {/* Data Rows */}
          {categories.map((cat, idx) => (
            <React.Fragment key={cat.key}>
              <div className={`p-4 flex items-center bg-white/5 border-b border-white/5 ${idx === categories.length - 1 ? 'rounded-bl-2xl' : ''}`}>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{cat.label}</span>
              </div>
              {profiles.map(profile => {
                const isReference = profile.id === referenceProfile.id;
                return (
                  <div key={`${profile.id}-${cat.key}`} className={`p-6 border-b border-white/5 bg-white/[0.02] flex items-center ${idx % 2 === 0 ? 'bg-white/[0.04]' : ''}`}>
                    {cat.key === 'vibe_score' && (
                      <div className="w-full">
                        {isReference ? (
                          <span className="text-xs font-black text-white/20 uppercase">Baseline</span>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className={`text-2xl font-black ${getMatchScore(referenceProfile, profile) > 80 ? 'vibe-text-gradient' : 'text-white'}`}>
                                {getMatchScore(referenceProfile, profile)}%
                              </span>
                              <span className="text-[8px] font-black text-white/40 uppercase">Compatibility</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full vibe-gradient transition-all duration-1000" 
                                style={{ width: `${getMatchScore(referenceProfile, profile)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {cat.key === 'branch_year' && (
                      <div>
                        <p className="text-white font-bold">{profile.branch}</p>
                        <p className="text-xs text-white/40">{profile.year} Year</p>
                      </div>
                    )}
                    {cat.key === 'lifestyle' && (
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-black whitespace-nowrap">
                        {profile.lifestyle === 'Night Owl' ? '🦉' : profile.lifestyle === 'Early Bird' ? '☀️' : profile.lifestyle === 'Indoor' ? '🏠' : '🌳'} {profile.lifestyle}
                      </span>
                    )}
                    {cat.key === 'bio' && (
                      <p className="text-xs text-white/60 leading-relaxed italic line-clamp-3">"{profile.bio}"</p>
                    )}
                    {cat.key === 'interests' && (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.interests.map((i, idx) => (
                          <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-lg ${referenceProfile.interests.includes(i) && !isReference ? 'bg-purple-500/30 text-white' : 'bg-white/5 text-white/50'}`}>{i}</span>
                        ))}
                      </div>
                    )}
                    {cat.key === 'movies' && (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.movieGenres.map((m, idx) => (
                          <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-lg ${referenceProfile.movieGenres.includes(m) && !isReference ? 'bg-pink-500/30 text-white' : 'bg-pink-500/5 text-pink-300/50'}`}>{m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonGrid;
