import { create } from 'zustand';
import { Notice } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';

interface NoticeState {
  notices: Notice[];
  loading: boolean;
  addNotice: (notice: any) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  toggleImportant: (id: string) => void;
  fetchNotices: () => Promise<void>;
}

export const useNoticeStore = create<NoticeState>((set) => ({
  notices: [],
  loading: false,
  fetchNotices: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'notices'));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice));
      docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      set({ notices: docs });
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      set({ loading: false });
    }
  },
  addNotice: async (notice) => {
    try {
      const docRef = await addDoc(collection(db, 'notices'), notice);
      set((state) => ({ notices: [{ id: docRef.id, ...notice } as Notice, ...state.notices] }));
    } catch (error) {
      console.error('Error adding notice:', error);
      throw error;
    }
  },
  deleteNotice: async (id) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
      set((state) => ({ notices: state.notices.filter((n) => n.id !== id) }));
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  },
  toggleImportant: (id) =>
    set((state) => ({
      notices: state.notices.map((n) => (n.id === id ? { ...n, important: !n.important } : n)),
    })),
}));
