import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Megaphone, CheckCircle2, AlertCircle, X, ExternalLink, MessageSquare } from 'lucide-react';
import { useNoticeStore } from '../../store/noticeStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notices, fetchNotices } = useNoticeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotices();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fetchNotices]);

  // Filter notices based on user role
  const relevantNotices = notices.filter(n => {
    if (user?.role === 'admin') return true;
    if (n.target === 'All') return true;
    if (user?.role === 'student' && n.target?.includes('Students')) return true;
    if (user?.role === 'teacher' && n.target?.includes('Teachers')) return true;
    return false;
  }).slice(0, 5).map(n => ({ ...n, type: 'notice' }));

  // Add dummy Student Queries if user is teacher and preference is ON
  const queryAlerts = (user?.role === 'teacher' && user?.teacherSettings?.notifications?.studentQueries) 
    ? [
        {
          id: 'q1',
          type: 'query',
          title: 'New Student Query',
          content: 'Rahul from Class 11-A sent a question about electromagnetism.',
          category: 'Query',
          date: new Date().toISOString(),
          important: true
        }
      ]
    : [];

  const allNotifications = [...queryAlerts, ...relevantNotices].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const unreadCount = allNotifications.length;

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 border border-gray-100 rounded-xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-navy-900 text-gold-400 border-navy-900' : 'bg-gray-50 text-gray-500 hover:bg-gold-50 hover:text-gold-600'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-navy-900">
              <div className="flex items-center space-x-2">
                <Bell size={18} className="text-gold-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Notifications</h3>
              </div>
              <Badge variant="gold" className="text-[10px]">{unreadCount} New</Badge>
            </div>

            {/* List */}
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
              {allNotifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {allNotifications.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setIsOpen(false);
                        if (item.type === 'query') {
                          navigate('/teacher/students');
                        } else {
                          if (user?.role === 'admin') navigate('/admin/notices');
                          else if (user?.role === 'teacher') navigate('/teacher/notices');
                          else navigate('/notices');
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                          item.type === 'query' ? 'bg-blue-50 text-blue-600' :
                          item.important ? 'bg-red-50 text-red-600' : 'bg-gold-50 text-gold-600'
                        }`}>
                          {item.type === 'query' ? <MessageSquare size={18} /> : <Megaphone size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-black uppercase ${
                              item.type === 'query' ? 'text-blue-500' :
                              item.important ? 'text-red-500' : 'text-navy-400'
                            }`}>
                              {item.category}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {formatDate(item.date)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-navy-950 truncate group-hover:text-gold-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 italic">
                            {item.content.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-gray-200" />
                  </div>
                  <h4 className="text-navy-900 font-bold">You're all caught up!</h4>
                  <p className="text-gray-400 text-xs mt-1">No new notifications at the moment.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (user?.role === 'admin') navigate('/admin/notices');
                  else if (user?.role === 'teacher') navigate('/teacher/notices');
                  else navigate('/notices');
                }}
                className="w-full py-2 text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center justify-center gap-2 transition-colors"
              >
                See All Circulars <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
