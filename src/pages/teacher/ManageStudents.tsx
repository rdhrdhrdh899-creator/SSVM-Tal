import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, GraduationCap, 
  Trash2, Mail, Hash, BookOpen, AlertCircle,
  Star, CreditCard, Award, Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { RegisterStudentModal } from '../../components/dashboard/RegisterStudentModal';
import { Modal } from '../../components/ui/Modal';
import { User } from '../../types';
import { Phone, MapPin, Calendar as CalendarIcon, Info } from 'lucide-react';

export const ManageStudents = () => {
  const { user } = useAuthStore();
  const { students, loading, fetchClassStudents, updateStudent, deleteStudent } = useStudentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showICard, setShowICard] = useState<User | null>(null);
  const [showStarModal, setShowStarModal] = useState<User | null>(null);
  const [updating, setUpdating] = useState(false);

  // Use teacher's assigned class or a default for now
  const teacherClass = user?.class || 'X-A';

  useEffect(() => {
    fetchClassStudents(teacherClass);
  }, [fetchClassStudents, teacherClass]);

  const handleAwardStar = async (student: User) => {
    setUpdating(true);
    try {
      await updateStudent(student.id, { stars: !student.stars });
      await fetchClassStudents(teacherClass);
      setShowStarModal(null);
    } catch (error) {
      console.error('Error awarding star:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSetStudentOfMonth = async (student: User) => {
    setUpdating(true);
    try {
      // Find current student of the month if any and remove it
      const currentSOM = students.find(s => s.isStudentOfMonth);
      if (currentSOM && currentSOM.id !== student.id) {
        await updateStudent(currentSOM.id, { isStudentOfMonth: false });
      }

      await updateStudent(student.id, { isStudentOfMonth: !student.isStudentOfMonth });
      await fetchClassStudents(teacherClass);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error setting student of month:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleWhatsApp = (phone: string, studentName: string) => {
    if (!phone) {
      alert('Parent contact number not found.');
      return;
    }
    const message = encodeURIComponent(`Namaste, I am from the school. Regarding ${studentName}...`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your class records?`)) {
      try {
        await deleteStudent(id, teacherClass);
      } catch (error) {
        alert('Failed to delete student record.');
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toString().includes(searchTerm) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-navy-950">
        <div>
          <h1 className="heading-serif text-3xl font-black">Class Student Registry</h1>
          <div className="flex items-center mt-1 gap-2">
            <Badge variant="primary" className="bg-navy-900 border-0">{teacherClass}</Badge>
            <p className="text-gray-500 font-medium tracking-tight">Managing students assigned to your class</p>
          </div>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)}
          className="shadow-xl shadow-navy-100"
        >
          <UserPlus size={18} className="mr-2" /> Register Student
        </Button>
      </div>

      {/* Control Bar */}
      <Card className="p-4 border-0 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, roll number or email..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-navy-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center px-4 py-2 bg-navy-50 rounded-2xl border border-navy-100">
           <Users size={18} className="text-navy-800 mr-2" />
           <span className="text-sm font-bold text-navy-900">{students.length} Total</span>
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="p-4 md:p-6 border-0 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Roll Number Circle */}
                    <div className="w-14 h-14 rounded-2xl bg-navy-50 border border-navy-100 flex flex-col items-center justify-center text-navy-900 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors">
                      <span className="text-[10px] font-black uppercase opacity-60">Roll</span>
                      <span className="text-lg font-black leading-none">{student.rollNumber || '—'}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-navy-950 text-lg flex items-center gap-2 cursor-pointer hover:text-gold-600 transition-colors"
                        onClick={() => setSelectedStudent(student as User)}
                      >
                        {student.name}
                        {student.isStudentOfMonth && <Badge variant="gold" className="text-[9px] px-2 py-0.5 bg-gold-400 text-navy-950 border-0 flex items-center gap-1 shadow-sm"><Award size={10} /> Star of the Month</Badge>}
                        {student.assignedPassword && <Badge variant="primary" className="text-[8px] px-1 py-0 scale-90 border-navy-200 text-navy-400">ID Generated</Badge>}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={14} className="text-navy-400" /> {student.email}
                        </span>
                        <span className="text-sm text-gray-400 flex items-center gap-1 font-medium">
                          <BookOpen size={14} /> Class {student.class}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-emerald-500 hover:bg-emerald-50 rounded-xl"
                        onClick={() => handleWhatsApp(student.parentContact || student.phone || '', student.name)}
                        title="Contact Parent via WhatsApp"
                      >
                        <Phone size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gold-500 hover:bg-gold-50 rounded-xl"
                        onClick={() => setShowStarModal(student as User)}
                        title="Give Appreciation Star"
                      >
                        <Star size={18} fill={student.stars ? '#EAB308' : 'none'} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-500 hover:bg-blue-50 rounded-xl"
                        onClick={() => setShowICard(student as User)}
                        title="Digital I-Card"
                      >
                        <CreditCard size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => handleDelete(student.id, student.name)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && filteredStudents.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-xl font-bold text-navy-900">No students registered yet</p>
            <p className="text-gray-400">Add students to manage their academic records.</p>
          </div>
        )}
      </div>

      <RegisterStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        teacherClass={teacherClass}
      />

      {/* Digital I-Card Modal Overlay */}
      <Modal 
        isOpen={!!showICard} 
        onClose={() => setShowICard(null)} 
        title="Student Identity Card"
        size="sm"
      >
        {showICard && (
          <div className="p-2">
            <div className="w-full aspect-[2/3] bg-gradient-to-b from-navy-900 to-navy-950 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl border-4 border-gold-500/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl -mr-10 -mt-10" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-navy-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
               <div className="relative z-10 flex flex-col h-full items-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 border-2 border-gold-400 mb-6 mt-4">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${showICard.name}`} alt="ID" className="rounded-xl w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{showICard.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-6">
                     <Badge className="bg-gold-500 text-navy-900 border-0 text-[10px] font-black uppercase">Roll: {showICard.rollNumber || '—'}</Badge>
                     <Badge className="bg-white/10 text-white border-0 text-[10px] font-bold">Class {showICard.class}</Badge>
                  </div>
                  <div className="w-full space-y-4 pt-6 border-t border-white/10">
                     <div className="flex flex-col items-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Parent Contact</p>
                        <p className="font-bold text-sm tracking-widest">{showICard.parentContact || '---'}</p>
                     </div>
                     <div className="flex flex-col items-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Session</p>
                        <p className="font-bold text-sm tracking-widest">2024-25</p>
                     </div>
                  </div>
                  <div className="mt-auto pt-6 text-center">
                      <p className="text-[14px] font-serif italic text-gold-400">School Identity Card</p>
                  </div>
               </div>
            </div>
            <Button variant="outline" className="w-full rounded-2xl mt-6" onClick={() => window.print()}>
               <Download size={18} className="mr-2" /> Download/Print Card
            </Button>
          </div>
        )}
      </Modal>

      {/* Give Star Modal Overlay */}
      <Modal 
        isOpen={!!showStarModal} 
        onClose={() => setShowStarModal(null)} 
        title="Appreciate Student"
        size="sm"
      >
        {showStarModal && (
          <div className="space-y-6 text-center">
             <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mx-auto text-gold-500 shadow-xl shadow-gold-100">
                <Star size={40} fill="#EAB308" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-navy-950">Award an Excellence Star?</h3>
                <p className="text-sm text-gray-500 mt-1">This will be visible on {showStarModal.name}'s profile and celebrate their achievement!</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="rounded-2xl" onClick={() => setShowStarModal(null)}>Cancel</Button>
                <Button 
                  variant="primary" 
                  className="bg-gold-500 hover:bg-gold-600 text-navy-950 rounded-2xl border-0" 
                  onClick={() => handleAwardStar(showStarModal)}
                  isLoading={updating}
                >
                   <Award size={18} className="mr-2" /> {showStarModal.stars ? 'Remove Star' : 'Award Star'}
                </Button>
             </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        title="Student Profile Detail"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-navy-50 rounded-[2rem] border border-navy-100">
               <div className="w-20 h-20 rounded-2xl bg-white p-1 border-2 border-gold-400">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} alt="avatar" className="rounded-xl" />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-navy-950 leading-tight">{selectedStudent.name}</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Roll No: {selectedStudent.rollNumber || 'Not assigned'}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 flex items-center gap-1">
                     <CalendarIcon size={12} /> Date of Birth
                  </div>
                  <p className="font-bold text-navy-900">{selectedStudent.dob || 'Not provided'}</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 flex items-center gap-1">
                     <Phone size={12} /> Parent Contact
                  </div>
                  <p className="font-bold text-navy-900">{selectedStudent.parentContact || 'Not provided'}</p>
               </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 flex items-center gap-1">
                  <MapPin size={12} /> Residential Address
               </div>
               <p className="font-bold text-navy-900 leading-relaxed">{selectedStudent.address || 'Address not listed in records.'}</p>
            </div>

            <div className="p-4 bg-navy-950 rounded-2xl text-white">
               <div className="text-[10px] uppercase tracking-widest font-black text-gold-500 mb-1 flex items-center gap-1">
                  <Mail size={12} /> Student Email (Portal Login)
               </div>
               <p className="font-medium text-sm italic opacity-80">{selectedStudent.email}</p>
            </div>

            <div className="flex gap-4">
               <Button 
                 variant={selectedStudent.isStudentOfMonth ? 'outline' : 'primary'} 
                 className="flex-1 rounded-xl" 
                 onClick={() => handleSetStudentOfMonth(selectedStudent)}
                 isLoading={updating}
               >
                 <Star size={16} className="mr-2" /> 
                 {selectedStudent.isStudentOfMonth ? 'Remove Month Star' : 'Set Star of Month'}
               </Button>
               <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
