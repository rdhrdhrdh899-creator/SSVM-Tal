import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const EmergencyBanner = () => {
  const { settings, dismissedMessage, dismissEmergency } = useSettingsStore();

  const isActive = settings?.emergencyAlert?.active;
  const message = settings?.emergencyAlert?.message;

  if (!isActive || !message || dismissedMessage === message) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white h-10 fixed top-0 left-0 right-0 flex items-center overflow-hidden z-[100] border-b border-red-800/30 shadow-md">
      <div className="w-full h-full relative flex items-center px-2 md:px-4 pr-12">
        {/* Glow pulsing Alert Badge */}
        <div className="bg-red-850 h-7 px-3 rounded-full flex items-center gap-1.5 z-10 shrink-0 border border-white/20 shadow-sm relative overflow-hidden mr-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <AlertTriangle size={12} className="text-white shrink-0" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/95 font-sans">
            Alert
          </span>
        </div>
        
        {/* Smooth marquee animation with padding container */}
        <div className="flex-grow overflow-hidden relative">
          <motion.div 
            initial={{ x: "20%" }}
            animate={{ x: "-100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 25, 
              ease: "linear" 
            }}
            className="whitespace-nowrap inline-block py-1"
          >
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider px-6 select-none font-sans text-white/95 leading-none">
              {message} <span className="mx-6 text-amber-400">•</span> {message} <span className="mx-6 text-amber-400">•</span> {message} <span className="mx-6 text-amber-400">•</span> {message}
            </span>
          </motion.div>
        </div>

        {/* Absolute close button */}
        <button
          onClick={() => dismissEmergency(message)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 active:scale-95 text-white/90 hover:text-white p-1.5 rounded-full transition-all duration-200 z-20 border border-white/10"
          aria-label="Dismiss Alert"
        >
          <X size={14} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
