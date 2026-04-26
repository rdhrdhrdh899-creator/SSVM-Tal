import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Users, FileText, 
  Trash2, Edit2, CheckCircle, Clock,
  Search, ExternalLink, GraduationCap,
  Save, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { useAssignmentStore, Assignment, Submission } from '../../store/assignmentStore';
import { useStudentStore } from '../../store/studentStore';
import { cn } from '../../lib/utils';

export const ManageAssignments = () => {
  const { user } = useAuthStore();
  const { students, fetchClassStudents } = useStudentStore();
  const { 
    assignments, loading, fetchAssignments, 
    createAssignment, deleteAssignment,
    fetchSubmissions, gradeSubmission 
  } = useAssignmentStore();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    class: user?.class || '',
    subject: user?.subject || '',
    attachments: [] as string[]
  });

  const [gradeData, setGradeData] = useState({ marks: 0, remarks: '' });

  useEffect(() => {
    if (user?.id) {
      fetchAssignments(user.id);
      if (user.class) fetchClassStudents(user.class);
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAssignment({ 
      ...formData, 
      teacherId: user?.id || ''
    });
    setShowCreate(false);
    fetchAssignments(user?.id || '');
    setFormData({ ...formData, title: '', description: '', dueDate: '', attachments: [] });
  };

  const handleViewSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    const subs = await fetchSubmissions(assignment.id);
    setSubmissions(subs);
  };

  const handleGrade = async () => {
    if (gradingSubmission) {
      await gradeSubmission(gradingSubmission.id, gradeData.marks, gradeData.remarks);
      setGradingSubmission(null);
      if (selectedAssignment) handleViewSubmissions(selectedAssignment);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Assignments</h1>
          <p className="text-gray-500 font-medium tracking-tight">Create, track and grade student homework</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus size={18} className="mr-2" /> New Assignment
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Assignment List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <div className="py-20 text-center text-gray-400">Loading assignments...</div>
          ) : assignments.length === 0 ? (
             <Card className="p-12 text-center text-gray-400 border-dashed border-2">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold">No assignments created yet</p>
                <p className="text-sm">Click "New Assignment" to get started</p>
             </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id} className="p-6 hover:shadow-lg transition-all group overflow-hidden">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <Badge variant="gold" className="bg-gold-50 text-gold-700 border-0">{assignment.subject}</Badge>
                         <Badge variant="primary" className="bg-navy-50 text-navy-700 border-0">{assignment.class}</Badge>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{assignment.description}</p>
                      
                      <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <Clock size={14} className="text-red-400" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                         </div>
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-blue-400" /> {assignment.attachments.length} Attachments
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewSubmissions(assignment)}>
                         View Submissions
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteAssignment(assignment.id)}>
                         <Trash2 size={16} />
                      </Button>
                   </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar / Submissions View */}
        <div className="lg:col-span-1">
           <AnimatePresence mode="wait">
              {selectedAssignment ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6 h-full min-h-[500px] border-gold-200">
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="font-bold text-navy-900">Submissions</h4>
                       <button onClick={() => setSelectedAssignment(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                          <X size={18} />
                       </button>
                    </div>
                    <p className="text-xs font-bold text-navy-500 mb-4">{selectedAssignment.title}</p>
                    
                    <div className="space-y-3">
                       {submissions.length === 0 ? (
                          <div className="py-10 text-center text-gray-400 text-sm italic">
                             No submissions found yet
                          </div>
                       ) : submissions.map(sub => (
                          <div key={sub.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-navy-900">{sub.studentName || 'Student'}</span>
                                {sub.status === 'Graded' ? (
                                   <Badge className="bg-emerald-50 text-emerald-600 border-0">{sub.marks}/100</Badge>
                                ) : (
                                   <Badge className="bg-blue-50 text-blue-600 border-0">{sub.status}</Badge>
                                )}
                             </div>
                             <div className="flex items-center justify-between">
                                <a href={sub.fileUrl} target="_blank" className="text-[10px] text-blue-500 flex items-center hover:underline">
                                   <ExternalLink size={10} className="mr-1" /> View File
                                </a>
                                {sub.status !== 'Graded' && (
                                   <Button variant="primary" size="sm" className="h-7 text-[10px]" onClick={() => setGradingSubmission(sub)}>
                                      Grade Now
                                   </Button>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <Card className="p-10 text-center bg-navy-50/30 border-dashed border-2 border-navy-100">
                   <GraduationCap size={40} className="mx-auto mb-4 text-navy-200" />
                   <p className="text-sm font-bold text-navy-400">Select an assignment to view and grade student submissions</p>
                </Card>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="heading-serif text-2xl font-bold text-navy-900">New Assignment</h3>
                <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6">
                 <Input 
                   label="Assignment Title" 
                   required
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                 />
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-navy-100"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Due Date" 
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    />
                    <Input 
                      label="Class" 
                      value={formData.class}
                      disabled
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                    <Button variant="primary" className="flex-1" type="submit">Create Task</Button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {gradingSubmission && (
          <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl"
            >
              <h3 className="heading-serif text-xl font-bold text-navy-900 mb-6 text-center">Grade Submission</h3>
              <div className="space-y-6">
                 <Input 
                   label="Marks (out of 100)" 
                   type="number"
                   value={gradeData.marks}
                   onChange={e => setGradeData({...gradeData, marks: parseInt(e.target.value)})}
                 />
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Teacher Remarks</label>
                    <textarea 
                      className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm min-h-[80px] outline-none"
                      value={gradeData.remarks}
                      onChange={e => setGradeData({...gradeData, remarks: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setGradingSubmission(null)}>Cancel</Button>
                    <Button variant="primary" className="flex-1" onClick={handleGrade}>Submit Grade</Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
