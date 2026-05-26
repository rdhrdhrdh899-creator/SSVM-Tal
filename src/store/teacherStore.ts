import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

interface TeacherState {
  teachers: User[];
  loading: boolean;
  fetchTeachers: () => Promise<void>;
  addTeacher: (teacher: Omit<User, 'id'>) => Promise<void>;
  updateTeacher: (id: string, data: Partial<User>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: [],
  loading: false,
  fetchTeachers: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'teacher'));
      const querySnapshot = await getDocs(q);
      const teachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      set({ teachers, loading: false });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      set({ loading: false });
    }
  },
  addTeacher: async (teacherData) => {
    try {
      await addDoc(collection(db, 'users'), {
        ...teacherData,
        role: 'teacher',
        createdAt: serverTimestamp(),
      });
      await get().fetchTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
      throw error;
    }
  },
  updateTeacher: async (id, data) => {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, data);
      await get().fetchTeachers();
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },
  deleteTeacher: async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      await get().fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  },
}));
