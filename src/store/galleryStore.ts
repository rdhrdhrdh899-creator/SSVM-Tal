import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

export interface GalleryItem {
  id: string;
  url: string;
  description: string;
  category?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

interface GalleryState {
  items: GalleryItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (data: Omit<GalleryItem, 'id' | 'uploadedAt'>) => Promise<void>;
  updateItem: (id: string, data: Partial<GalleryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  items: [],
  loading: false,
  fetchItems: async () => {
    set({ loading: true });
    const path = 'gallery';
    try {
      const q = query(collection(db, path), orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
      set({ items: list, loading: false });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      set({ loading: false });
    }
  },
  addItem: async (data) => {
    const path = 'gallery';
    try {
      const uploadedAt = new Date().toISOString();
      const payload = { ...data, uploadedAt };
      const docRef = await addDoc(collection(db, path), payload);
      const newItem = { id: docRef.id, ...payload };
      set((state) => ({ 
        items: [newItem, ...state.items]
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  updateItem: async (id, data) => {
    const path = `gallery/${id}`;
    try {
      const itemRef = doc(db, 'gallery', id);
      await updateDoc(itemRef, data);
      set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...data } : item)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  deleteItem: async (id) => {
    const path = `gallery/${id}`;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      set((state) => ({
        items: state.items.filter(item => item.id !== id)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}));
