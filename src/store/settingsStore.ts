import { create } from 'zustand';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SystemSettings } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

interface SettingsState {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: Omit<SystemSettings, 'id'> = {
  schoolName: 'St. Xavier International School',
  schoolAddress: 'Main Street, Sector 12, City Center, PIN-123456',
  schoolPhone: '+91 98765 43210',
  schoolEmail: 'contact@stxavier.edu.in',
  activeSession: '2024-25',
  maintenanceMode: false,
  whatsappNumber: '919876543210',
  primaryColor: '#001F3F',
  secondaryColor: '#FFD700',
  welcomeMessage: 'Welcome to our digital school portal. Stay updated with the latest notices and academic resources.',
  principal: {
    name: 'Dr. Sarah Mitchell',
    designation: 'Principal',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop',
    message: 'Welcome to our school. We believe in nurturing young minds to become future leaders with values and excellence.'
  },
  emergencyAlert: {
    message: '',
    active: false,
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
  },
  subscription: {
    status: 'Trial',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
    plan: 'Basic',
    masterToggle: true,
  }
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,
  error: null,

  fetchSettings: async () => {
    set({ loading: true });
    const path = 'settings/config';
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'config'));
      if (settingsDoc.exists()) {
        set({ settings: { id: 'config', ...settingsDoc.data() } as SystemSettings, loading: false });
      } else {
        // Initialize with defaults if not exists
        await setDoc(doc(db, 'settings', 'config'), DEFAULT_SETTINGS);
        set({ settings: { id: 'config', ...DEFAULT_SETTINGS } as SystemSettings, loading: false });
      }
    } catch (error: any) {
      handleFirestoreError(error, OperationType.GET, path);
      set({ error: error.message, loading: false });
    }
  },

  updateSettings: async (newSettings) => {
    const path = 'settings/config';
    try {
      await setDoc(doc(db, 'settings', 'config'), newSettings, { merge: true });
      // State will be updated by local merge if we want immediate UI feedback
      set((state) => ({
        settings: state.settings ? { ...state.settings, ...newSettings } : null
      }));
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },
}));

// Setup listener for real-time updates across all instances
export const initSettingsListener = () => {
  const path = 'settings/config';
  return onSnapshot(
    doc(db, 'settings', 'config'), 
    (doc) => {
      if (doc.exists()) {
        useSettingsStore.setState({ settings: { id: 'config', ...doc.data() } as SystemSettings, loading: false });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      useSettingsStore.setState({ error: error.message, loading: false });
    }
  );
};
