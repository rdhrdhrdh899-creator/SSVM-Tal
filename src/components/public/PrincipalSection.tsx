import React from 'react';
import { motion } from 'motion/react';
import { BadgeCheck, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui/Button';

export const PrincipalSection = () => {
  const { settings } = useSettingsStore();
  const principal = settings?.principal;

  if (!principal) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-900/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Principal Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gold-400/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                <img 
                  src={principal.photo} 
                  alt={principal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck size={20} className="text-gold-400" />
                    <span className="text-gold-400 text-xs font-black uppercase tracking-widest">Office of the Principal</span>
                  </div>
                  <h3 className="heading-serif text-3xl font-bold text-white">{principal.name}</h3>
                  <p className="text-cream-50/70 text-sm font-medium uppercase tracking-widest">{principal.designation}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Message Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative mb-8">
              <Quote className="text-gold-400/20 absolute -top-10 -left-10" size={120} strokeWidth={1} />
              <h2 className="heading-serif text-4xl md:text-5xl font-bold text-navy-950 mb-6 relative z-10">
                Message from <span className="text-gold-600">Our Principal</span>
              </h2>
            </div>
            
            <p className="text-xl text-gray-600 italic font-medium leading-relaxed mb-8 border-l-4 border-gold-400 pl-8">
              "{principal.message.length > 300 ? principal.message.substring(0, 300) + '...' : principal.message}"
            </p>

            <div className="space-y-6 mb-12">
              <p className="text-gray-600 leading-relaxed">
                Education is not just about academic excellence; it's about character building, fostering curiosity, and preparing students to navigate the complexities of the world with empathy and wisdom.
              </p>
              <p className="text-gray-600 leading-relaxed font-medium">
                At our institution, we strive to provide an environment where every child feels valued, challenged, and inspired to discover their unique potential.
              </p>
            </div>

            <Link to="/principal-message">
              <Button variant="primary" className="group px-10 py-4 h-auto text-lg">
                Read Full Message
                <ArrowRight size={20} className="ml-3 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
