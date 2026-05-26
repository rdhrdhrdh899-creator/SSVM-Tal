import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

interface StudentState {
  students: User[];
  loading: boolean;
  fetchClassStudents: (teacherClass: string) => Promise<void>;
  addStudent: (studentData: Omit<User, 'id'>) => Promise<void>;
  updateStudent: (id: string, data: Partial<User>) => Promise<void>;
  deleteStudent: (id: string, teacherClass: string) => Promise<void>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  loading: false,
  fetchClassStudents: async (teacherClass) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'users'), 
        where('role', '==', 'student'),
        where('class', '==', teacherClass)
      );
      const querySnapshot = await getDocs(q);
      const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      set({ students, loading: false });
    } catch (error) {
      console.error('Error fetching class students:', error);
      set({ loading: false });
    }
  },
  addStudent: async (studentData) => {
    try {
      await addDoc(collection(db, 'users'), {
        ...studentData,
        role: 'student',
        createdAt: serverTimestamp(),
      });
      // After adding, we might need to refresh the list elsewhere
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },
  updateStudent: async (id, data) => {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
  deleteStudent: async (id, teacherClass) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      await get().fetchClassStudents(teacherClass);
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
}));
