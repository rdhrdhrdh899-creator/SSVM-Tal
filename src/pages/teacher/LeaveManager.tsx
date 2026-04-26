import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, FileText, CheckCircle, XCircle, 
  Clock, Plus, Search, User, Filter,
  ArrowRight, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { useLeaveStore, LeaveApplication } from '../../store/leaveStore';
import { cn } from '../../lib/utils';

export const LeaveManager = () => {
  const { user } = useAuthStore();
  const { 
    leaves, loading, fetchUserLeaves, 
    fetchStudentLeavesForTeacher, applyLeave, updateLeaveStatus 
  } = useLeaveStore();

  const [view, setView] = useState<'my-leaves' | 'student-requests'>('student-requests');
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    if (user?.id) {
       if (view === 'my-leaves') fetchUserLeaves(user.id);
       else fetchStudentLeavesForTeacher(user.class || '');
    }
  }, [user, view]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    await applyLeave({
      ...formData,
      userId: user?.id || '',
      userName: user?.name || '',
      role: 'teacher'
    });
    setShowApply(false);
    fetchUserLeaves(user?.id || '');
    setFormData({ startDate: '', endDate: '', reason: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Leave Management</h1>
          <p className="text-gray-500 font-medium tracking-tight">Review student leave requests and apply for your chhutti</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-navy-50 p-1 rounded-2xl border border-navy-100">
              <button 
                onClick={() => setView('student-requests')}
                className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all", view === 'student-requests' ? "bg-navy-900 text-white shadow-lg" : "text-navy-400 hover:text-navy-900")}
              >Student Requests</button>
              <button 
                onClick={() => setView('my-leaves')}
                className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all", view === 'my-leaves' ? "bg-navy-900 text-white shadow-lg" : "text-navy-400 hover:text-navy-900")}
              >My chhutti</button>
           </div>
           {view === 'my-leaves' && (
              <Button variant="primary" onClick={() => setShowApply(true)}>
                 <Plus size={18} className="mr-2" /> Apply Leave
              </Button>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Summary Stats */}
         <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 bg-gradient-to-br from-navy-900 to-navy-950 text-white border-0 shadow-2xl">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="text-gold-400" size={20} />
                  Leave Overview
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                     <p className="text-2xl font-black">{leaves.filter(l => l.status === 'Approved').length}</p>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Approved</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                     <p className="text-2xl font-black">{leaves.filter(l => l.status === 'Pending').length}</p>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Pending</p>
                  </div>
               </div>
               {view === 'student-requests' && (
                  <div className="mt-8 p-4 bg-gold-400/10 rounded-2xl border border-gold-400/20">
                     <p className="text-xs font-bold text-gold-400 flex items-center gap-2">
                        <Clock size={14} /> Attention required
                     </p>
                     <p className="text-[11px] text-gray-300 mt-2">You have {leaves.filter(l => l.status === 'Pending').length} student leave requests waiting for your approval.</p>
                  </div>
               )}
            </Card>
         </div>

         {/* List View */}
         <div className="lg:col-span-2 space-y-4">
            {loading ? (
               <div className="py-20 text-center text-gray-400 font-bold">Checking leave records...</div>
            ) : leaves.length === 0 ? (
               <Card className="p-20 text-center border-dashed border-2">
                  <p className="text-gray-400 font-bold">No leave applications found</p>
               </Card>
            ) : (
               leaves.map(leave => (
                  <Card key={leave.id} className="p-6 transition-all hover:shadow-md border-0 shadow-sm group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-all">
                              <User size={24} />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-black text-navy-950 text-lg">{leave.userName}</h4>
                                 <Badge className={cn("text-[10px] font-black tracking-widest uppercase border", getStatusColor(leave.status))}>
                                    {leave.status}
                                 </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                 <span className="flex items-center gap-1"><Calendar size={14} /> {leave.startDate}</span>
                                 <ArrowRight size={14} />
                                 <span className="flex items-center gap-1">{leave.endDate}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex-1 max-w-sm">
                           <p className="text-xs font-medium text-gray-500 italic">" {leave.reason} "</p>
                        </div>

                        {view === 'student-requests' && leave.status === 'Pending' && (
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                              >
                                 <XCircle size={20} />
                              </button>
                              <button 
                                onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                                className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                              >
                                 <CheckCircle size={20} />
                              </button>
                           </div>
                        )}
                     </div>
                  </Card>
               ))
            )}
         </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="heading-serif text-2xl font-bold text-navy-900">Apply for chhutti</h3>
                <button onClick={() => setShowApply(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                     label="Start Date" 
                     type="date"
                     required
                     value={formData.startDate}
                     onChange={e => setFormData({...formData, startDate: e.target.value})}
                   />
                   <Input 
                     label="End Date" 
                     type="date"
                     required
                     value={formData.endDate}
                     onChange={e => setFormData({...formData, endDate: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Reason for Leave</label>
                   <textarea 
                     className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-navy-100"
                     placeholder="Why do you need leave?"
                     value={formData.reason}
                     onChange={e => setFormData({...formData, reason: e.target.value})}
                     required
                   />
                </div>
                <div className="flex gap-4 pt-4">
                   <Button variant="outline" className="flex-1" onClick={() => setShowApply(false)}>Cancel</Button>
                   <Button variant="primary" className="flex-1" type="submit">Send Application</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
