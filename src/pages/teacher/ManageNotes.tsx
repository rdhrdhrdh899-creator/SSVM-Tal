import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Upload, FileText, Link, Youtube, 
  Trash2, Eye, EyeOff, Search, X, 
  Folder, Lock, Unlock, Download,
  ExternalLink
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { useNotesStore, StudyMaterial } from '../../store/notesStore';
import { cn } from '../../lib/utils';

export const ManageNotes = () => {
  const { user } = useAuthStore();
  const { materials, loading, fetchMaterials, addMaterial, updateMaterial, deleteMaterial } = useNotesStore();

  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubject, setActiveSubject] = useState<string>('All');
  
  const [formData, setFormData] = useState({
    title: '',
    subject: user?.subject || '',
    class: user?.class || '',
    type: 'pdf' as 'pdf' | 'link' | 'video',
    url: '',
    isHidden: false
  });

  useEffect(() => {
    if (user?.id) fetchMaterials(user.id);
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMaterial({ ...formData, teacherId: user?.id || '' });
    setShowAdd(false);
    setFormData({ ...formData, title: '', url: '', isHidden: false });
    fetchMaterials(user?.id || '');
  };

  const subjects = ['All', ...new Set(materials.map(m => m.subject))];
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = activeSubject === 'All' || m.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Youtube size={20} className="text-red-500" />;
      case 'pdf': return <FileText size={20} className="text-blue-500" />;
      default: return <Link size={20} className="text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Study Materials</h1>
          <p className="text-gray-500 font-medium tracking-tight">Organize notes, videos and resources for your students</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} className="mr-2" /> Upload Material
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex bg-navy-50 p-1 rounded-2xl border border-navy-100">
           {subjects.map(s => (
             <button
               key={s}
               onClick={() => setActiveSubject(s)}
               className={cn(
                 "px-6 py-2 text-xs font-bold rounded-xl transition-all",
                 activeSubject === s ? "bg-navy-900 text-white shadow-lg" : "text-navy-400 hover:text-navy-900"
               )}
             >{s}</button>
           ))}
        </div>
        <div className="relative flex-1 min-w-[300px]">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search materials..."
             className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-navy-50 shadow-sm"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400">Loading resources...</div>
        ) : filteredMaterials.length === 0 ? (
          <Card className="col-span-full p-20 text-center border-dashed border-2">
             <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Folder size={32} className="text-navy-200" />
             </div>
             <p className="font-bold text-navy-900">No materials found</p>
             <p className="text-sm text-gray-500">Add notes, PDFs, or educational links to share with your class</p>
          </Card>
        ) : filteredMaterials.map(m => (
          <Card key={m.id} className={cn("p-6 flex flex-col group transition-all", m.isHidden && "opacity-60")}>
             <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                   {getTypeIcon(m.type)}
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => updateMaterial(m.id, { isHidden: !m.isHidden })}
                     className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                   >
                      {m.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                   <button 
                     onClick={() => deleteMaterial(m.id)}
                     className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                   >
                      <Trash2 size={18} />
                   </button>
                </div>
             </div>
             
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <Badge className="bg-navy-900 text-white border-0 text-[9px] uppercase tracking-widest">{m.subject}</Badge>
                   <Badge className="bg-gold-50 text-gold-700 border-0 text-[10px] font-bold">{m.class}</Badge>
                </div>
                <h3 className="font-bold text-navy-900 text-lg mb-4">{m.title}</h3>
             </div>

             <div className="flex items-center gap-3">
                <a 
                  href={m.url} 
                  target="_blank" 
                  className="flex-1 bg-navy-50 text-navy-900 py-3 rounded-xl text-center text-xs font-black hover:bg-navy-100 transition-colors flex items-center justify-center gap-2"
                >
                   {m.type === 'pdf' ? <Download size={14} /> : <ExternalLink size={14} />}
                   {m.type === 'pdf' ? 'Open PDF' : 'Visit Link'}
                </a>
             </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="heading-serif text-2xl font-bold text-navy-900">Upload Material</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                 <Input 
                   label="Material Title" 
                   required
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Quantum Physics - Chapter 1 Notes"
                 />
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                       <select 
                         className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold border-0"
                         value={formData.type}
                         onChange={e => setFormData({...formData, type: e.target.value as any})}
                       >
                          <option value="pdf">📄 PDF Document</option>
                          <option value="link">🔗 Web Resource</option>
                          <option value="video">🎥 Video Course</option>
                       </select>
                    </div>
                    <Input label="Class" value={formData.class} disabled />
                 </div>

                 <Input 
                   label="Resource URL (Drive/Link)" 
                   required
                   value={formData.url}
                   onChange={e => setFormData({...formData, url: e.target.value})}
                   placeholder="https://..."
                   icon={<Link size={16} />}
                 />

                 <div className="flex items-center justify-between p-4 bg-navy-50/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white rounded-lg text-navy-900">
                          {formData.isHidden ? <Lock size={16} /> : <Unlock size={16} />}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-navy-900">Private Mode</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Hide from students</p>
                       </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isHidden: !formData.isHidden})}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        formData.isHidden ? 'bg-navy-900' : 'bg-gray-200'
                      )}
                    >
                       <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.isHidden ? 'left-7' : 'left-1')} />
                    </button>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
                    <Button variant="primary" className="flex-1" type="submit">Publish Resource</Button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
