
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface VibeMeterProps {
  score: number;
}

const VibeMeter: React.FC<VibeMeterProps> = ({ score }) => {
  // Random data generation for the radar chart based on score to make it look "data-y"
  const data = [
    { subject: 'Academic', A: 50 + (score * 0.4), fullMark: 100 },
    { subject: 'Social', A: 40 + (score * 0.5), fullMark: 100 },
    { subject: 'Music', A: 30 + (score * 0.6), fullMark: 100 },
    { subject: 'Hobbies', A: 45 + (score * 0.45), fullMark: 100 },
    { subject: 'Future', A: 55 + (score * 0.35), fullMark: 100 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 vibe-gradient opacity-10 blur-3xl rounded-full"></div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <span className="text-6xl font-black vibe-text-gradient">{score}%</span>
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Match Score</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#ffffff15" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10 }} />
          <Radar
            name="Vibe"
            dataKey="A"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VibeMeter;
