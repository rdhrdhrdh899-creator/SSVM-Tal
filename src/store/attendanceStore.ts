import { create } from 'zustand';
import { 
  collection, doc, setDoc, getDoc, getDocs, 
  query, where, orderBy, getDocFromServer,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AttendanceRecord } from '../types';

interface AttendanceState {
  attendanceData: AttendanceRecord | null;
  history: AttendanceRecord[];
  loading: boolean;
  historyLoading: boolean;
  
  fetchDailyAttendance: (className: string, date: string) => Promise<void>;
  fetchAttendanceHistory: (className: string) => Promise<void>;
  saveAttendance: (record: Omit<AttendanceRecord, 'id' | 'updatedAt'>) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendanceData: null,
  history: [],
  loading: false,
  historyLoading: false,

  fetchDailyAttendance: async (className, date) => {
    set({ loading: true });
    try {
      const docId = `${className}_${date}`;
      const docRef = doc(db, 'attendance', docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        set({ attendanceData: docSnap.data() as AttendanceRecord });
      } else {
        set({ attendanceData: null });
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchAttendanceHistory: async (className) => {
    set({ historyLoading: true });
    try {
      const q = query(
        collection(db, 'attendance'),
        where('class', '==', className),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => doc.data() as AttendanceRecord);
      set({ history });
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      set({ historyLoading: false });
    }
  },

  saveAttendance: async (record) => {
    try {
      const docId = `${record.class}_${record.date}`;
      const docRef = doc(db, 'attendance', docId);
      const data = {
        ...record,
        id: docId,
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, data, { merge: true });
      set({ attendanceData: data as AttendanceRecord });
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  }
}));
