import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Filter, 
  MoreVertical, Mail, Phone, Calendar,
  CheckCircle, XCircle, Clock, Eye,
  ArrowRight, User, Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmissionStore } from '../../store/admissionStore';
import { AdmissionApplication } from '../../types';

export const ManageAdmissions = () => {
  const { applications, loading, fetchApplications, updateStatus } = useAdmissionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<AdmissionApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredLeads = applications.filter(lead => {
    const matchesSearch = 
      lead.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'gold';
      case 'Reviewed': return 'primary';
      case 'Interview': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'danger';
      default: return 'primary';
    }
  };

  const handleUpdateStatus = async (id: string, status: AdmissionApplication['status']) => {
    await updateStatus(id, status);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Admission Leads</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Review and process new student inquiries and applications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border-0 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by student, parent or email..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['All', 'New', 'Reviewed', 'Interview', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === status 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Leads List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedLead(lead)}
                className={`cursor-pointer group transition-all ${selectedLead?.id === lead.id ? 'z-10 relative' : ''}`}
              >
                <Card className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-0 shadow-sm transition-all hover:shadow-md ${selectedLead?.id === lead.id ? 'ring-2 ring-gold-400 shadow-xl' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-gold-500 shadow-sm border border-gray-100 flex-shrink-0 ${lead.status === 'New' ? 'bg-gold-50' : 'bg-gray-50'}`}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-950">{lead.studentName}</h3>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        <span>Grade {lead.applyingClass}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {new Date(lead.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex flex-col items-end">
                      <Badge variant={getStatusColor(lead.status) as any}>{lead.status}</Badge>
                    </div>
                    <ArrowRight size={18} className={`text-gray-300 group-hover:text-navy-900 transition-colors ${selectedLead?.id === lead.id ? 'text-navy-900 translate-x-1' : ''}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLeads.length === 0 && !loading && (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <FileText size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">No admission leads found</p>
            </div>
          )}
        </div>

        {/* Lead Details Pane */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedLead ? (
              <motion.div
                key={selectedLead.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="sticky top-8"
              >
                <Card className="p-8 border-0 shadow-xl bg-navy-950 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <Badge variant="gold" className="bg-gold-500 text-navy-950 border-0">ADMISSION FILE</Badge>
                      <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                        <XCircle size={24} />
                      </button>
                    </div>

                    <h2 className="heading-serif text-3xl font-black mb-1">{selectedLead.studentName}</h2>
                    <p className="text-gold-400 font-bold tracking-widest uppercase text-xs mb-8">Candidate for Grade {selectedLead.applyingClass}</p>

                    <div className="space-y-6 mb-10">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Parent/Guardian</p>
                        <p className="font-bold flex items-center gap-2"><User size={14} className="text-gold-500" /> {selectedLead.parentName}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Details</p>
                        <p className="font-bold flex items-center gap-2 mb-2"><Mail size={14} className="text-gold-500" /> {selectedLead.email}</p>
                        <p className="font-bold flex items-center gap-2"><Phone size={14} className="text-gold-500" /> {selectedLead.phone}</p>
                      </div>
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Processing Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Reviewed')}
                      >
                        <CheckCircle size={14} className="mr-2 text-emerald-400" /> Mark Review
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Interview')}
                      >
                        <Clock size={14} className="mr-2 text-gold-400" /> Interview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-navy-800 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Accepted')}
                      >
                        <CheckCircle size={14} className="mr-2" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-navy-800 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Rejected')}
                      >
                        <XCircle size={14} className="mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                <Eye size={48} className="mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest text-[10px]">Preview Panel</p>
                <p className="text-sm mt-2">Select a lead to view full application details and take actions</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
