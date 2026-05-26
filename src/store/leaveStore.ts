import { create } from 'zustand';
import { 
  collection, addDoc, getDocs, query, where, 
  orderBy, updateDoc, doc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LeaveApplication {
  id: string;
  userId: string;
  userName: string;
  role: 'student' | 'teacher';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

interface LeaveState {
  leaves: LeaveApplication[];
  loading: boolean;
  fetchUserLeaves: (userId: string) => Promise<void>;
  fetchStudentLeavesForTeacher: (teacherClass: string) => Promise<void>;
  fetchAllLeaves: () => Promise<void>;
  applyLeave: (data: Omit<LeaveApplication, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;
}

export const useLeaveStore = create<LeaveState>((set) => ({
  leaves: [],
  loading: false,

  fetchAllLeaves: async () => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'leaves'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      set({ 
        leaves: snap.docs.map(d => ({ id: d.id, ...d.data() } as LeaveApplication)),
        loading: false 
      });
    } catch (error) {
      console.error("Error fetching all leaves:", error);
      set({ loading: false });
    }
  },

  fetchUserLeaves: async (userId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'leaves'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      set({ leaves: snap.docs.map(d => ({ id: d.id, ...d.data() } as LeaveApplication)) });
    } catch (error) {
      console.error("Error in fetchStudentLeavesForTeacher:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchStudentLeavesForTeacher: async (teacherClass) => {
    set({ loading: true });
    try {
      // Note: We need a way to filter student leaves by class. 
      // For now, fetching all 'student' role leaves and we can filter in component or improve schema.
      const q = query(
        collection(db, 'leaves'),
        where('role', '==', 'student'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      // In a real app, we'd have studentClass on the leave record
      set({ leaves: snap.docs.map(d => ({ id: d.id, ...d.data() } as LeaveApplication)) });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  applyLeave: async (data) => {
    await addDoc(collection(db, 'leaves'), {
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });
  },

  updateLeaveStatus: async (id, status) => {
    await updateDoc(doc(db, 'leaves', id), { status });
  }
}));
