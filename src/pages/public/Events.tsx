import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowRight, Share2, CalendarDays } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useEventStore } from '../../store/eventStore';

export const Events = () => {
  const { events, loading, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' })
      };
    } catch {
      return { day: '??', month: 'Month' };
    }
  };

  return (
    <PageLayout>
      <div className="bg-navy-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-serif text-6xl md:text-7xl font-bold text-white mb-6">Campus Calendar</h1>
            <p className="text-xl md:text-2xl text-gold-400/80 max-w-2xl mx-auto font-medium">Stay updated with the latest events, workshops and milestones at Apex Vidya.</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        {loading ? (
          <div className="max-w-4xl mx-auto space-y-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="flex flex-col md:flex-row overflow-hidden p-0 border-0 group shadow-lg hover:shadow-2xl transition-all rounded-[2.5rem]">
                  <div className="md:w-1/3 bg-navy-900 flex flex-col items-center justify-center p-8 text-center border-r border-navy-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gold-400" />
                    <span className="text-gold-400 font-black text-6xl mb-1">{formatDate(event.date).day}</span>
                     <span className="text-white/60 font-bold uppercase tracking-[0.4em] text-xs">{formatDate(event.date).month}</span>
                     <div className="h-0.5 w-12 bg-maroon-500 my-6" />
                     <Badge variant="gold" className="bg-gold-500 text-navy-950 font-black px-4">{event.category}</Badge>
                  </div>
                  <div className="flex-1 p-8 md:p-12 bg-white relative">
                    <div className="absolute top-8 right-8 text-gray-300 hover:text-navy-900 cursor-pointer transition-colors"><Share2 size={20} /></div>
                    <h3 className="heading-serif text-3xl font-bold text-navy-900 mb-6 group-hover:text-gold-600 transition-colors">{event.title}</h3>
                    <div className="flex flex-wrap gap-6 mb-8">
                      <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest"><Clock size={16} className="mr-2 text-gold-500" /> {event.time}</div>
                      <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest"><MapPin size={16} className="mr-2 text-maroon-500" /> {event.venue}</div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-10 text-lg font-medium italic">"{event.description}"</p>
                    {event.registrationLink ? (
                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" className="rounded-full group px-8">
                          Register Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" className="rounded-full opacity-50 cursor-default">
                        Internal Event
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}

            {!loading && events.length === 0 && (
              <div className="py-40 text-center text-gray-300">
                <CalendarDays size={100} className="mx-auto mb-6 opacity-5" />
                <p className="text-2xl font-serif italic">The calendar is currently empty...</p>
                <p className="text-sm mt-2 uppercase tracking-widest font-bold">New events programmed soon</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
