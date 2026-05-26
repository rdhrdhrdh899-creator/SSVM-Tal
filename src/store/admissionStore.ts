import { create } from 'zustand';
import { AdmissionApplication } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';

interface AdmissionState {
  applications: AdmissionApplication[];
  loading: boolean;
  submitApplication: (data: any) => Promise<void>;
  updateStatus: (id: string, status: AdmissionApplication['status']) => void;
  fetchApplications: () => Promise<void>;
}

export const useAdmissionStore = create<AdmissionState>((set) => ({
  applications: [],
  loading: false,
  fetchApplications: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'admissions'));
      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdmissionApplication));
      // Sort in memory or add index
      apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      set({ applications: apps });
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
        set({ loading: false });
    }
  },
  submitApplication: async (data) => {
    try {
      const newApplication = {
        studentName: data.studentName,
        applyingClass: data.applyingClass,
        date: new Date().toISOString(),
        parentName: data.fatherName || data.motherName || 'Not Provided',
        phone: data.phone || '',
        email: data.email || 'no-email@test.com',
        status: 'New',
        data,
      };
      
      const docRef = await addDoc(collection(db, 'admissions'), newApplication);
      
      set((state) => ({
        applications: [
          { id: docRef.id, ...newApplication } as AdmissionApplication,
          ...state.applications,
        ],
      }));
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },
  updateStatus: async (id, status) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const appRef = doc(db, 'admissions', id);
      await updateDoc(appRef, { status });
      
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? { ...app, status } : app
        ),
      }));
    } catch (error) {
      console.error('Error updating admission status:', error);
    }
  },
}));
