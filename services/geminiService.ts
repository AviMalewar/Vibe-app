
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, VibeMatch } from "../types";

export interface BatchMatchResult extends VibeMatch {
  targetProfileId: string;
}

export const analyzeVibe = async (
  profile1: StudentProfile,
  profile2: StudentProfile
): Promise<VibeMatch> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Compare these two student profiles for the 'Wibe' social app.
    
    Student 1:
    Name: ${profile1.name}
    Branch: ${profile1.branch}
    Lifestyle: ${profile1.lifestyle}
    Interests: ${profile1.interests.join(', ')}
    Music Genres: ${profile1.musicGenres.join(', ')}
    Favorite Artists: ${profile1.favoriteArtists.join(', ')}
    Movie Genres: ${profile1.movieGenres.join(', ')}
    Bio: ${profile1.bio}

    Student 2:
    Name: ${profile2.name}
    Branch: ${profile2.branch}
    Lifestyle: ${profile2.lifestyle}
    Interests: ${profile2.interests.join(', ')}
    Music Genres: ${profile2.musicGenres.join(', ')}
    Favorite Artists: ${profile2.favoriteArtists.join(', ')}
    Movie Genres: ${profile2.movieGenres.join(', ')}
    Bio: ${profile2.bio}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are 'WibeBot', a playful and witty social analyzer for college students. Evaluate the connection between two students based on their branch, lifestyle, interests, movies, and music. Use Gen-Z slang occasionally but keep it clean and friendly. Provide a vibe label based on the score (e.g., 0-40: 'Worth a Chat 🙂', 41-75: 'Cool Match 😎', 76-100: 'Same Vibe 🔥').",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            commonGround: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedActivity: { type: Type.STRING },
            vibeLabel: { type: Type.STRING }
          },
          required: ["score", "reasoning", "commonGround", "suggestedActivity", "vibeLabel"]
        }
      }
    });

    return JSON.parse(response.text) as VibeMatch;
  } catch (error) {
    console.error("Gemini Vibe Analysis Error:", error);
    throw new Error("Vibe check failed. The universe is too chaotic right now.");
  }
};

export const analyzeBatchVibes = async (
  newProfile: StudentProfile,
  existingProfiles: StudentProfile[]
): Promise<BatchMatchResult[]> => {
  if (existingProfiles.length === 0) return [];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const profilesData = existingProfiles.map(p => ({
    id: p.id,
    name: p.name,
    branch: p.branch,
    lifestyle: p.lifestyle,
    interests: p.interests,
    music: p.musicGenres,
    movies: p.movieGenres
  }));

  const prompt = `
    Analyze the 'Vibe Match' between a new student and a list of existing students.
    
    NEW STUDENT:
    Name: ${newProfile.name}
    Branch: ${newProfile.branch}
    Lifestyle: ${newProfile.lifestyle}
    Interests: ${newProfile.interests.join(', ')}
    Music: ${newProfile.musicGenres.join(', ')}
    Movies: ${newProfile.movieGenres.join(', ')}
    Bio: ${newProfile.bio}

    EXISTING STUDENTS TO COMPARE AGAINST:
    ${JSON.stringify(profilesData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are 'WibeBot'. Compare the NEW STUDENT to each student in the list. For each comparison, provide a score (0-100), a short witty reasoning, common ground items, a suggested activity, and a vibe label (🔥, 😎, 🙂). Return an array of results where each object includes the 'targetProfileId' from the input list.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              targetProfileId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              commonGround: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedActivity: { type: Type.STRING },
              vibeLabel: { type: Type.STRING }
            },
            required: ["targetProfileId", "score", "reasoning", "commonGround", "suggestedActivity", "vibeLabel"]
          }
        }
      }
    });

    return JSON.parse(response.text) as BatchMatchResult[];
  } catch (error) {
    console.error("Batch Analysis Error:", error);
    throw new Error("Failed to auto-match with existing profiles.");
  }
};
