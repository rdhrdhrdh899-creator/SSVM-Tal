import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNoticeStore } from '../../store/noticeStore';
import { useAuthStore } from '../../store/authStore';
import { Notice } from '../../types';
import { Calendar, Users } from 'lucide-react';

interface PostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostNoticeModal = ({ isOpen, onClose }: PostNoticeModalProps) => {
  const addNotice = useNoticeStore((state) => state.addNotice);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('Circular');
  const [expiryDate, setExpiryDate] = useState('');
  const [important, setImportant] = useState(false);
  const [targets, setTargets] = useState<string[]>(['All']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTargetToggle = (target: string) => {
    // ... existing logic
    if (target === 'All') {
      setTargets(['All']);
      return;
    }
    
    let newTargets = targets.filter(t => t !== 'All');
    if (newTargets.includes(target)) {
      newTargets = newTargets.filter(t => t !== target);
    } else {
      newTargets.push(target);
    }
    
    if (newTargets.length === 0) {
      newTargets = ['All'];
    }
    setTargets(newTargets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !expiryDate || targets.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const newNotice = {
        title,
        content,
        category,
        date: new Date().toISOString(),
        important,
        target: targets.includes('All') ? 'All' : targets.join(', '),
        expiryDate,
        createdAt: new Date().toISOString(),
        authorId: useAuthStore.getState().user?.id,
        authorRole: useAuthStore.getState().user?.role,
      };
      
      await addNotice(newNotice);
      
      // Reset and close
      setTitle('');
      setContent('');
      setCategory('Circular');
      setExpiryDate('');
      setImportant(false);
      setTargets(['All']);
      onClose();
    } catch (error) {
      console.error('Failed to post notice:', error);
      alert('Error publishing notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post New Notice" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input 
            label="Notice Title" 
            placeholder="e.g., Annual Sports Meet" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-xl"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy-900 ml-1">Category</label>
            <select 
              className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-1"
              value={category}
              onChange={(e) => setCategory(e.target.value as Notice['category'])}
            >
              <option value="Circular">Circular</option>
              <option value="Event">Event</option>
              <option value="Holiday">Holiday</option>
              <option value="Exam">Exam</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-navy-900 ml-1">Notice Content</label>
          <textarea 
            className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-1 resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compose your notice details..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy-900 ml-1 flex items-center gap-1">
              <Calendar size={14} className="text-gold-500" /> Expiry Date
            </label>
            <Input 
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy-900 ml-1 flex items-center gap-1">
              <Users size={14} className="text-gold-500" /> Target Audience
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['All', 'Students', 'Parents', 'Teachers'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTargetToggle(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    targets.includes(t)
                      ? 'bg-navy-800 border-navy-800 text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gold-400 hover:text-navy-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-gray-300 text-maroon-600 focus:ring-maroon-600"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
            />
            <span className="text-sm font-medium text-navy-900 group-hover:text-maroon-600 transition-colors">
              Mark as Important (Highlight on Dashboard)
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="emerald" isLoading={isSubmitting}>Publish Notice</Button>
        </div>
      </form>
    </Modal>
  );
};
