
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import Button from './Button';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
  onSwitchToJoin: () => void;
  onCancel: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onSwitchToJoin, onCancel }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowRegisterPrompt(false);
    
    const user = dbService.login(name, password);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Account not found in the campus database.');
      setShowRegisterPrompt(true);
    }
  };

  return (
    <div className="glass-card rounded-[32px] p-8 max-w-md mx-auto border border-white/10 animate-in fade-in zoom-in duration-300 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 vibe-gradient rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-lg">W</div>
        <h2 className="text-3xl font-black text-white">Vibe Access</h2>
        <p className="text-white/40 text-sm mt-2">Enter your campus name and password</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Display Name</label>
          <input 
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500 transition-all placeholder:text-white/10"
            placeholder="e.g. Alex Chen"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Password</label>
          <input 
            required
            type="password"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-purple-500 transition-all placeholder:text-white/10"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="space-y-3">
            <p className="text-red-400 text-xs font-bold text-center px-4">{error}</p>
            {showRegisterPrompt && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                <p className="text-[10px] text-red-300 font-bold uppercase mb-2">New student?</p>
                <button 
                  type="button" 
                  onClick={onSwitchToJoin}
                  className="text-white font-black hover:underline"
                >
                  Create Your Vibe Card Now →
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 pt-4">
          <Button variant="primary" className="w-full" size="lg" type="submit">Unlock Profile</Button>
          <Button variant="ghost" className="w-full" onClick={onCancel} type="button">Go Back</Button>
        </div>
      </form>
    </div>
  );
};

export default LoginView;
