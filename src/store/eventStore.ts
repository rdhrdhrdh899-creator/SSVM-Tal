import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query } from 'firebase/firestore';
import { SchoolEvent } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

interface EventState {
  events: SchoolEvent[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  addEvent: (data: Omit<SchoolEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, data: Partial<SchoolEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  loading: false,
  fetchEvents: async () => {
    set({ loading: true });
    const path = 'events';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SchoolEvent));
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      set({ events: list, loading: false });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      set({ loading: false });
    }
  },
  addEvent: async (data) => {
    const path = 'events';
    try {
      const docRef = await addDoc(collection(db, path), data);
      const newEvent = { id: docRef.id, ...data };
      set((state) => ({ 
        events: [...state.events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  updateEvent: async (id, data) => {
    const path = `events/${id}`;
    try {
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, data);
      set((state) => ({
        events: state.events.map(event => event.id === id ? { ...event, ...data } : event)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  deleteEvent: async (id) => {
    const path = `events/${id}`;
    try {
      await deleteDoc(doc(db, 'events', id));
      set((state) => ({
        events: state.events.filter(event => event.id !== id)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}));
