import { create } from 'zustand';
import { 
  collection, addDoc, getDocs, query, where, 
  orderBy, updateDoc, deleteDoc, doc, Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
  subject: string;
  teacherId: string;
  attachments: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  status: 'Submitted' | 'Graded' | 'Pending';
  marks?: number;
  remarks?: string;
  fileUrl?: string;
  submittedAt: string;
}

interface AssignmentState {
  assignments: Assignment[];
  loading: boolean;
  createAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  fetchAssignments: (teacherId: string) => Promise<void>;
  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  fetchSubmissions: (assignmentId: string) => Promise<Submission[]>;
  gradeSubmission: (submissionId: string, marks: number, remarks: string) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  loading: false,

  fetchAssignments: async (teacherId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'assignments'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      set({ assignments: snap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment)) });
    } catch (error) {
      console.error("Error in fetchAssignments:", error);
    } finally {
      set({ loading: false });
    }
  },

  createAssignment: async (data) => {
    await addDoc(collection(db, 'assignments'), {
      ...data,
      createdAt: new Date().toISOString()
    });
  },

  updateAssignment: async (id, data) => {
    await updateDoc(doc(db, 'assignments', id), data);
  },

  deleteAssignment: async (id) => {
    await deleteDoc(doc(db, 'assignments', id));
  },

  fetchSubmissions: async (assignmentId) => {
    const q = query(collection(db, 'submissions'), where('assignmentId', '==', assignmentId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission));
  },

  gradeSubmission: async (submissionId, marks, remarks) => {
    await updateDoc(doc(db, 'submissions', submissionId), {
      marks,
      remarks,
      status: 'Graded'
    });
  }
}));
