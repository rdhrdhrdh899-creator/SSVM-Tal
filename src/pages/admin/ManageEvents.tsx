import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Plus, Trash2, 
  Search, Filter, Clock, MapPin, 
  FileText, Link as LinkIcon, CheckCircle, X,
  ExternalLink, Edit2, Info, Image as ImageIcon
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useEventStore } from '../../store/eventStore';
import { SchoolEvent } from '../../types';

export const ManageEvents = () => {
  const { events, loading, fetchEvents, addEvent, deleteEvent, updateEvent } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<SchoolEvent | null>(null);
  const [formData, setFormData] = useState<Omit<SchoolEvent, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'Cultural',
    image: '',
    registrationLink: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filtered = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Image too large. Please choose a file under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateEvent(editingItem.id, formData);
      } else {
        await addEvent(formData);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert('Failed to save event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: 'Cultural',
      image: '',
      registrationLink: ''
    });
    setEditingItem(null);
  };

  const handleEdit = (event: SchoolEvent) => {
    setEditingItem(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      image: event.image || '',
      registrationLink: event.registrationLink || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Campus Calendar</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Plan and manage school events, workshops, and meets</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="shadow-lg shadow-navy-800/20"
        >
          <Plus size={18} className="mr-2" /> Add Event
        </Button>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-maroon-900 text-white overflow-hidden relative">
            <Calendar className="absolute -bottom-4 -right-4 text-white/5" size={100} />
            <div className="relative z-10">
              <h3 className="text-gold-400 font-bold uppercase tracking-widest text-[10px] mb-2">Active Events</h3>
              <p className="text-4xl font-black">{events.length}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400 font-bold uppercase">
                School Schedule
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-navy-950 mb-4 flex items-center gap-2">
              <Filter size={16} className="text-gold-500" /> Filter Events
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search events..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-6 flex flex-col md:flex-row gap-6 border-0 shadow-sm hover:shadow-md transition-all">
                  <div className="md:w-32 bg-gray-50 rounded-2xl flex flex-col items-center justify-center p-4 border border-gray-100 text-center flex-shrink-0">
                    <span className="text-navy-950 font-black text-2xl mb-1">{new Date(event.date).getDate() || event.date.split('-')[2] || '??'}</span>
                    <span className="text-gold-600 font-bold uppercase tracking-widest text-[10px]">{new Date(event.date).toLocaleString('default', { month: 'short' }) || 'Month'}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="primary" className="mb-2 text-[8px] tracking-[0.2em]">{event.category}</Badge>
                        <h3 className="text-xl font-bold text-navy-950">{event.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(event)} className="p-2 h-auto rounded-xl hover:bg-navy-50 text-navy-600">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { if(confirm('Delete event?')) deleteEvent(event.id); }} className="p-2 h-auto rounded-xl hover:bg-red-50 text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-gold-500" /> {event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-maroon-500" /> {event.venue}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 italic">
                      "{event.description}"
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && !loading && (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <Calendar size={64} className="mb-4 opacity-10" />
              <p className="text-xl font-medium">No events scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Event' : 'Schedule New Event'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Event Title</label>
                <input 
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                  placeholder="e.g., Annual Sports Meet 2024"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                >
                  <option value="Cultural">Cultural</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="PTM">PTM</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Time</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                    placeholder="09:00 AM"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Event Banner (URL or Upload)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="url"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                      placeholder="Image URL..."
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                    />
                  </div>
                  <label className="cursor-pointer bg-white px-4 py-3 border border-gray-100 rounded-2xl hover:bg-navy-50 flex items-center justify-center transition-all shadow-sm">
                    <LinkIcon size={14} className="text-navy-600 mr-2" />
                    <span className="text-[10px] font-bold text-navy-600">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Venue</label>
                <input 
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                  placeholder="Main Auditorium"
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Registration URL (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="url"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                    placeholder="https://forms.gle/..."
                    value={formData.registrationLink}
                    onChange={e => setFormData({...formData, registrationLink: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-medium"
                  placeholder="Tell us more about the event..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" className="flex-1 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 rounded-2xl font-bold shadow-lg shadow-navy-900/20">
              {editingItem ? 'Update Event' : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
