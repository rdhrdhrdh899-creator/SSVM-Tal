import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
      setLoading: (loading) => set({ loading }),
      login: async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Fetch additional role data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({ 
              user: { id: firebaseUser.uid, ...userData } as User, 
              isAuthenticated: true 
            });
            return true;
          }
          return false;
        } catch (error: any) {
          // Check if it's the first time login for a pre-registered user
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            // Find if there's a pre-registered user in Firestore
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const preRegDoc = querySnapshot.docs[0];
              const preRegData = preRegDoc.data();
              
              // Validate assigned password if present
              if (preRegData.assignedPassword === password) {
                // First time activation!
                try {
                  const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                  const newFirebaseUser = newUserCredential.user;
                  
                  const newUserData: any = {
                    ...preRegData,
                    id: newFirebaseUser.uid
                  };
                  delete newUserData.assignedPassword; // Don't keep it in the final profile
                  
                  await setDoc(doc(db, 'users', newFirebaseUser.uid), newUserData);
                  
                  // Delete old record
                  if (preRegDoc.id !== newFirebaseUser.uid) {
                    await deleteDoc(doc(db, 'users', preRegDoc.id));
                  }
                  
                  set({ user: newUserData as User, isAuthenticated: true });
                  return true;
                } catch (createErr) {
                  console.error('Activation error:', createErr);
                }
              }
            }
          }
          console.error('Login error:', error);
          return false;
        }
      },
      loginWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const firebaseUser = result.user;
          const isDevEmail = firebaseUser.email === 'rdhrdhrdh89.9@gmail.com';
          const isSuperAdminEmail = firebaseUser.email === 'rahuljitalphanta@gmail.com';
          
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!userDoc.exists()) {
            // Check if an admin pre-registered this teacher by email
            const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              // Pre-registered teacher found! Migrate their data to the UID-based document
              const preRegDoc = querySnapshot.docs[0];
              const preRegData = preRegDoc.data();
              
              const newUserData = {
                ...preRegData,
                photo: preRegData.photo || firebaseUser.photoURL || '',
                id: firebaseUser.uid
              };
              
              await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
              
              // Delete the old random-ID record if it's different from UID (which it should be)
              if (preRegDoc.id !== firebaseUser.uid) {
                await deleteDoc(doc(db, 'users', preRegDoc.id));
              }
              
              set({ user: newUserData as User, isAuthenticated: true });
            } else {
              // No pre-registration, create new student account (or admin for dev)
              const newUserData = {
                name: firebaseUser.displayName || 'Unknown User',
                email: firebaseUser.email || '',
                role: isSuperAdminEmail ? 'superadmin' : (isDevEmail ? 'admin' : 'student'),
                photo: firebaseUser.photoURL || '',
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
              set({ user: { id: firebaseUser.uid, ...newUserData } as User, isAuthenticated: true });
            }
          } else {
            const userData = userDoc.data() as User;
            // If the developer logged in before as student, upgrade them to admin
            if (isSuperAdminEmail && userData.role !== 'superadmin') {
              userData.role = 'superadmin';
              await setDoc(doc(db, 'users', firebaseUser.uid), { role: 'superadmin' }, { merge: true });
            } else if (isDevEmail && userData.role !== 'admin' && userData.role !== 'superadmin') {
              userData.role = 'admin';
              await setDoc(doc(db, 'users', firebaseUser.uid), { role: 'admin' }, { merge: true });
            }
            set({ user: { id: firebaseUser.uid, ...userData } as User, isAuthenticated: true });
          }
          return true;
        } catch (error: any) {
          console.error('Google Login error:', error);
          if (error.code === 'auth/popup-blocked') {
            alert('Popup was blocked by your browser. Please allow popups for this site.');
          }
          return false;
        }
      },
      sendPasswordReset: async (email) => {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (error) {
          console.error('Password reset error:', error);
          throw error;
        }
      },
      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: async (data) => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        
        try {
          await setDoc(doc(db, 'users', user.id), data, { merge: true });
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null
          }));
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },
    }),
    { 
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Auth listener initializer
export const initAuthListener = () => {
  const { setUser, setLoading } = useAuthStore.getState();
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
      } else {
        // Handle case where auth exists but no firestore doc (rare if we setDoc on sync)
        setLoading(false);
      }
    } else {
      setUser(null);
    }
  });
};
