import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useStudentStore } from '../../store/studentStore';
import { User as UserIcon, Hash, BookOpen, Lock, Mail, Calendar as CalendarIcon, Phone, MapPin } from 'lucide-react';

interface RegisterStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherClass: string;
}

export const RegisterStudentModal = ({ isOpen, onClose, teacherClass }: RegisterStudentModalProps) => {
  const addStudent = useStudentStore((state) => state.addStudent);
  const fetchClassStudents = useStudentStore((state) => state.fetchClassStudents);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState(teacherClass);
  const [password, setPassword] = useState(''); 
  const [dob, setDob] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !studentClass) return;
    
    setIsSubmitting(true);
    try {
      await addStudent({
        name,
        email,
        rollNumber,
        class: studentClass,
        role: 'student',
        assignedPassword: password,
        dob,
        parentContact,
        address,
      });
      
      await fetchClassStudents(teacherClass);
      
      // Reset and close
      setName('');
      setEmail('');
      setRollNumber('');
      setPassword('');
      setDob('');
      setParentContact('');
      setAddress('');
      onClose();
    } catch (error) {
      console.error('Failed to register student:', error);
      alert('Error registering student profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Student" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Student Full Name" 
            placeholder="e.g., Rohan Sharma" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={<UserIcon size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
          
          <Input 
            label="Parent/Student Email (for Login)" 
            type="email"
            placeholder="student@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} className="text-gray-400" />}
            className="rounded-xl"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Roll Number" 
              placeholder="e.g., 101" 
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              icon={<Hash size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
            <Input 
              label="Class" 
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              required
              icon={<BookOpen size={18} className="text-gray-400" />}
              className="rounded-xl"
              readOnly={!!teacherClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date of Birth" 
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              icon={<CalendarIcon size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
            <Input 
              label="Parent Contact" 
              placeholder="98xxxxxx" 
              value={parentContact}
              onChange={(e) => setParentContact(e.target.value)}
              icon={<Phone size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
          </div>

          <Input 
            label="Residential Address" 
            placeholder="e.g., House No 12, Mohali" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            icon={<MapPin size={18} className="text-gray-400" />}
            className="rounded-xl"
          />

          <Input 
            label="Assigned Password (Internal Reference)" 
            type="password"
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </div>

        <div className="bg-gold-50 p-4 rounded-2xl border border-gold-100 flex items-start space-x-3">
          <div className="mt-0.5 text-gold-600"><Hash size={18} /></div>
          <p className="text-xs text-gold-800 leading-relaxed">
            Note: While we store the assigned password for records, students should use the allocated Email to login via Google for secure access.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>Register Student</Button>
        </div>
      </form>
    </Modal>
  );
};
