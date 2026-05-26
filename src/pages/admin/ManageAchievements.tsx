import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Star, Award, Plus, Trash2, 
  Search, Filter, Calendar, Type, 
  FileText, Image as ImageIcon, CheckCircle, X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAchievementStore, Achievement } from '../../store/achievementStore';

export const ManageAchievements = () => {
  const { achievements, loading, fetchAchievements, addAchievement, deleteAchievement } = useAchievementStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, 'id'>>({
    title: '',
    description: '',
    category: 'Academic',
    date: new Date().toISOString().split('T')[0],
    featured: false
  });

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const filtered = achievements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAchievement(newAchievement);
      setIsModalOpen(false);
      setNewAchievement({
        title: '',
        description: '',
        category: 'Academic',
        date: new Date().toISOString().split('T')[0],
        featured: false
      });
    } catch (error) {
      alert('Failed to add achievement');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Achievement Board</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Celebrate school achievements and student milestones</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)}
          className="shadow-lg shadow-navy-800/20"
        >
          <Plus size={18} className="mr-2" /> New Achievement
        </Button>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Statistics & Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-navy-950 text-white overflow-hidden relative">
            <Trophy className="absolute -bottom-4 -right-4 text-white/5" size={100} />
            <div className="relative z-10">
              <h3 className="text-gold-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Highlights</h3>
              <p className="text-4xl font-black">{achievements.length}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="gold" className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                  {achievements.filter(a => a.featured).length} Featured
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-navy-950 mb-4 flex items-center gap-2">
              <Filter size={16} className="text-gold-500" /> Search & Filter
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                {item.featured && (
                  <div className="absolute top-0 right-0 bg-gold-400 text-navy-950 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 z-10">
                    <Star size={10} /> Featured
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-navy-900 border border-gray-100 flex-shrink-0">
                    {item.category === 'Academic' ? <Award size={24} /> : <Trophy size={24} />}
                  </div>
                  <button 
                    onClick={() => deleteAchievement(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="font-black text-navy-950 text-xl mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 font-medium leading-relaxed">{item.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-widest">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Calendar size={10} /> {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <Award size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">No achievements found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Achievement">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Title</label>
              <input 
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                placeholder="e.g. CBSE District Topper 2024"
                value={newAchievement.title}
                onChange={e => setNewAchievement({...newAchievement, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                  value={newAchievement.category}
                  onChange={e => setNewAchievement({...newAchievement, category: e.target.value as any})}
                >
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Competition">Competition</option>
                  <option value="School">School Level</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Date</label>
                <input 
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                  value={newAchievement.date}
                  onChange={e => setNewAchievement({...newAchievement, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-medium"
                placeholder="Describe the achievement in detail..."
                value={newAchievement.description}
                onChange={e => setNewAchievement({...newAchievement, description: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-navy-50 rounded-2xl border border-navy-100 cursor-pointer" onClick={() => setNewAchievement({...newAchievement, featured: !newAchievement.featured})}>
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${newAchievement.featured ? 'bg-gold-500 text-navy-950' : 'bg-white border-2 border-gray-200 text-transparent'}`}>
                <CheckCircle size={14} />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-900">Featured Highlight</p>
                <p className="text-xs text-navy-400 font-medium">Display prominently on the public portal achievement board</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 rounded-2xl">Publish Highlight</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
