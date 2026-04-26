import React, { useEffect } from 'react';
import { PageLayout } from '../../components/public/PageLayout';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useNoticeStore } from '../../store/noticeStore';
import { formatDate } from '../../lib/utils';
import { Calendar, Megaphone, Info } from 'lucide-react';

export const Notices = () => {
  const { notices, loading, fetchNotices } = useNoticeStore();

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <SectionTitle 
          title="Notice Board" 
          subtitle="All official circulars, event announcements, and school updates in one place."
        />

        {loading ? (
          <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <Card key={notice.id} className="p-8 border-l-4 border-gold-400 hover:border-navy-800 transition-all group overflow-hidden relative">
                  {notice.important && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-maroon-600 text-white text-[10px] font-bold px-6 py-1 rotate-45 translate-x-4 translate-y-2 uppercase tracking-widest shadow-sm">
                        Urgent
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-navy-50 rounded-2xl flex flex-col items-center justify-center text-navy-950 border border-navy-100 italic">
                        <span className="text-[10px] font-black uppercase text-gold-600 block leading-none mb-1">
                          {new Date(notice.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-3xl font-black">{new Date(notice.date).getDate()}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant={notice.category === 'Holiday' ? 'danger' : 'primary'}>{notice.category}</Badge>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center">
                          <Calendar size={12} className="mr-1" /> {formatDate(notice.date)}
                        </span>
                      </div>
                      
                      <h3 className="heading-serif text-2xl font-bold text-navy-900 mb-4 group-hover:text-gold-600 transition-colors">
                        {notice.title}
                      </h3>
                      
                      <div 
                        className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                      />
                      
                      <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 w-fit px-4 py-2 rounded-full border border-gray-100">
                        <Megaphone size={14} className="mr-2 text-gold-500" />
                        Target: {notice.target || 'General Public'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <Info size={64} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-2xl font-bold text-navy-900 mb-2">No Active Notices</h3>
                <p className="text-gray-500">Check back later for school updates and announcements.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
