import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Achievement } from '../types';
export { type Achievement };

interface AchievementState {
  achievements: Achievement[];
  loading: boolean;
  fetchAchievements: () => Promise<void>;
  addAchievement: (data: Omit<Achievement, 'id'>) => Promise<void>;
  updateAchievement: (id: string, data: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  loading: false,
  fetchAchievements: async () => {
    set({ loading: true });
    try {
      const snapshot = await getDocs(collection(db, 'achievements'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      set({ achievements: list, loading: false });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      set({ loading: false });
    }
  },
  addAchievement: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'achievements'), data);
      const newAchievement = { id: docRef.id, ...data };
      set((state) => ({ 
        achievements: [newAchievement, ...state.achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }));
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  },
  updateAchievement: async (id, data) => {
    try {
      const achievementRef = doc(db, 'achievements', id);
      await updateDoc(achievementRef, data);
      set((state) => ({
        achievements: state.achievements.map(a => a.id === id ? { ...a, ...data } : a)
      }));
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  },
  deleteAchievement: async (id) => {
    try {
      await deleteDoc(doc(db, 'achievements', id));
      set((state) => ({
        achievements: state.achievements.filter(a => a.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  }
}));
