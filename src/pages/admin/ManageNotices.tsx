import React, { useEffect, useState } from 'react';
import { 
  Megaphone, Plus, Search, Calendar, 
  Trash2, AlertCircle, Eye, ExternalLink,
  Filter, MoreHorizontal, Info
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNoticeStore } from '../../store/noticeStore';
import { useAuthStore } from '../../store/authStore';
import { PostNoticeModal } from '../../components/dashboard/PostNoticeModal';
import { formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ManageNotices = () => {
  const { user } = useAuthStore();
  const { notices, loading, fetchNotices, deleteNotice } = useNoticeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      try {
        await deleteNotice(id);
      } catch (error: any) {
        console.error('Deletion error:', error);
        if (error.message.includes('permission')) {
          alert('Error: You do not have permission to delete this notice. Only the author or an admin can delete it.');
        } else {
          alert('Failed to delete notice. Technical Error: ' + error.message);
        }
      }
    }
  };

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Notice Board Manager</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Create, update, and manage school-wide circulars</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Role</span>
            <span className="text-xs font-bold text-navy-900">{user?.role === 'admin' ? 'Super Admin' : 'Class Teacher'}</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => fetchNotices()}
            className="text-navy-900 border border-navy-100 rounded-xl"
          >
            Refresh List
          </Button>
          <Button 
            variant="primary" 
            className="shadow-lg shadow-navy-950/20"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} className="mr-2" /> Post New Notice
          </Button>
        </div>
      </div>

      {/* Stats and Search Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 p-4 flex flex-col md:flex-row gap-4 border-0 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search circulars by title or content..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="md:w-32 border-gray-200">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
        </Card>

        <Card className="p-6 bg-navy-900 border-0 shadow-xl group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Megaphone size={80} className="text-gold-400" />
           </div>
           <div className="relative z-10">
             <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gold-500 mb-1">Total Active</p>
             <div className="text-4xl font-extrabold text-white">{notices.length}</div>
             <p className="text-white/40 text-[10px] font-bold mt-2 uppercase tracking-widest">Digital Circulars</p>
           </div>
        </Card>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-3xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredNotices.map((notice) => (
              <motion.div
                key={notice.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  {notice.important && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-maroon-600" />
                  )}
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Date Block */}
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-navy-950 flex-shrink-0">
                      <span className="text-[10px] font-black uppercase text-gold-600 tracking-tighter">
                        {new Date(notice.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xl font-black leading-none">
                        {new Date(notice.date).getDate()}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={notice.category === 'Holiday' ? 'danger' : 'primary'} className="text-[10px] font-black uppercase">
                          {notice.category}
                        </Badge>
                        {notice.important && (
                          <Badge variant="maroon" className="animate-pulse">Urgent</Badge>
                        )}
                        {notice.authorId === user?.id && (
                          <Badge variant="gold" className="text-[10px] ring-1 ring-gold-400">Your Post</Badge>
                        )}
                        <span className="text-xs text-gray-400 font-bold flex items-center">
                          <Eye size={12} className="mr-1" /> {notice.target || 'All'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-950 mb-1 group-hover:text-gold-600 transition-colors truncate">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1 italic">
                         {notice.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-navy-900" title="View Details">
                        <Eye size={18} />
                      </Button>
                      
                      {/* Delete button logic: Admin can delete everything, Teacher can only delete their own */}
                      {(user?.role === 'admin' || (user?.role === 'teacher' && notice.authorId === user?.id)) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(notice.id)}
                          title="Delete Notice"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && filteredNotices.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-navy-900">No matching notices found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <PostNoticeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
