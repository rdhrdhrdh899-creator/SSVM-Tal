import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, 
  Megaphone, FileText, Wallet, Library, CreditCard, 
  Calendar, Bell, ShoppingBag, Settings, PenTool,
  Image as ImageIcon, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { AdminDashboard } from './AdminDashboard';
import { ManageTeachers } from './ManageTeachers';
import { ManageNotices } from './ManageNotices';
import { ManageAdmissions } from './ManageAdmissions';
import { ManageAchievements } from './ManageAchievements';
import { ManageLeaves } from './ManageLeaves';
import { ManageGallery } from './ManageGallery';
import { ManageEvents } from './ManageEvents';
import { ManageSlider } from './ManageSlider';
import { ManageBlog } from './ManageBlog';
import { SystemSettings } from './SystemSettings';

// Mock sub-page component
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="heading-serif text-3xl font-black text-navy-950">{title}</h1>
    <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
      <PenTool size={48} className="mb-4 opacity-20" />
      <p className="text-xl font-medium">Page Module Under Development</p>
      <p className="text-sm mt-2">Check back in the next iteration for full CRUD operations.</p>
    </div>
  </div>
);

export const AdminRoutes = () => {
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    ...(useAuthStore.getState().user?.role === 'superadmin' ? [{ label: 'Super Admin', href: '/superadmin', icon: ShieldCheck }] : []),
    { label: 'Students', href: '/admin/students', icon: Users, badge: '2.8k' },
    { label: 'Teachers', href: '/admin/teachers', icon: GraduationCap, badge: '124' },
    { label: 'Notices', href: '/admin/notices', icon: Megaphone },
    { label: 'Admissions', href: '/admin/admissions', icon: FileText, badge: '12' },
    { label: 'Achievements', href: '/admin/achievements', icon: GraduationCap },
    { label: 'Leaves', href: '/admin/leaves', icon: Calendar },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Events', href: '/admin/events', icon: Calendar },
    { label: 'Blog', href: '/admin/blog', icon: PenTool },
    { label: 'Home Slider', href: '/admin/slider', icon: ImageIcon },
    { label: 'Fees', href: '/admin/fees', icon: Wallet },
    { label: 'Library', href: '/admin/library', icon: Library },
    { label: 'ID Cards', href: '/admin/idcards', icon: CreditCard },
    { label: 'Timetable', href: '/admin/timetable', icon: Calendar },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'School Shop', href: '/admin/shop', icon: ShoppingBag },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<PlaceholderPage title="Manage Students" />} />
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="notices" element={<ManageNotices />} />
        <Route path="admissions" element={<ManageAdmissions />} />
        <Route path="achievements" element={<ManageAchievements />} />
        <Route path="leaves" element={<ManageLeaves />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="blog" element={<ManageBlog />} />
        <Route path="slider" element={<ManageSlider />} />
        <Route path="fees" element={<PlaceholderPage title="Fee Management" />} />
        <Route path="library" element={<PlaceholderPage title="Library Management" />} />
        <Route path="idcards" element={<PlaceholderPage title="ID Card Generator" />} />
        <Route path="timetable" element={<PlaceholderPage title="Timetable Builder" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notification Sender" />} />
        <Route path="shop" element={<PlaceholderPage title="Shop Management" />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </DashboardLayout>
  );
};
