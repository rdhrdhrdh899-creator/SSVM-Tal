import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useBlogStore } from '../../store/blogStore';
import { Link } from 'react-router-dom';

export const Blog = () => {
  const { posts, loading, fetchPosts } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const categories = ['All', ...new Set(posts.map(post => post.category))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <div className="bg-navy-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-serif text-5xl md:text-6xl font-bold text-white mb-6">School News & Stories</h1>
            <p className="text-xl text-cream-50/60 max-w-2xl mx-auto">Insights, updates, and academic excellence from our vibrant campus community.</p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-navy-100 rounded-2xl text-sm focus:ring-2 focus:ring-gold-400 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-navy-900 text-white shadow-lg'
                      : 'bg-white text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.id}`}>
                    <Card className="group h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gold-400 text-navy-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gold-500" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-gold-500" />
                            {post.author}
                          </div>
                        </div>
                        
                        <h3 className="heading-serif text-xl font-bold text-navy-950 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center text-navy-900 font-bold text-xs uppercase tracking-widest group/btn">
                          Read Full Article
                          <ArrowRight size={14} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-navy-50">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};
