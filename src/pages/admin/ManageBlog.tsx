import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Plus, Trash2, 
  Search, Filter, User, 
  Tag, Link as LinkIcon, CheckCircle, X,
  ExternalLink, Edit2, Info, Image as ImageIcon,
  ChevronDown, Layout, Type
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useBlogStore } from '../../store/blogStore';
import { BlogPost } from '../../types';

export const ManageBlog = () => {
  const { posts, loading, fetchPosts, addPost, updatePost, deletePost } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    category: 'Academics',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    tags: []
  });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Image too large. Please choose a file under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updatePost(editingPost.id, formData);
      } else {
        await addPost({ ...formData, publishedAt: new Date().toISOString() });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      category: 'Academics',
      author: 'Admin',
      publishedAt: new Date().toISOString(),
      tags: []
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
      tags: post.tags || []
    });
    setIsModalOpen(true);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-navy-950 uppercase tracking-tight">Article Management</h2>
          <p className="text-gray-500 font-medium">Create and manage school blog posts</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-navy-900 text-gold-400 hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={18} className="mr-2" /> New Article
        </Button>
      </div>

      <Card className="p-4 border-0 shadow-sm bg-white">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by title or category..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="p-2 bg-white/90 rounded-lg text-navy-900 shadow-lg hover:bg-gold-400 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => { if(window.confirm('Delete this article?')) deletePost(post.id); }}
                      className="p-2 bg-white/90 rounded-lg text-red-600 shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-navy-50 text-navy-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {post.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-950 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">{post.excerpt}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy-400">By {post.author}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "Edit Article" : "Create New Article"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Article Title</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                    placeholder="Enter catchy title..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select 
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 appearance-none transition-all font-bold"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Academics</option>
                    <option>Events</option>
                    <option>Sports</option>
                    <option>Arts & Culture</option>
                    <option>Student Life</option>
                    <option>Alumni</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Excerpt (Short Preview)</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-medium resize-none"
                  placeholder="Tell readers what this post is about in 2 sentences..."
                  value={formData.excerpt}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Author Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                    placeholder="Admin / Principal / Name..."
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Cover Image (URL or Upload)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      required
                      type="url"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold text-xs"
                      placeholder="Paste image link..."
                      value={formData.coverImage}
                      onChange={e => setFormData({...formData, coverImage: e.target.value})}
                    />
                  </div>
                  <label className="cursor-pointer bg-white px-4 py-3 border border-gray-100 rounded-2xl hover:bg-navy-50 flex items-center justify-center transition-all shadow-sm">
                    <LinkIcon size={14} className="text-navy-600 mr-2" />
                    <span className="text-[10px] font-bold text-navy-600">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              {formData.coverImage && (
                <div className="aspect-video rounded-2xl overflow-hidden border border-gray-100 mb-4 bg-gray-50">
                  <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Full Content (HTML/Rich Text supported)</label>
                <textarea 
                  required
                  rows={10}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all font-medium resize-none font-sans leading-relaxed"
                  placeholder="Share the full story here... Use empty lines for paragraphs."
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="bg-navy-900 border-navy-900 text-gold-400 px-10">
              {editingPost ? 'Update Story' : 'Publish Story'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
