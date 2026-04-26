import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Admissions } from './pages/public/Admissions';
import { Gallery } from './pages/public/Gallery';
import { Contact } from './pages/public/Contact';
import { Achievements } from './pages/public/Achievements';
import { Events } from './pages/public/Events';
import { Notices } from './pages/public/Notices';
import { Login } from './pages/auth/Login';
import { Blog } from './pages/public/Blog';
import { BlogPostDetail } from './pages/public/BlogPostDetail';
import { PrincipalMessagePage } from './pages/public/PrincipalMessagePage';
import { PublicNavbar } from './components/public/PublicNavbar';
import { Footer } from './components/public/Footer';
import { WhatsAppWidget } from './components/public/WhatsAppWidget';
import { EmergencyBanner } from './components/public/EmergencyBanner';
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { useAuthStore, initAuthListener } from './store/authStore';
import { useSettingsStore, initSettingsListener } from './store/settingsStore';
import { AdminRoutes } from './pages/admin/AdminRoutes';
import { StudentRoutes } from './pages/student/StudentRoutes';
import { TeacherRoutes } from './pages/teacher/TeacherRoutes';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { isAuthenticated, user, loading } = useAuthStore();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  const { settings, fetchSettings } = useSettingsStore();

  React.useEffect(() => {
    const unsubAuth = initAuthListener();
    const unsubSettings = initSettingsListener();
    fetchSettings();
    
    return () => {
      if (unsubAuth) unsubAuth();
      if (unsubSettings) unsubSettings();
    };
  }, [fetchSettings]);

  // Apply Dynamic Theme Colors
  React.useEffect(() => {
    if (settings) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor || '#001F3F');
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor || '#FFD700');
    }
  }, [settings]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();
  
  // Force scroll to top on every route change
  React.useEffect(() => {
    // Immediate reset
    window.scrollTo(0, 0);
    
    // Backup reset after a small delay to handle AnimatePresence transitions
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' } as any);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isDashboard = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/student') || 
                      location.pathname.startsWith('/superadmin') || 
                      location.pathname.startsWith('/teacher');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <EmergencyBanner />}
      {!isDashboard && <PublicNavbar />}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/principal-message" element={<PrincipalMessagePage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard Routes */}
            <Route path="/superadmin/*" element={
              <ProtectedRoute role="superadmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/*" element={
              <ProtectedRoute role="admin">
                <AdminRoutes />
              </ProtectedRoute>
            } />

            <Route path="/student/*" element={
              <ProtectedRoute role="student">
                <StudentRoutes />
              </ProtectedRoute>
            } />

            <Route path="/teacher/*" element={
              <ProtectedRoute role="teacher">
                <TeacherRoutes />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </div>
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppWidget />}
    </div>
  );
};
