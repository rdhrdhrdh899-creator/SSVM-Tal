import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, CheckCircle, XCircle, Search, 
  Filter, User, FileText, ArrowRight, X, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useLeaveStore, LeaveApplication } from '../../store/leaveStore';

export const ManageLeaves = () => {
  const { leaves, loading, fetchAllLeaves, updateLeaveStatus } = useLeaveStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'teacher' | 'student'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);

  useEffect(() => {
    fetchAllLeaves();
  }, [fetchAllLeaves]);

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'All' || leave.role === filterRole;
    const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'primary';
    }
  };

  const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await updateLeaveStatus(id, status);
      // Update local state if needed or re-fetch
      await fetchAllLeaves();
      if (selectedLeave?.id === id) {
        setSelectedLeave(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Leave Management</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Review and process leave applications from staff and students</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or reason..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 border-0 rounded-xl text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="All">All Roles</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 border-0 rounded-xl text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredLeaves.map((leave) => (
              <motion.div
                key={leave.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedLeave(leave)}
                className={`cursor-pointer transition-all ${selectedLeave?.id === leave.id ? 'z-10 relative' : ''}`}
              >
                <Card className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-0 shadow-sm hover:shadow-md transition-all ${selectedLeave?.id === leave.id ? 'ring-2 ring-gold-400 shadow-xl' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0 ${leave.role === 'teacher' ? 'bg-navy-50 text-navy-600' : 'bg-gold-50 text-gold-600'}`}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-950">{leave.userName}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-500 py-0 px-2 h-auto text-[8px]">{leave.role}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {new Date(leave.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant={getStatusColor(leave.status) as any}>{leave.status}</Badge>
                    <ArrowRight size={18} className={`text-gray-300 transition-colors ${selectedLeave?.id === leave.id ? 'text-navy-900 translate-x-1' : ''}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLeaves.length === 0 && !loading && (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <FileText size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">No leave applications found</p>
            </div>
          )}
        </div>

        {/* Details Pane */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedLeave ? (
              <motion.div
                key={selectedLeave.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="sticky top-8"
              >
                <Card className="p-8 border-0 shadow-xl bg-navy-950 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Calendar size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <Badge variant="gold" className="bg-gold-500 text-navy-950 border-0 uppercase tracking-[0.2em] text-[10px] py-1 px-3">Leave Request</Badge>
                      <button onClick={() => setSelectedLeave(null)} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                      </button>
                    </div>

                    <h2 className="heading-serif text-3xl font-black mb-1">{selectedLeave.userName}</h2>
                    <p className="text-gold-400 font-bold tracking-widest uppercase text-[10px] mb-8">{selectedLeave.role} Administration</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</p>
                        <p className="font-bold flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-gold-500" />
                          {new Date(selectedLeave.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To</p>
                        <p className="font-bold flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-gold-500" />
                          {new Date(selectedLeave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <AlertCircle size={12} /> Reason for Leave
                      </p>
                      <p className="text-sm font-medium leading-relaxed italic text-gray-300">
                        "{selectedLeave.reason}"
                      </p>
                    </div>

                    {selectedLeave.status === 'Pending' && (
                      <div className="flex gap-4">
                        <Button 
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/40"
                          onClick={() => handleAction(selectedLeave.id, 'Approved')}
                        >
                          <CheckCircle size={18} className="mr-2" /> Approve
                        </Button>
                        <Button 
                          variant="ghost"
                          className="flex-1 bg-white/5 hover:bg-red-600/20 text-red-400 border border-red-500/30 font-bold rounded-2xl"
                          onClick={() => handleAction(selectedLeave.id, 'Rejected')}
                        >
                          <XCircle size={18} className="mr-2" /> Reject
                        </Button>
                      </div>
                    )}

                    {selectedLeave.status !== 'Pending' && (
                      <div className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs ${
                        selectedLeave.status === 'Approved' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {selectedLeave.status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        Request {selectedLeave.status}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                <Clock size={48} className="mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest text-[10px]">Review Panel</p>
                <p className="text-sm mt-2">Select a leave request to view full details and process the application</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
