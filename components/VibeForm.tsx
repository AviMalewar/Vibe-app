
import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { INTEREST_OPTIONS, MOVIE_GENRES } from '../constants';
import Button from './Button';

interface VibeFormProps {
  onSubmit: (profile: StudentProfile) => void;
  onCancel: () => void;
  onSwitchToLogin: () => void;
}

const VibeForm: React.FC<VibeFormProps> = ({ onSubmit, onCancel, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    name: '',
    branch: '',
    bio: '',
    interests: [],
    lifestyle: 'Night Owl',
    movieGenres: [],
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: StudentProfile = {
      ...formData as any,
      id: Math.random().toString(36).substr(2, 9),
      username: formData.name, // Display name acts as username
      password: formData.password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'default'}`,
      hobbies: formData.interests || [],
      year: 'Freshman',
      musicGenres: [],
      favoriteArtists: [],
      movieGenres: formData.movieGenres || [],
    };
    onSubmit(newProfile);
  };

  const toggleSelection = (field: 'interests' | 'movieGenres', val: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      const updated = current.includes(val) 
        ? current.filter(i => i !== val) 
        : [...current, val];
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="glass-card rounded-[32px] p-8 max-w-2xl mx-auto border border-white/10 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white">Join <span className="vibe-text-gradient">Wibe</span></h2>
        <button 
          onClick={onSwitchToLogin} 
          className="text-xs font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors"
        >
          Login to My Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/40 uppercase">Display Name</label>
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-white"
              placeholder="How should people call you?"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/40 uppercase">Branch / Major</label>
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-purple-500 transition-colors text-white"
              placeholder="e.g. Computer Science"
              value={formData.branch}
              onChange={e => setFormData({ ...formData, branch: e.target.value })}
            />
          </div>
        </div>

        {/* Account Security Section */}
        <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 space-y-4">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Account Security</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase">Create Password</label>
            <input 
              required
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors text-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-[10px] text-white/20 italic">This will be used to log back into your profile.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-white/40 uppercase">Bio</label>
          <textarea 
            required
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-purple-500 transition-colors resize-none text-white"
            placeholder="Tell us something fun about your vibe..."
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-white/40 uppercase block">Lifestyle</label>
          <div className="flex flex-wrap gap-3">
            {['Night Owl', 'Early Bird', 'Indoor', 'Outdoor'].map(type => (
              <button
                key={type}
                type="button"
                className={`px-6 py-2 rounded-full border-2 transition-all ${
                  formData.lifestyle === type ? 'border-purple-500 bg-purple-500/20' : 'border-white/5 hover:bg-white/5'
                }`}
                onClick={() => setFormData({ ...formData, lifestyle: type as any })}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-white/40 uppercase block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleSelection('interests', opt.label)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  formData.interests?.includes(opt.label) 
                    ? 'bg-indigo-600 border-indigo-400 text-white' 
                    : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-white/40 uppercase block">Favorite Movie Genres</label>
          <div className="flex flex-wrap gap-2">
            {MOVIE_GENRES.map(genre => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleSelection('movieGenres', genre)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  formData.movieGenres?.includes(genre) 
                    ? 'bg-pink-600 border-pink-400 text-white' 
                    : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button variant="secondary" className="flex-1" size="lg" type="submit">Create My Vibe Card</Button>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default VibeForm;
