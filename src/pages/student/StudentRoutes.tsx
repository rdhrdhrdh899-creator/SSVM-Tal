import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, Wallet, 
  FileText, PenTool, Calendar, BookOpen, 
  Download, ShoppingBag, Settings 
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { StudentDashboard } from './StudentDashboard';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="heading-serif text-3xl font-black text-navy-950">{title}</h1>
    <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
      <p className="text-xl font-medium">Coming Soon</p>
    </div>
  </div>
);

export const StudentRoutes = () => {
  const navItems = [
    { label: 'Overview', href: '/student', icon: LayoutDashboard },
    { label: 'Academics', href: '/student/academics', icon: GraduationCap },
    { label: 'Fee Portal', href: '/student/fees', icon: Wallet },
    { label: 'E-Notes', href: '/student/notes', icon: FileText },
    { label: 'Homework', href: '/student/homework', icon: PenTool, badge: '3' },
    { label: 'Timetable', href: '/student/timetable', icon: Calendar },
    { label: 'Certificates', href: '/student/certificates', icon: Download },
    { label: 'School Shop', href: '/student/shop', icon: ShoppingBag },
    { label: 'Settings', href: '/student/settings', icon: Settings },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path="academics" element={<PlaceholderPage title="Academics & Grades" />} />
        <Route path="fees" element={<PlaceholderPage title="Fee Management" />} />
        <Route path="notes" element={<PlaceholderPage title="Download Notes" />} />
        <Route path="homework" element={<PlaceholderPage title="Homework Tracker" />} />
        <Route path="timetable" element={<PlaceholderPage title="My Timetable" />} />
        <Route path="certificates" element={<PlaceholderPage title="Certificates" />} />
        <Route path="shop" element={<PlaceholderPage title="Student Shop" />} />
        <Route path="settings" element={<PlaceholderPage title="Profile Settings" />} />
        <Route path="*" element={<Navigate to="/student" />} />
      </Routes>
    </DashboardLayout>
  );
};
