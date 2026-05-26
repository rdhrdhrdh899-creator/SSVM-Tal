import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTeacherStore } from '../../store/teacherStore';
import { GraduationCap, Mail, User as UserIcon, BookOpen } from 'lucide-react';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTeacherModal = ({ isOpen, onClose }: AddTeacherModalProps) => {
  const addTeacher = useTeacherStore((state) => state.addTeacher);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject) return;
    
    setIsSubmitting(true);
    try {
      await addTeacher({
        name,
        email,
        subject,
        class: assignedClass,
        phone,
        role: 'teacher',
      });
      
      // Reset and close
      setName('');
      setEmail('');
      setSubject('');
      setAssignedClass('');
      setPhone('');
      onClose();
    } catch (error) {
      console.error('Failed to add teacher:', error);
      alert('Error adding teacher profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Faculty Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="e.g., Dr. Sameer Verma" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={<UserIcon size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
          
          <Input 
            label="Official email" 
            type="email"
            placeholder="teacher@school.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} className="text-gray-400" />}
            className="rounded-xl"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Primary Subject" 
              placeholder="e.g., Mathematics" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              icon={<BookOpen size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
            <Input 
              label="Assigned Class (ID)" 
              placeholder="e.g., X-A" 
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              icon={<GraduationCap size={18} className="text-gray-400" />}
              className="rounded-xl"
            />
          </div>
          <Input 
            label="Contact Number" 
            placeholder="+91 XXXXX XXXXX" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="bg-navy-50 p-4 rounded-2xl border border-navy-100 flex items-start space-x-3">
          <GraduationCap className="text-navy-800 mt-1 flex-shrink-0" size={20} />
          <p className="text-xs text-navy-700 leading-relaxed">
            The teacher will be able to login using this email address via Google Sign-In. 
            Once they login, they will have access to the Teacher Dashboard.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="emerald" isLoading={isSubmitting}>Register Teacher</Button>
        </div>
      </form>
    </Modal>
  );
};
