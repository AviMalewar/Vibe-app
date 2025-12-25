
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StudentProfile, MatchState, ViewState } from './types';
import { analyzeVibe, analyzeBatchVibes, BatchMatchResult } from './services/geminiService';
import { dbService } from './services/dbService';
import Button from './components/Button';
import ProfileCard from './components/ProfileCard';
import VibeMeter from './components/VibeMeter';
import VibeForm from './components/VibeForm';
import AdminPanel from './components/AdminPanel';
import LoginView from './components/LoginView';
import ComparisonGrid from './components/ComparisonGrid';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchResults, setBatchResults] = useState<BatchMatchResult[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<StudentProfile | null>(null);
  const [matchState, setMatchState] = useState<MatchState>({
    isAnalyzing: false,
    matchResult: null,
    error: null,
  });

  // Load initial data and check session
  const refreshData = useCallback(() => {
    setStudents(dbService.getStudents());
    const sessionUser = dbService.getActiveUser();
    if (sessionUser) setCurrentUserProfile(sessionUser);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const selectedProfiles = useMemo(() => {
    return selectedIds.map(id => students.find(s => s.id === id)).filter(Boolean) as StudentProfile[];
  }, [selectedIds, students]);

  const sortedBatchResults = useMemo(() => {
    return [...batchResults].sort((a, b) => b.score - a.score);
  }, [batchResults]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const isComparing = view === 'compare' || view === 'comparisonGrid';
      const limit = isComparing ? 4 : 2;
      
      if (prev.includes(id)) return prev.filter(pId => pId !== id);
      if (prev.length >= limit) return [...prev.slice(1), id];
      return [...prev, id];
    });
    setMatchState(prev => ({ ...prev, matchResult: null, error: null }));
  }, [view]);

  const handleVibeCheck = async () => {
    if (selectedProfiles.length !== 2) return;
    setMatchState({ isAnalyzing: true, matchResult: null, error: null });
    try {
      const result = await analyzeVibe(selectedProfiles[0], selectedProfiles[1]);
      setMatchState({ isAnalyzing: false, matchResult: result, error: null });
      setView('matchResult');
    } catch (err: any) {
      setMatchState({ isAnalyzing: false, matchResult: null, error: err.message });
    }
  };

  const handleProfileSubmit = async (newProfile: StudentProfile) => {
    dbService.saveStudent(newProfile);
    refreshData();
    setCurrentUserProfile(newProfile);
    
    setMatchState({ isAnalyzing: true, matchResult: null, error: null });
    setView('autoMatchResults');

    try {
      const results = await analyzeBatchVibes(newProfile, students);
      setBatchResults(results);
      setMatchState({ isAnalyzing: false, matchResult: null, error: null });
    } catch (err: any) {
      setMatchState({ isAnalyzing: false, matchResult: null, error: err.message });
    }
  };

  const handleLoginSuccess = (user: StudentProfile) => {
    setCurrentUserProfile(user);
    setView('myProfile');
  };

  const handleLogout = () => {
    dbService.logout();
    setCurrentUserProfile(null);
    setView('home');
  };

  const handleRemoveFromComparison = (id: string) => {
    setSelectedIds(prev => prev.filter(pId => pId !== id));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/30 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-900/20 blur-[150px] rounded-full"></div>
      </div>

      <nav className="sticky top-0 z-50 px-6 py-4 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 rounded-xl vibe-gradient flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-purple-500/20">W</div>
            <span className="text-2xl font-black tracking-tighter text-white">wibe</span>
          </div>
          <div className="flex gap-6 items-center">
            <button onClick={() => setView('discover')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === 'discover' ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}>Discover</button>
            <button onClick={() => setView('compare')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${view === 'compare' ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}>Compare</button>
            {currentUserProfile ? (
              <button onClick={() => setView('myProfile')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all">
                <img src={currentUserProfile.avatar} className="w-6 h-6 rounded-lg" alt="" />
                <span className="text-sm font-bold text-white">My Profile</span>
              </button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setView('form')}>Join Wibe</Button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {view === 'home' && (
          <section className="text-center py-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter">FIND YOUR <br/><span className="vibe-text-gradient">CAMPUS VIBE.</span></h1>
            <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12">The ultimate student social system. Match with peers based on shared interests, music, and movie taste. ✌️</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={() => setView('form')} className="w-full sm:w-auto">Start Matching</Button>
              <Button size="lg" variant="outline" onClick={() => setView('discover')} className="w-full sm:w-auto">Browse Students</Button>
            </div>
          </section>
        )}

        {view === 'login' && (
          <LoginView 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToJoin={() => setView('form')}
            onCancel={() => setView('home')}
          />
        )}

        {view === 'form' && (
          <VibeForm 
            onSubmit={handleProfileSubmit} 
            onCancel={() => setView('home')}
            onSwitchToLogin={() => setView('login')}
          />
        )}

        {view === 'myProfile' && currentUserProfile && (
          <section className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h2 className="text-5xl font-black text-white">My Vibe Card</h2>
                <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm mt-2">Active Session: {currentUserProfile.username}</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
                <Button variant="secondary" onClick={() => setView('discover')}>Find Matches</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-5 gap-12">
              <div className="md:col-span-2">
                <ProfileCard profile={currentUserProfile} isSelected={false} />
              </div>
              <div className="md:col-span-3 space-y-8">
                 <div className="glass-card rounded-[32px] p-8 border border-white/10 bg-indigo-500/5">
                    <h3 className="text-xl font-black text-white mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <p className="text-3xl font-black vibe-text-gradient">0</p>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Vibe Checks</p>
                      </div>
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <p className="text-3xl font-black text-white">Fresh</p>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Account Status</p>
                      </div>
                    </div>
                 </div>
                 <div className="p-8 bg-purple-500/10 border border-purple-500/20 rounded-[32px]">
                    <p className="text-purple-300 font-medium italic">"You're all set! Use the Compare tool to see how your vibe stacks up against other students on campus."</p>
                 </div>
              </div>
            </div>
          </section>
        )}

        {view === 'admin' && <AdminPanel students={students} onReset={refreshData} onClose={() => setView('home')} />}
        
        {view === 'comparisonGrid' && (
          <ComparisonGrid 
            profiles={selectedProfiles} 
            onClose={() => setView('compare')} 
            onRemove={handleRemoveFromComparison}
          />
        )}

        {view === 'autoMatchResults' && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-4">Your Vibe Dashboard 🚀</h2>
              <p className="text-white/50 max-w-2xl">We've analyzed your profile against all students on campus.</p>
            </div>
            {matchState.isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-8">
                <div className="w-24 h-24 rounded-full vibe-gradient animate-ping opacity-20"></div>
                <h3 className="text-2xl font-bold text-white italic">Scanning frequencies...</h3>
              </div>
            ) : (
              <div className="space-y-12">
                {sortedBatchResults.length > 0 && (
                  <div className="vibe-gradient p-1 rounded-[40px]">
                    <div className="bg-[#030712]/90 rounded-[39px] p-8 md:p-12 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8"><span className="bg-purple-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Best Match 🔥</span></div>
                      <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                          <h3 className="text-5xl font-black mb-6">Absolute Synergy!</h3>
                          <p className="text-xl text-gray-300 italic mb-8 leading-relaxed">"{sortedBatchResults[0].reasoning}"</p>
                          <Button variant="primary" size="lg">Start Conversation</Button>
                        </div>
                        <VibeMeter score={sortedBatchResults[0].score} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedBatchResults.slice(1).map((match) => {
                    const profile = students.find(s => s.id === match.targetProfileId);
                    if (!profile) return null;
                    return (
                      <div key={match.targetProfileId} className="glass-card rounded-[32px] p-6 border border-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <img src={profile.avatar} className="w-12 h-12 rounded-xl" alt="" />
                          <div>
                            <h4 className="font-bold text-white">{profile.name}</h4>
                            <p className="text-xs text-white/40">{match.score}% - {match.vibeLabel}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">View Match</Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'matchResult' && matchState.matchResult && selectedProfiles.length === 2 && (
          <section className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
             <div className="text-center mb-12">
                <h2 className="text-5xl font-black text-white mb-2">{matchState.matchResult.vibeLabel} Connection</h2>
                <p className="text-white/40 uppercase tracking-widest font-black text-sm">AI Vibe Analysis Complete</p>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div className="space-y-6">
                   <div className="glass-card rounded-[32px] p-8 border-l-4 border-l-purple-500">
                      <h3 className="text-xl font-black text-white mb-4">Analysis</h3>
                      <p className="text-gray-300 leading-relaxed italic">"{matchState.matchResult.reasoning}"</p>
                   </div>
                   <div className="glass-card rounded-[32px] p-8">
                      <h3 className="text-sm font-black text-white/30 uppercase tracking-widest mb-4">Suggested Activity</h3>
                      <p className="text-2xl font-black vibe-text-gradient">{matchState.matchResult.suggestedActivity}</p>
                   </div>
                </div>
                <VibeMeter score={matchState.matchResult.score} />
             </div>

             <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setView('compare')}>Back to Selection</Button>
                <Button variant="secondary" size="lg">Send a Wave 👋</Button>
             </div>
          </section>
        )}

        {(view === 'discover' || view === 'compare') && (
          <section className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black text-white mb-2">{view === 'compare' ? 'Vibe Comparison' : 'Meet Your Peers'}</h2>
                <p className="text-white/40 font-medium">
                  {view === 'compare' 
                    ? `Select up to 4 students for Side-by-Side, or 2 for AI analysis. (${selectedIds.length}/4)` 
                    : 'Explore students vibing on campus.'}
                </p>
              </div>
              <div className="flex gap-4">
                {view === 'compare' && selectedIds.length >= 2 && (
                  <>
                    <Button variant="outline" size="lg" onClick={() => setView('comparisonGrid')}>View Side-by-Side</Button>
                    {selectedIds.length === 2 && (
                      <Button variant="secondary" size="lg" onClick={handleVibeCheck} isLoading={matchState.isAnalyzing}>AI Vibe Check 🔥</Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{students.map(student => <ProfileCard key={student.id} profile={student} isSelected={selectedIds.includes(student.id)} onSelect={handleSelect} />)}</div>
          </section>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-white/5 text-center">
        <button onClick={() => setView('admin')} className="text-[10px] font-black uppercase tracking-widest text-white/10 hover:text-white/40 transition-colors">Owner Access</button>
      </footer>
    </div>
  );
};

export default App;
