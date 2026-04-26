import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { SCHOOL_NAME } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../lib/utils';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Curriculum', path: '/curriculum' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'glass-nav py-2 mt-4 mx-4 md:mx-8 md:mt-6 rounded-xl md:rounded-full border border-gold-400/20 shadow-2xl' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center border-2 border-gold-400 shadow-lg" style={{ borderColor: settings?.secondaryColor }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" style={{ color: settings?.secondaryColor }}>
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className={`heading-serif block leading-none font-bold text-lg uppercase ${scrolled ? 'text-navy-950' : 'text-white'}`}>{settings?.schoolName || SCHOOL_NAME}</span>
            <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold font-sans" style={{ color: settings?.secondaryColor }}>Sr. Sec. School</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-1 lg:space-x-0.5 xl:space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-2 xl:px-4 py-2 text-[13px] xl:text-sm font-medium transition-colors hover:text-gold-500 group ${location.pathname === link.path ? 'text-gold-500' : scrolled ? 'text-navy-900' : 'text-white/90'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="activeLink"
                  className="absolute bottom-0 left-2 right-2 xl:left-4 xl:right-4 h-0.5 bg-gold-400 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2 xl:space-x-3">
          {isAuthenticated ? (
            <Link to={`/${user?.role}`}>
              <Button 
                variant="primary" 
                size="sm" 
                className={`rounded-full px-4 xl:px-6 flex items-center gap-2 shadow-lg transition-all active:scale-95`}
              >
                <LayoutDashboard size={16} />
                <span>My Dashboard</span>
                {user?.name && (
                  <span className="ml-2 pl-2 border-l border-white/20 text-[10px] opacity-70 truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className={`rounded-full px-4 xl:px-5 transition-colors ${scrolled ? 'border-navy-800 text-navy-800' : 'border-white/30 text-white hover:bg-white/10'}`}>Portal Login</Button>
              </Link>
              <Link to="/admissions">
                <Button variant="emerald" size="sm" className="rounded-full px-4 xl:px-6 flex items-center group">
                  Apply Now
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-navy-900 hover:bg-gold-50' : 'text-white hover:bg-white/10'}`}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 ${scrolled ? 'top-[85px]' : 'top-[80px]'} bg-white z-40 lg:hidden p-6 overflow-y-auto`}
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between text-lg font-semibold p-4 rounded-xl transition-colors ${location.pathname === link.path ? 'bg-gold-50 text-gold-600' : 'text-navy-900 hover:bg-gray-50'}`}
                >
                  {link.name}
                  <ChevronRight size={20} className={location.pathname === link.path ? 'text-gold-500' : 'text-gray-300'} />
                </Link>
              ))}
              <div className="pt-6">
                {isAuthenticated ? (
                  <Link to={`/${user?.role}`} onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full rounded-xl flex items-center justify-center gap-2">
                       <LayoutDashboard size={18} />
                       My Dashboard ({user?.name})
                    </Button>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">Portal Login</Button>
                    </Link>
                    <Link to="/admissions" onClick={() => setIsOpen(false)}>
                      <Button variant="emerald" className="w-full rounded-xl">Apply Now</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
