
export interface StudentProfile {
  id: string;
  username?: string; // For login
  password?: string; // For login
  name: string;
  branch: string;
  year: string;
  bio: string;
  interests: string[];
  hobbies: string[];
  musicGenres: string[];
  favoriteArtists: string[];
  movieGenres: string[];
  lifestyle: 'Night Owl' | 'Early Bird' | 'Indoor' | 'Outdoor';
  avatar: string;
}

export interface VibeMatch {
  score: number;
  reasoning: string;
  commonGround: string[];
  suggestedActivity: string;
  vibeLabel: string; // 🔥 Same Vibe, 😎 Cool Match, 🙂 Worth a Chat
}

export interface MatchState {
  isAnalyzing: boolean;
  matchResult: VibeMatch | null;
  error: string | null;
}

export type ViewState = 'home' | 'form' | 'login' | 'discover' | 'compare' | 'comparisonGrid' | 'matchResult' | 'autoMatchResults' | 'admin' | 'myProfile';
