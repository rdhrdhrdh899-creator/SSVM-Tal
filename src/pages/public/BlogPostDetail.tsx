import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Button } from '../../components/ui/Button';
import { useBlogStore } from '../../store/blogStore';
import { Card } from '../../components/ui/Card';

export const BlogPostDetail = () => {
  const { id } = useParams();
  const { posts, fetchPosts } = useBlogStore();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [posts, fetchPosts]);

  useEffect(() => {
    const found = posts.find(p => p.id === id);
    if (found) setPost(found);
  }, [id, posts]);

  if (!post) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <article className="bg-cream-50 pb-20">
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end pb-12">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-gold-400 text-navy-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {post.category}
                  </span>
                </div>
                <h1 className="heading-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-cream-50/80 font-bold text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gold-400" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gold-400" />
                    By {post.author}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <Card className="p-8 md:p-12 border-0 shadow-xl bg-white rounded-3xl">
                <div 
                  className="space-y-6 text-lg leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                />
                
                <div className="mt-12 pt-8 border-t border-navy-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-navy-400 uppercase tracking-widest">Share this story</span>
                    <div className="flex gap-2">
                      <button className="p-2 bg-navy-50 text-navy-600 rounded-full hover:bg-gold-400 hover:text-navy-900 transition-all">
                        <Facebook size={16} />
                      </button>
                      <button className="p-2 bg-navy-50 text-navy-600 rounded-full hover:bg-gold-400 hover:text-navy-900 transition-all">
                        <Twitter size={16} />
                      </button>
                      <button className="p-2 bg-navy-50 text-navy-600 rounded-full hover:bg-gold-400 hover:text-navy-900 transition-all">
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mt-12">
                <Link to="/blog">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft size={16} />
                    Back to All Articles
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="p-6 border-0 shadow-lg bg-navy-950 text-white rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <h3 className="heading-serif text-xl font-bold mb-4 relative z-10">Latest News Letter</h3>
                <p className="text-cream-50/70 text-sm mb-6 relative z-10">Subscribe to get the latest academic highlights and event updates delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm mb-4 outline-none focus:ring-1 focus:ring-gold-400 transition-all"
                />
                <Button variant="primary" className="w-full !bg-gold-400 !text-navy-950">Subscribe Now</Button>
              </Card>

              <div className="space-y-4">
                <h3 className="heading-serif text-xl font-bold text-navy-950">Recent Articles</h3>
                {posts.filter(p => p.id !== post.id).slice(0, 3).map(recent => (
                  <Link key={recent.id} to={`/blog/${recent.id}`}>
                    <Card className="p-3 border-0 shadow-sm hover:shadow-md transition-all flex gap-4 bg-white group">
                      <img 
                        src={recent.coverImage} 
                        className="w-20 h-20 object-cover rounded-xl"
                        alt={recent.title}
                      />
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-gold-600 uppercase mb-1">{recent.category}</span>
                        <h4 className="text-sm font-bold text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {recent.title}
                        </h4>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  );
};
