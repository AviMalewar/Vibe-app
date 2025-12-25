
import { StudentProfile } from './types';

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: '1',
    name: 'Alex Chen',
    branch: 'Computer Science',
    year: 'Junior',
    bio: 'Late night coder, early morning coffee addict. Always down for a hackathon or a hike. 💻☕️',
    interests: ['AI', 'Cybersecurity', 'Sustainable Tech'],
    hobbies: ['Rock Climbing', 'Photography', 'Gaming'],
    musicGenres: ['Lofi', 'Synthwave', 'Indie Rock'],
    favoriteArtists: ['The Midnight', 'Tame Impala'],
    movieGenres: ['Sci-Fi', 'Documentary', 'Thriller'],
    lifestyle: 'Night Owl',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: '2',
    name: 'Sarah Miller',
    branch: 'Fine Arts',
    year: 'Senior',
    bio: 'Painter exploring the intersection of digital and physical art. Loves rainy days. 🎨🌧️',
    interests: ['Illustration', 'UI/UX Design', 'Art History'],
    hobbies: ['Painting', 'Yoga', 'Baking'],
    musicGenres: ['Dream Pop', 'Classical', 'Jazz'],
    favoriteArtists: ['Beach House', 'Lana Del Rey'],
    movieGenres: ['Drama', 'Animation', 'Romance'],
    lifestyle: 'Early Bird',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: '3',
    name: 'Jordan Smith',
    branch: 'Business Admin',
    year: 'Sophomore',
    bio: 'Aspiring entrepreneur. Always networking and looking for the next big idea. 🚀📈',
    interests: ['Finance', 'Marketing', 'Blockchain'],
    hobbies: ['Golf', 'Traveling', 'Reading'],
    musicGenres: ['Hiphop', 'Top 40', 'Deep House'],
    favoriteArtists: ['Drake', 'Fisher'],
    movieGenres: ['Action', 'Comedy', 'Biopic'],
    lifestyle: 'Indoor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan'
  },
  {
    id: '4',
    name: 'Maya Patel',
    branch: 'Biology',
    year: 'Freshman',
    bio: 'Pre-med student with a passion for marine biology. I collect shells. 🐚🧬',
    interests: ['Genetics', 'Enviro Science', 'Oceanography'],
    hobbies: ['Scuba Diving', 'Sketching', 'Gardening'],
    musicGenres: ['Folk', 'Ambient', 'Alternative'],
    favoriteArtists: ['Bon Iver', 'Phoebe Bridgers'],
    movieGenres: ['Horror', 'Mystery', 'Fantasy'],
    lifestyle: 'Outdoor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya'
  },
  {
    id: '5',
    name: 'Leo Rodriguez',
    branch: 'Music Production',
    year: 'Junior',
    bio: 'Sound engineer in the making. If I am not in the studio, I am at a gig. 🎸🎧',
    interests: ['Audio Engineering', 'Live Mixing', 'Composition'],
    hobbies: ['Guitar', 'Concert Hopping', 'Vinyls'],
    musicGenres: ['Psych Rock', 'Techno', 'Blues'],
    favoriteArtists: ['Pink Floyd', 'Charlotte de Witte'],
    movieGenres: ['Musical', 'Cult Classics', 'Action'],
    lifestyle: 'Night Owl',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo'
  }
];

export const INTEREST_OPTIONS = [
  { id: 'gaming', label: 'Gaming 🎮' },
  { id: 'music', label: 'Music 🎵' },
  { id: 'movies', label: 'Movies 🍿' },
  { id: 'sports', label: 'Sports ⚽️' },
  { id: 'travel', label: 'Travel ✈️' },
  { id: 'coding', label: 'Coding 💻' },
  { id: 'art', label: 'Art 🎨' },
  { id: 'reading', label: 'Reading 📚' },
];

export const MOVIE_GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Animation', 'Thriller'];
export const MUSIC_GENRES = ['Pop', 'Rock', 'Hiphop', 'Jazz', 'Electronic', 'Classical', 'Indie', 'Country'];
