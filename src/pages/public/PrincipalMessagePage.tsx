import React from 'react';
import { motion } from 'motion/react';
import { PageLayout } from '../../components/public/PageLayout';
import { useSettingsStore } from '../../store/settingsStore';
import { Card } from '../../components/ui/Card';
import { Quote, Mail, MapPin, Phone } from 'lucide-react';

export const PrincipalMessagePage = () => {
  const { settings } = useSettingsStore();
  const principal = settings?.principal;

  if (!principal) return null;

  return (
    <PageLayout>
      {/* Header Banner */}
      <div className="bg-navy-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-serif text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">Principal's Message</h1>
            <p className="text-xl text-gold-400 font-bold uppercase tracking-widest max-w-2xl mx-auto border-y border-white/10 py-4">Nurturing Excellence, Inspiring Future Leaders</p>
          </motion.div>
        </div>
      </div>

      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Profile Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <Card className="p-0 border-0 shadow-2xl bg-white rounded-[2rem] overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={principal.photo} 
                      alt={principal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 text-center bg-navy-950 text-white">
                    <h3 className="heading-serif text-2xl font-bold mb-1">{principal.name}</h3>
                    <p className="text-gold-400 text-xs font-black uppercase tracking-widest border-t border-white/10 pt-4 mt-4">
                      {principal.designation}
                    </p>
                  </div>
                </Card>

                <div className="mt-8 space-y-4">
                  {[
                    { icon: Mail, label: 'Email Office', value: settings?.schoolEmail },
                    { icon: Phone, label: 'Contact', value: settings?.schoolPhone },
                    { icon: MapPin, label: 'Location', value: settings?.schoolAddress }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-navy-50">
                      <div className="p-2 bg-navy-50 rounded-lg text-navy-900">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-bold text-navy-950">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-8">
                <Card className="p-8 md:p-16 border-0 shadow-sm bg-white rounded-[2.5rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote size={200} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="prose prose-lg max-w-none prose-headings:heading-serif prose-headings:text-navy-950 prose-p:text-gray-600 prose-strong:text-navy-900">
                      <p className="text-xl leading-relaxed text-navy-900 font-medium italic mb-12 border-l-8 border-gold-400 pl-8 py-2 bg-gold-400/5">
                        "{principal.message}"
                      </p>

                      <div className="space-y-6">
                        <p>
                          Dear Parents, Students, and Well-wishers,
                        </p>
                        <p>
                          It is an honor to welcome you to our school community. As we navigate an era of unprecedented rapid change and global shifts, our role as educators has never been more critical. We are not just teaching subjects; we are mentoring future citizens of the world.
                        </p>
                        <p>
                          Our philosophy rests on the pillar of holistic development. While we maintain a rigorous academic standard that challenges our students to reach their full cognitive potential, we place equal emphasis on physical vitality, emotional intelligence, and spiritual grounding.
                        </p>
                        <h3 className="text-2xl font-bold mt-12 mb-6">Our Commitment to Innovation</h3>
                        <p>
                          We believe in blending traditional values with modern innovation. Our classrooms are equipped with state-of-the-art digital tools, not to replace the teacher-student bond, but to enhance it. We encourage a culture of "asking why," where curiosity is rewarded and failure is seen as a necessary stepping stone to success.
                        </p>
                        <p>
                          To our students, I say: Dream big, work hard, and never lose your wonder. To our parents, I thank you for entrusting us with your most precious treasure. Together, we can create a legacy of learning that transcends the walls of this institution.
                        </p>
                        <p className="pt-12">
                          Warm regards,
                        </p>
                        <div className="mt-4">
                          <p className="text-2xl font-bold heading-serif text-navy-950">{principal.name}</p>
                          <p className="text-gold-600 font-black uppercase tracking-widest text-sm">{principal.designation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
