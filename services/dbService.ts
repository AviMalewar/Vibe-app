
import { StudentProfile } from '../types';
import { MOCK_STUDENTS } from '../constants';

const STORAGE_KEY = 'wibe_cloud_db_v1';
const SESSION_KEY = 'wibe_active_session';
const OWNER_KEY = 'wibe-admin';

export const dbService = {
  getStudents: (): StudentProfile[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return MOCK_STUDENTS;
    try {
      const userStudents: StudentProfile[] = JSON.parse(saved);
      // Don't expose passwords in the list
      const sanitizedUsers = userStudents.map(({ password, ...rest }) => rest as StudentProfile);
      const mockIds = MOCK_STUDENTS.map(s => s.id);
      const filteredUsers = sanitizedUsers.filter(s => !mockIds.includes(s.id));
      return [...filteredUsers, ...MOCK_STUDENTS];
    } catch (e) {
      return MOCK_STUDENTS;
    }
  },

  saveStudent: (profile: StudentProfile): void => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let userOnly: StudentProfile[] = [];
    if (saved) {
      try { userOnly = JSON.parse(saved); } catch (e) { userOnly = []; }
    }
    const updated = [profile, ...userOnly];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(SESSION_KEY, profile.id);
  },

  login: (name: string, password: string): StudentProfile | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
      const users: StudentProfile[] = JSON.parse(saved);
      // Match by username (display name) and secret password
      const user = users.find(u => 
        (u.username === name || u.name === name) && 
        (u.password === password || u.branch === password) // Backward compatibility with branch-as-password
      );
      if (user) {
        localStorage.setItem(SESSION_KEY, user.id);
        return user;
      }
    } catch (e) { return null; }
    return null;
  },

  getActiveUser: (): StudentProfile | null => {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
      const users: StudentProfile[] = JSON.parse(saved);
      return users.find(u => u.id === userId) || null;
    } catch (e) { return null; }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  deleteStudent: (id: string): void => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const userStudents: StudentProfile[] = JSON.parse(saved);
      const updated = userStudents.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (localStorage.getItem(SESSION_KEY) === id) {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
  },

  resetDatabase: (key: string): boolean => {
    if (key === OWNER_KEY) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
      return true;
    }
    return false;
  },

  verifyOwner: (key: string): boolean => key === OWNER_KEY
};
