import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Maximize2, X, Calendar, Image as ImageIcon } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { useGalleryStore } from '../../store/galleryStore';

export const Gallery = () => {
  const { items, loading, fetchItems } = useGalleryStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = ['All', ...new Set(items.map(item => item.category || 'General'))];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => (item.category || 'General') === activeCategory);

  return (
    <PageLayout>
      <div className="bg-navy-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-serif text-6xl md:text-7xl font-bold text-white mb-6">Capturing Moments</h1>
            <p className="text-xl md:text-2xl text-gold-400/80 max-w-2xl mx-auto font-medium">A visual journey through our campus life, achievements, and vibrant community.</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all border-2 ${activeCategory === cat ? 'bg-navy-900 border-navy-900 text-white shadow-2xl scale-105' : 'bg-white border-gray-100 text-gray-500 hover:border-gold-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-72 bg-gray-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative h-80 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
                  onClick={() => setSelectedImage(item.url)}
                >
                  <img 
                    src={item.url} 
                    alt={item.description} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Load+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-gold-400 font-black text-[10px] uppercase tracking-[0.3em] mb-3">{item.category || 'General'}</span>
                    <h3 className="text-white font-bold leading-relaxed italic text-sm line-clamp-3">"{item.description}"</h3>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <Maximize2 size={16} />
                      </div>
                      <span className="text-white/40 text-[9px] font-bold uppercase flex items-center gap-1">
                        <Calendar size={10} /> {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="py-40 text-center text-gray-300">
             <ImageIcon size={100} className="mx-auto mb-6 opacity-5" />
             <p className="text-2xl font-serif italic">The gallery is currently being curated...</p>
             <p className="text-sm mt-2 uppercase tracking-widest font-bold">New memories coming soon</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy-950/98 backdrop-blur-xl"
              onClick={() => setSelectedImage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-7xl max-h-full overflow-hidden rounded-[3rem] shadow-3xl border-4 border-white/10"
            >
              <img src={selectedImage} alt="Full Size" className="w-full h-full object-contain bg-navy-900" referrerPolicy="no-referrer" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-8 right-8 w-14 h-14 bg-navy-950/50 backdrop-blur-lg text-white rounded-full flex items-center justify-center hover:bg-gold-400 hover:text-navy-950 transition-all border border-white/10"
              >
                <X size={28} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

