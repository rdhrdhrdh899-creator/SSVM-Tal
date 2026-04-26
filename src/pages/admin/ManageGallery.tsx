import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, Plus, Trash2, 
  Search, Filter, Calendar, Type, 
  FileText, Link as LinkIcon, CheckCircle, X,
  ExternalLink, Edit2, Upload
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useGalleryStore, GalleryItem } from '../../store/galleryStore';
import { useAuthStore } from '../../store/authStore';

export const ManageGallery = () => {
  const { items, loading, fetchItems, addItem, deleteItem, updateItem } = useGalleryStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id' | 'uploadedAt'>>({
    url: '',
    description: '',
    category: 'General',
    uploadedBy: user?.id || ''
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = items.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Firestore Base64 storage
        alert('Image too large. Please choose a file under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem(editingItem.id, newItem);
      } else {
        await addItem(newItem);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert('Failed to save gallery item');
    }
  };

  const resetForm = () => {
    setNewItem({
      url: '',
      description: '',
      category: 'General',
      uploadedBy: user?.id || ''
    });
    setEditingItem(null);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setNewItem({
      url: item.url,
      description: item.description,
      category: item.category || 'General',
      uploadedBy: item.uploadedBy || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950 text-balance">Photo Gallery</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Manage school event photos and visual memories</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="shadow-lg shadow-navy-800/20"
        >
          <Plus size={18} className="mr-2" /> Add Photo
        </Button>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Statistics & Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-navy-950 text-white overflow-hidden relative">
            <ImageIcon className="absolute -bottom-4 -right-4 text-white/5" size={100} />
            <div className="relative z-10">
              <h3 className="text-gold-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Photos</h3>
              <p className="text-4xl font-black">{items.length}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400 font-bold uppercase">
                Visual Archive
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-navy-950 mb-4 flex items-center gap-2">
              <Filter size={16} className="text-gold-500" /> Search Gallery
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search description..."
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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={item.url} 
                    alt={item.description}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Load+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white text-navy-950 hover:bg-gold-400 font-bold p-2 h-auto rounded-xl"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white text-red-600 hover:bg-red-50 font-bold p-2 h-auto rounded-xl"
                      onClick={() => {
                        if(confirm('Delete this photo?')) deleteItem(item.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-widest bg-navy-50 text-navy-600 border-navy-100">
                      {item.category || 'General'}
                    </Badge>
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Calendar size={10} /> {new Date(item.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed flex-1 line-clamp-2 italic">
                    "{item.description}"
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">No photos in the gallery</p>
              <p className="text-sm mt-1">Start by adding your first school memory</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Photo Details' : 'Add New Photo'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Image Source (URL or File)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    required
                    type="url"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                    placeholder="https://images.unsplash.com/..."
                    value={newItem.url}
                    onChange={e => setNewItem({...newItem, url: e.target.value})}
                  />
                </div>
                <label className="cursor-pointer bg-white px-6 py-3 border-2 border-dashed border-navy-100 rounded-2xl hover:bg-navy-50 flex items-center justify-center transition-all shadow-sm">
                  <Upload size={16} className="text-navy-600 mr-2" />
                  <span className="text-xs font-bold text-navy-600">Browse</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic px-1">Note: Paste a direct image link or upload a photo (Max 1MB).</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Category/Event</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="General">General</option>
                  <option value="Annual Day">Annual Day</option>
                  <option value="Sports Meet">Sports Meet</option>
                  <option value="Cultural Fest">Cultural Fest</option>
                  <option value="Study Tour">Study Tour</option>
                  <option value="Campus Life">Campus Life</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Preview</label>
                <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200">
                  {newItem.url ? (
                    <img src={newItem.url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon size={24} className="text-gray-300" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea 
                required
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-medium"
                placeholder="Describe this photo or event..."
                value={newItem.description}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 rounded-2xl">
              {editingItem ? 'Update Photo' : 'Publish to Gallery'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
