export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'superadmin';
  photo?: string;
  class?: string;
  section?: string;
  subject?: string;
  dob?: string;
  parentContact?: string;
  address?: string;
  phone?: string;
  teacherSettings?: {
    bio?: string;
    phoneVisibility: boolean;
    notifications: {
      studentQueries: boolean;
      leaveRequests: boolean;
      newNotices: boolean;
    };
    attendanceReminderTime: string;
    theme: 'light' | 'dark';
    dashboardOrder: string[];
    autoGrading: boolean;
    lessonPlanTemplate: string;
    securityQuestion?: string;
    securityAnswer?: string;
  };
  [key: string]: any;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Holiday' | 'Exam' | 'Event' | 'Circular' | 'Urgent';
  content: string;
  date: string;
  important: boolean;
  target: string | string[];
  expiryDate: string;
  authorId?: string;
  authorRole?: string;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  applyingClass: string;
  date: string;
  parentName: string;
  phone: string;
  email: string;
  status: 'New' | 'Reviewed' | 'Interview' | 'Accepted' | 'Rejected';
  data: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Sports' | 'Academic' | 'Arts' | 'Competition' | 'School';
  date: string;
  image?: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  tags?: string[];
}

export interface SystemSettings {
  id: string;
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  activeSession: string;
  maintenanceMode: boolean;
  whatsappNumber: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  logoUrl?: string;
  principal?: {
    name: string;
    designation: string;
    photo: string;
    message: string;
  };
  emergencyAlert?: {
    message: string;
    active: boolean;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  subscription?: {
    status: 'Active' | 'Inactive' | 'Trial';
    expiryDate: string;
    plan: 'Basic' | 'Premium' | 'Enterprise';
    masterToggle: boolean;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  class: string;
  records: {
    [studentId: string]: 'P' | 'A' | 'L';
  };
  updatedAt: string;
  updatedBy: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'Cultural' | 'Academic' | 'PTM' | 'Sports' | 'Other';
  image?: string;
  registrationLink?: string;
}
