import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { BlogPost } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  addPost: (data: Omit<BlogPost, 'id'>) => Promise<void>;
  updatePost: (id: string, data: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  loading: false,
  fetchPosts: async () => {
    set({ loading: true });
    const path = 'blog_posts';
    try {
      const q = query(collection(db, path), orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      set({ posts: list, loading: false });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      set({ loading: false });
    }
  },
  addPost: async (data) => {
    const path = 'blog_posts';
    try {
      const docRef = await addDoc(collection(db, path), data);
      const newPost = { id: docRef.id, ...data };
      set((state) => ({ 
        posts: [newPost, ...state.posts]
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  updatePost: async (id, data) => {
    const path = `blog_posts/${id}`;
    try {
      const postRef = doc(db, 'blog_posts', id);
      await updateDoc(postRef, data);
      set((state) => ({
        posts: state.posts.map(post => post.id === id ? { ...post, ...data } : post)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  deletePost: async (id) => {
    const path = `blog_posts/${id}`;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
      set((state) => ({
        posts: state.posts.filter(post => post.id !== id)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}));
