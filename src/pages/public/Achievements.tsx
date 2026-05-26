import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Target, Globe, BookOpen, Users, Calendar } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAchievementStore } from '../../store/achievementStore';

export const Achievements = () => {
  const { achievements, loading, fetchAchievements } = useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return (
    <PageLayout>
      <div className="bg-navy-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="heading-serif text-5xl font-bold text-white mb-4">Hall of Fame</h1>
          <p className="text-xl text-cream-50/60 max-w-2xl mx-auto">Celebrating extraordinary students who dared to dream and excelled beyond boundaries.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-8 h-full relative overflow-hidden transition-all hover:shadow-2xl border-t-4 ${item.featured ? 'border-gold-400' : 'border-navy-200'}`}>
                  {item.featured && (
                    <div className="absolute top-0 right-0 bg-gold-400 text-navy-950 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 z-10">
                      <Star size={10} /> Featured
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${item.featured ? 'bg-gold-50 text-gold-500' : 'bg-gray-50 text-navy-400'}`}>
                    {item.category === 'Academic' && <BookOpen size={32} />}
                    {item.category === 'Sports' && <Trophy size={32} />}
                    {item.category === 'Arts' && <Users size={32} />}
                    {item.category === 'Competition' && <Target size={32} />}
                    {item.category === 'School' && <Globe size={32} />}
                  </div>
                  <h3 className="heading-serif text-2xl font-bold text-navy-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 font-medium text-sm mb-6 leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <Badge variant="primary" className="text-[10px] font-bold uppercase tracking-widest">{item.category}</Badge>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                      <Calendar size={10} /> {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {achievements.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400">
                <Trophy size={64} className="mx-auto mb-4 opacity-10" />
                <p className="text-xl font-medium">Achievements will be posted soon</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
