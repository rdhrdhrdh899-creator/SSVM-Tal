import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, 
  MoreVertical, Mail, Phone, BookOpen,
  GraduationCap, Trash2, Edit2, ShieldCheck, Lock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useTeacherStore } from '../../store/teacherStore';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { AddTeacherModal } from '../../components/dashboard/AddTeacherModal';
import { SubscriptionGuard } from '../../components/ui/SubscriptionGuard';

export const ManageTeachers = () => {
  const { teachers, loading, fetchTeachers, deleteTeacher } = useTeacherStore();
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubsGuardOpen, setIsSubsGuardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Subscription Logic
  const isSuperAdmin = user?.role === 'superadmin';
  const subStatus = settings?.subscription?.status;
  const expiryDate = settings?.subscription?.expiryDate ? new Date(settings.subscription.expiryDate) : null;
  const masterToggle = settings?.subscription?.masterToggle !== false;
  const isSubActive = subStatus === 'Active' || subStatus === 'Trial';
  const isExpired = expiryDate ? expiryDate < new Date() : false;
  
  const isLocked = !isSuperAdmin && (!isSubActive || isExpired || !masterToggle);

  const handleAction = (callback: () => void) => {
    if (isLocked) {
      setIsSubsGuardOpen(true);
    } else {
      callback();
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the faculty list?`)) {
      try {
        await deleteTeacher(id);
      } catch (error) {
        alert('Failed to delete teacher');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Faculty Management</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Manage teaching staff and department assignments</p>
        </div>
        <Button 
          variant="primary" 
          className="shadow-lg shadow-navy-800/20"
          onClick={() => handleAction(() => setIsAddModalOpen(true))}
        >
          {isLocked ? <Lock size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
          Add New Teacher
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border-0 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, subject or email..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-white border-gray-200 text-xs font-bold uppercase tracking-widest hidden md:flex">
            <Filter size={14} className="mr-2" /> Filters
          </Button>
        </div>
      </Card>

      {/* Teachers Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-100 rounded-[2rem] h-64" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="p-6 h-full group hover:shadow-xl transition-all border-0 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-navy-950 transition-colors"
                      onClick={() => handleAction(() => {})}
                    >
                      {isLocked ? <Lock size={14} className="text-red-400" /> : <Edit2 size={14} />}
                    </button>
                    <button 
                      className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => handleAction(() => handleDelete(teacher.id, teacher.name))}
                    >
                      {isLocked ? <Lock size={14} className="text-red-400" /> : <Trash2 size={14} />}
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center text-gold-400 border-2 border-white shadow-md overflow-hidden flex-shrink-0">
                      {teacher.photo ? (
                        <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap size={32} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-navy-950 truncate pr-14">{teacher.name}</h3>
                      <p className="text-sm font-bold text-gold-600 flex items-center">
                        <BookOpen size={14} className="mr-1" /> {teacher.subject || 'N/A'}
                      </p>
                      {teacher.class && (
                        <p className="text-[10px] font-black text-navy-400 bg-navy-50 px-2 py-0.5 rounded-lg border border-navy-100 inline-block mt-1 uppercase tracking-widest leading-none">
                          Class: {teacher.class}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <Mail size={14} className="mr-2 text-navy-400" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <Phone size={14} className="mr-2 text-navy-400" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <Badge variant="primary" className="text-[10px] uppercase font-black">
                      <ShieldCheck size={12} className="mr-1" /> ID: {teacher.id.slice(0, 8)}
                    </Badge>
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                       ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTeachers.length === 0 && !loading && (
            <div className="col-span-full py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <Users size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">No teachers found matching your search</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-navy-800"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      )}

      <AddTeacherModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <SubscriptionGuard 
        isOpen={isSubsGuardOpen} 
        onClose={() => setIsSubsGuardOpen(false)}
        schoolName={settings?.schoolName || 'St. Xavier International School'}
      />
    </div>
  );
};
