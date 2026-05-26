import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, GraduationCap, LayoutDashboard, 
  Megaphone, FileText, Wallet, Library, CreditCard, 
  Calendar, Bell, ShoppingBag, Settings, LogOut, Menu, X, ChevronLeft 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { NotificationPopover } from './NotificationPopover';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export const DashboardLayout = ({ children, navItems }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const SidebarContent = () => (
    <div 
      className="h-full flex flex-col text-white overflow-y-auto"
      style={{ backgroundColor: settings?.primaryColor || '#001F3F' }}
    >
      {/* Brand */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-950 shadow-lg"
            style={{ backgroundColor: settings?.secondaryColor || '#FFD700' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="heading-serif font-bold text-sm tracking-tight text-white leading-none uppercase">
                {settings?.schoolName || 'APEX VIDYA'}
              </span>
              <span 
                className="text-[9px] uppercase tracking-widest font-bold"
                style={{ color: settings?.secondaryColor || '#FFD700' }}
              >
                Portal v2.0
              </span>
            </motion.div>
          )}
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:block text-white/40 hover:text-white"
        >
          <ChevronLeft size={20} className={cn('transition-transform duration-300', !isSidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Nav Link Section */}
      <div className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center space-x-4 p-3 rounded-xl transition-all group relative',
              location.pathname === item.href 
                ? 'bg-gold-500 text-navy-950 font-bold shadow-lg shadow-gold-500/20' 
                : 'text-cream-50/60 hover:bg-white/5 hover:text-white'
            )}
          >
            <div className={cn('flex-shrink-0 transition-transform group-hover:scale-110', location.pathname === item.href && 'text-navy-950')}>
              <item.icon size={22} />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm tracking-wide"
              >
                {item.label}
              </motion.span>
            )}
            {item.badge && isSidebarOpen && (
              <div className="absolute right-3">
                <Badge variant="maroon" className="bg-maroon-500 text-white border-0 px-1.5 py-0.5 text-[9px]">{item.badge}</Badge>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className={cn('flex items-center p-2 rounded-2xl bg-white/5 border border-white/5', !isSidebarOpen && 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-navy-800 border-2 border-gold-400 p-0.5 overflow-hidden">
            <img src={user?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="user" />
          </div>
          {isSidebarOpen && (
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{user?.role}</p>
            </div>
          )}
          {isSidebarOpen && (
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-white/40 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      <Modal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        title="Confirm Logout"
        size="sm"
      >
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <LogOut size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-950">Are you sure?</h3>
            <p className="text-sm text-gray-500 mt-2">You will be logged out of your session. Any unsaved progress may be lost.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
             <Button variant="ghost" onClick={() => setShowLogoutConfirm(false)}>Stay Here</Button>
             <Button variant="danger" onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Yes, Logout</Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          'hidden lg:block h-screen sticky top-0 transition-all duration-300 z-50',
          isSidebarOpen ? 'w-64' : 'w-24'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute top-0 left-0 bottom-0 w-64 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-navy-900 bg-gray-100 rounded-lg hover:bg-gold-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="ml-4 heading-serif font-bold text-navy-900">Dashboard</span>
          </div>

          <div className="hidden lg:block">
            <span className="heading-serif font-bold text-navy-900">Portal Control Center</span>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationPopover />
            <div className="h-8 border-l border-gray-200 mx-1" />
            <div className="flex items-center space-x-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-navy-800 border border-gold-400 p-0.5 overflow-hidden">
                <img src={user?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="user" />
              </div>
              <span className="text-sm font-bold text-navy-900 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Page wrapper */}
        <main className="p-6 md:p-8 xl:p-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
              onAnimationStart={() => window.scrollTo(0, 0)}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
