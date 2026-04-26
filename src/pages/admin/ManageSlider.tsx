import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Image as ImageIcon, Save, X, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSliderStore } from '../../store/useSliderStore';
import { HeroSlide } from '../../types';

export const ManageSlider = () => {
  const { slides, addSlide, updateSlide, deleteSlide, moveSlide } = useSliderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<Partial<HeroSlide>>({
    imageUrl: '',
    title: '',
    subtitle: ''
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('Image too large. Please choose a file under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentSlide({ ...currentSlide, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSlide.imageUrl || !currentSlide.title || !currentSlide.subtitle) return;

    if (editId) {
      updateSlide(editId, currentSlide);
    } else {
      addSlide(currentSlide as Omit<HeroSlide, 'id'>);
    }
    resetForm();
  };

  const handleEdit = (slide: HeroSlide) => {
    setCurrentSlide(slide);
    setEditId(slide.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentSlide({ imageUrl: '', title: '', subtitle: '' });
    setEditId(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Slider Manager</h1>
          <p className="text-gray-500 font-medium">Update the main banners on the home screen</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus size={18} className="mr-2" /> Add New Slide
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor & Preview */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-navy-950 flex items-center gap-2">
                       <Edit2 size={18} className="text-gold-500" />
                       {editId ? 'Edit Slide' : 'New Slide'}
                    </h3>
                    <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Banner Image</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        placeholder="Paste image link..."
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                        value={currentSlide.imageUrl}
                        onChange={(e) => setCurrentSlide({ ...currentSlide, imageUrl: e.target.value })}
                      />
                      <label className="cursor-pointer bg-white px-4 py-2 border border-navy-100 rounded-xl hover:bg-navy-50 flex items-center justify-center transition-colors shadow-sm">
                        <ImageIcon size={14} className="text-navy-600 mr-2" />
                        <span className="text-xs font-bold text-navy-600">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </div>

                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Banner Title"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                      value={currentSlide.title}
                      onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })}
                    />

                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Subtitle</label>
                    <textarea
                      required
                      placeholder="Short description..."
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
                      value={currentSlide.subtitle}
                      onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Save size={18} className="mr-2" />
                    {editId ? 'Update Slide' : 'Save Slide'}
                  </Button>
                </form>
              </Card>

              {/* Real-time Preview */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
                  <Eye size={12} /> Live Preview
                </h4>
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                  {currentSlide.imageUrl ? (
                    <img 
                      src={currentSlide.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Invalid+Image+URL';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-navy-950/40 p-6 flex flex-col justify-end">
                    <h3 className="text-white font-bold leading-tight truncate">{currentSlide.title || 'Your Title Here'}</h3>
                    <p className="text-gold-400 text-xs truncate">{currentSlide.subtitle || 'Your subtitle will appear here'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slides List */}
        <div className={`space-y-4 ${!isEditing ? 'lg:col-span-2' : ''}`}>
          <h3 className="font-bold text-navy-950 flex items-center gap-2 mb-4">
             Current Active Banners
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {slides.map((slide, index) => (
              <motion.div key={slide.id} layout>
                <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-video relative">
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/40 transition-colors" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="flex flex-col gap-1 mr-2 invisible group-hover:visible transition-all">
                        <button 
                          disabled={index === 0}
                          onClick={() => moveSlide(index, 'up')}
                          className="p-1 bg-white/90 rounded text-navy-900 shadow hover:bg-gold-400 disabled:opacity-30 disabled:hover:bg-white/90"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          disabled={index === slides.length - 1}
                          onClick={() => moveSlide(index, 'down')}
                          className="p-1 bg-white/90 rounded text-navy-900 shadow hover:bg-gold-400 disabled:opacity-30 disabled:hover:bg-white/90"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleEdit(slide)}
                        className="p-2 bg-white rounded-lg text-navy-900 shadow-lg hover:bg-gold-400 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteSlide(slide.id)}
                        className="p-2 bg-white rounded-lg text-red-600 shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-navy-950 text-sm truncate">{slide.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{slide.subtitle}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {slides.length === 0 && (
            <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-medium">No slides active. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
