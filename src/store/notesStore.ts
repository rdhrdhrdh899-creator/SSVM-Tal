import { create } from 'zustand';
import { 
  collection, addDoc, getDocs, query, where, 
  orderBy, updateDoc, deleteDoc, doc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  class: string;
  type: 'pdf' | 'link' | 'video';
  url: string;
  teacherId: string;
  isHidden: boolean;
  createdAt: string;
}

interface NotesState {
  materials: StudyMaterial[];
  loading: boolean;
  fetchMaterials: (teacherId: string) => Promise<void>;
  addMaterial: (data: Omit<StudyMaterial, 'id' | 'createdAt'>) => Promise<void>;
  updateMaterial: (id: string, data: Partial<StudyMaterial>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set) => ({
  materials: [],
  loading: false,

  fetchMaterials: async (teacherId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'studyMaterials'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      set({ materials: snap.docs.map(d => ({ id: d.id, ...d.data() } as StudyMaterial)) });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  addMaterial: async (data) => {
    await addDoc(collection(db, 'studyMaterials'), {
      ...data,
      createdAt: new Date().toISOString()
    });
  },

  updateMaterial: async (id, data) => {
    await updateDoc(doc(db, 'studyMaterials', id), data);
  },

  deleteMaterial: async (id) => {
    await deleteDoc(doc(db, 'studyMaterials', id));
  }
}));
