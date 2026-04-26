import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, CheckSquare, ClipboardList, 
  Upload, Calendar, Users, BarChart3, Settings, Megaphone
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { TeacherDashboard } from './TeacherDashboard';
import { ManageStudents } from './ManageStudents';
import { TeacherSettings } from './TeacherSettings';
import { Attendance } from './Attendance';
import { ManageAssignments } from './ManageAssignments';
import { ManageNotes } from './ManageNotes';
import { LeaveManager } from './LeaveManager';
import { ClassPerformance } from './ClassPerformance';
import { ManageNotices } from '../admin/ManageNotices';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="heading-serif text-3xl font-black text-navy-950">{title}</h1>
    <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
      <p className="text-xl font-medium">Coming Soon</p>
    </div>
  </div>
);

export const TeacherRoutes = () => {
  const navItems = [
    { label: 'Overview', href: '/teacher', icon: LayoutDashboard },
    { label: 'Attendance', href: '/teacher/attendance', icon: CheckSquare },
    { label: 'Assignments', href: '/teacher/assignments', icon: ClipboardList, badge: 'New' },
    { label: 'Study Materials', href: '/teacher/notes', icon: Upload },
    { label: 'Notices', href: '/teacher/notices', icon: Megaphone },
    { label: 'Leave Requests', href: '/teacher/leaves', icon: Calendar },
    { label: 'My Students', href: '/teacher/students', icon: Users },
    { label: 'Analytics', href: '/teacher/performance', icon: BarChart3 },
    { label: 'Settings', href: '/teacher/settings', icon: Settings },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<ManageAssignments />} />
        <Route path="notes" element={<ManageNotes />} />
        <Route path="notices" element={<ManageNotices />} />
        <Route path="leaves" element={<LeaveManager />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="performance" element={<ClassPerformance />} />
        <Route path="settings" element={<TeacherSettings />} />
        <Route path="*" element={<Navigate to="/teacher" />} />
      </Routes>
    </DashboardLayout>
  );
};
