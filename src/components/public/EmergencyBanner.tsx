import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const EmergencyBanner = () => {
  const { settings } = useSettingsStore();

  if (!settings?.emergencyAlert?.active || !settings?.emergencyAlert?.message) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white py-2 relative overflow-hidden z-[100] border-b border-red-700">
      <div className="flex items-center">
        <div className="bg-red-600 px-4 flex items-center gap-2 z-10 shrink-0 border-r border-red-500 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)]">
          <AlertTriangle size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Alert</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 20, 
              ease: "linear" 
            }}
            className="whitespace-nowrap inline-block"
          >
            <span className="text-xs font-bold uppercase tracking-wide px-4">
              {settings.emergencyAlert.message} • {settings.emergencyAlert.message} • {settings.emergencyAlert.message} • {settings.emergencyAlert.message}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
