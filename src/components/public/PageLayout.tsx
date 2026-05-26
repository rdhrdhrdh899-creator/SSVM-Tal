import React from 'react';
import { motion } from 'motion/react';
import { useSettingsStore } from '../../store/settingsStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: LayoutProps) => {
  const { settings, dismissedMessage } = useSettingsStore();
  const isBannerActive = !!(settings?.emergencyAlert?.active && settings?.emergencyAlert?.message && dismissedMessage !== settings?.emergencyAlert?.message);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen transition-all duration-500 ease-in-out"
      style={{ paddingTop: isBannerActive ? '120px' : '80px' }}
    >
      {children}
    </motion.main>
  );
};
