
import React from 'react';
import { StudentProfile } from '../types';

interface ProfileCardProps {
  profile: StudentProfile;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isSelected, onSelect }) => {
  return (
    <div 
      className={`glass-card rounded-[32px] p-8 cursor-pointer transition-all duration-500 relative overflow-hidden group border-2 ${
        isSelected ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/20' : 'border-white/5 hover:border-white/20'
      }`}
      onClick={() => onSelect?.(profile.id)}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute top-0 right-0 p-4">
          <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping"></div>
        </div>
      )}

      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-20 h-20 rounded-[24px] object-cover border-2 border-white/10 transition-transform group-hover:scale-110"
          />
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
            {profile.lifestyle === 'Night Owl' ? '🦉' : profile.lifestyle === 'Early Bird' ? '☀️' : profile.lifestyle === 'Indoor' ? '🏠' : '🌳'}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white group-hover:vibe-text-gradient transition-all">{profile.name}</h3>
          <p className="text-sm text-indigo-400 font-bold">{profile.branch}</p>
          <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mt-1">{profile.year} Year</p>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">"{profile.bio}"</p>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Vibe Keywords</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 4).map((interest, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-white/5 rounded-xl text-[11px] font-bold text-white/70">
                {interest}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Pop 🍿</h4>
            <p className="text-[11px] font-bold text-white/60 truncate">{profile.movieGenres.slice(0, 2).join(', ')}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Mix 🎧</h4>
            <p className="text-[11px] font-bold text-white/60 truncate">{profile.musicGenres.slice(0, 2).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
