
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { StudentProfile } from '../types';
import Button from './Button';

interface AdminPanelProps {
  students: StudentProfile[];
  onReset: () => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ students, onReset, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (dbService.verifyOwner(password)) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Owner Key');
    }
  };

  const handleReset = () => {
    if (window.confirm('Wipe all user records from the campus database?')) {
      dbService.resetDatabase(password);
      onReset();
      onClose();
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s record?`)) {
      dbService.deleteStudent(id);
      onReset(); // Refresh parent state
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 animate-in fade-in zoom-in duration-300">
        <div className="glass-card rounded-[32px] p-8 border border-white/10 text-center">
          <div className="w-16 h-16 vibe-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black">L</div>
          <h2 className="text-3xl font-black mb-2 text-white">Owner Access</h2>
          <p className="text-white/40 mb-8 text-sm uppercase tracking-widest font-bold">Permissions Required</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              placeholder="Enter Owner Key..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center outline-none focus:border-purple-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
            <Button type="submit" variant="primary" className="w-full">Unlock Dashboard</Button>
            <Button variant="ghost" onClick={onClose} className="w-full">Go Back</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white">Campus Backend</h2>
          <p className="text-indigo-400 font-bold uppercase tracking-tighter text-sm">Active Database Records: {students.length}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset} className="border-red-500/30 text-red-400 hover:bg-red-500/10 whitespace-nowrap">Factory Reset</Button>
          <Button variant="ghost" onClick={onClose}>Exit Panel</Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-[32px] p-6 border border-white/5 bg-white/5">
           <div className="grid grid-cols-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-4 mb-4">
             <span>Name</span>
             <span className="hidden sm:block">Branch</span>
             <span>Year</span>
             <span className="hidden lg:block">ID</span>
             <span className="text-right">Action</span>
           </div>
           <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
             {students.map(s => (
               <div key={s.id} className="grid grid-cols-5 items-center bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-colors text-sm">
                 <div className="flex items-center gap-3">
                    <img src={s.avatar} className="w-8 h-8 rounded-lg" alt="" />
                    <span className="font-bold text-white truncate">{s.name}</span>
                 </div>
                 <span className="text-white/60 truncate hidden sm:block">{s.branch}</span>
                 <span className="text-white/60">{s.year}</span>
                 <code className="text-[10px] text-indigo-400 font-mono opacity-50 truncate hidden lg:block">{s.id}</code>
                 <div className="text-right">
                    <button 
                      onClick={() => handleDelete(s.id, s.name)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
                      title="Delete Record"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        <div className="p-8 bg-black/40 border border-white/5 rounded-[32px]">
          <h3 className="text-xs font-black text-white/20 uppercase tracking-widest mb-4">Database Export (JSON)</h3>
          <pre className="text-[10px] text-green-400 font-mono bg-black/20 p-4 rounded-xl max-h-[200px] overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
            {JSON.stringify(students, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
