import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO, SCHOOL_NAME } from '../../constants';
import { useSettingsStore } from '../../store/settingsStore';

export const WhatsAppWidget = () => {
  const { settings } = useSettingsStore();
  
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;
  const currentWhatsApp = settings?.whatsappNumber || CONTACT_INFO.whatsapp;
  
  const message = encodeURIComponent(`Hello, I need information about ${currentSchoolName}.`);
  const waLink = `https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      >
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <div className="bg-white text-navy-900 text-sm font-bold px-4 py-2 rounded-xl shadow-xl border border-gold-200 relative">
            Chat with us on WhatsApp
            <div className="absolute top-full right-6 w-3 h-3 bg-white border-r border-b border-gold-200 rotate-45 -mt-1.5" />
          </div>
        </div>

        {/* Pulse effect */}
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25" />
        
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 transition-colors"
        >
          <MessageCircle size={32} />
        </a>
      </motion.div>
    </div>
  );
};
