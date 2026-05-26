import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, History, Award, BookOpen, Clock } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Card } from '../../components/ui/Card';
import { useSettingsStore } from '../../store/settingsStore';
import { SCHOOL_NAME, ESTD_YEAR } from '../../constants';

export const About = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;

  return (
    <PageLayout>
      {/* Banner */}
      <div className="bg-navy-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h1 className="heading-serif text-5xl md:text-7xl font-bold text-white mb-6">Our Legacy & Mission</h1>
          <div className="w-24 h-2 bg-gold-400 mx-auto rounded-full mb-8" />
          <p className="text-xl text-cream-50/70 max-w-3xl mx-auto italic font-medium leading-relaxed">
            "{currentSchoolName} was founded with a single-minded goal: to create an environment where traditional values harmonize with cutting-edge academic excellence."
          </p>
        </motion.div>
      </div>

      {/* Mission & Vision */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-10 border-l-8 border-gold-500 bg-gold-50/30">
              <div className="w-16 h-16 bg-gold-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <ShieldCheck size={32} />
              </div>
              <h2 className="heading-serif text-3xl font-bold text-navy-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To build a world-class educational foundation that fosters self-discipline, curiosity, and critical thinking. We aim to equip every student with the tools to become global leaders who are socially responsible and ethically sound.
              </p>
            </Card>

            <Card className="p-10 border-l-8 border-maroon-600 bg-maroon-50/30">
              <div className="w-16 h-16 bg-maroon-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target size={32} />
              </div>
              <h2 className="heading-serif text-3xl font-bold text-navy-900 mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We envision a society where every child realizes their full potential through holistic education. Our goal is to be a beacon of learning that sets benchmarks for quality in the CBSE curriculum and character development.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-cream-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="The Journey So Far" subtitle="A timeline of growth, excellence and millions of dreams fulfilled." />
          
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-gold-200 -translate-x-[50%] hidden md:block" />
            
            {[
              { year: ESTD_YEAR, text: "The Foundation: School opened its doors with 150 students and 15 dedicated teachers.", icon: BookOpen },
              { year: "2005", text: "Affiliated to CBSE: Received senior secondary status and introduced Science & Commerce streams.", icon: History },
              { year: "2015", text: "Infrastructure Milestone: Inaugurated the Digital Learning Wing and International Sports Complex.", icon: Clock },
              { year: "2023", text: "Today: Leading with 2,800+ students and consistently topping regional board rankings.", icon: Award }
            ].map((milestone, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center mb-16 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:w-auto" />
                <div className="relative z-10 w-12 h-12 bg-navy-800 rounded-full border-4 border-gold-400 flex items-center justify-center text-gold-400 mx-8 my-4 md:my-0 shadow-xl">
                  <milestone.icon size={20} />
                </div>
                <Card className="flex-1 p-8 hover:border-gold-400">
                  <span className="text-2xl font-black text-gold-500 heading-serif mb-2 block">{milestone.year}</span>
                  <p className="text-navy-900 font-medium leading-relaxed">{milestone.text}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Leadership" subtitle="Guided by visionaries with a passion for educational transformation." />
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-64 h-80 rounded-[3rem] overflow-hidden border-8 border-gold-50 shadow-2xl mb-8 transform -rotate-3 hover:rotate-0 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Principal" className="w-full h-full object-cover bg-navy-50" alt="Principal" />
              </div>
              <h3 className="heading-serif text-3xl font-bold text-navy-900">Dr. S.K. Malhotra</h3>
              <p className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-4">Principal & Founder Trustee</p>
              <p className="text-gray-500 italic max-w-sm">"Education is the most powerful weapon which you can use to change the world. We build that weapon here."</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-64 h-80 rounded-[3rem] overflow-hidden border-8 border-gold-50 shadow-2xl mb-8 transform rotate-3 hover:rotate-0 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Director" className="w-full h-full object-cover bg-navy-50" alt="Director" />
              </div>
              <h3 className="heading-serif text-3xl font-bold text-navy-900">Mrs. Anjali Raizada</h3>
              <p className="text-gold-600 font-bold uppercase tracking-widest text-sm mb-4">Executive Director (Academics)</p>
              <p className="text-gray-500 italic max-w-sm">"Holistic growth is our mantra. We don't just teach subjects; we nurture souls and minds for the future."</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
