import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, AlertCircle, Save, X, Power, Lock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { SubscriptionGuard } from '../ui/SubscriptionGuard';

export const QuickActions = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { user } = useAuthStore();
  const [alertMessage, setAlertMessage] = useState(settings?.emergencyAlert?.message || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubsGuardOpen, setIsSubsGuardOpen] = useState(false);

  // Subscription Logic
  const isSuperAdmin = user?.role === 'superadmin';
  const subStatus = settings?.subscription?.status;
  const expiryDate = settings?.subscription?.expiryDate ? new Date(settings.subscription.expiryDate) : null;
  const masterToggle = settings?.subscription?.masterToggle !== false;
  const isSubActive = subStatus === 'Active' || subStatus === 'Trial';
  const isExpired = expiryDate ? expiryDate < new Date() : false;
  
  const isLocked = !isSuperAdmin && (!isSubActive || isExpired || !masterToggle);

  const handleAction = (callback: () => void) => {
    if (isLocked) {
      setIsSubsGuardOpen(true);
    } else {
      callback();
    }
  };

  const handleUpdateAlert = async () => {
    setIsUpdating(true);
    try {
      await updateSettings({
        emergencyAlert: {
          message: alertMessage,
          active: true
        }
      });
    } catch (error) {
      console.error('Failed to update alert:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleAlert = async () => {
    setIsUpdating(true);
    try {
      await updateSettings({
        emergencyAlert: {
          ...settings?.emergencyAlert,
          message: alertMessage,
          active: !settings?.emergencyAlert?.active
        }
      });
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6 border-0 shadow-lg bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Zap size={100} />
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gold-400 rounded-lg text-navy-950">
          <Zap size={20} />
        </div>
        <h3 className="heading-serif text-xl font-bold text-navy-900">Quick Actions</h3>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600" />
              <span className="text-sm font-bold text-red-950 uppercase tracking-tight">Emergency Alert Banner</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              settings?.emergencyAlert?.active ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'
            }`}>
              {settings?.emergencyAlert?.active ? 'Live' : 'Inactive'}
            </div>
          </div>
          
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Type emergency alert message..."
              className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleAction(handleUpdateAlert)}
                disabled={isUpdating || !alertMessage}
                variant="primary" 
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 shadow-md"
              >
                {isLocked ? <Lock size={14} className="mr-2" /> : <Save size={14} className="mr-2" />} 
                Update Message
              </Button>
              <Button 
                onClick={() => handleAction(handleToggleAlert)}
                disabled={isUpdating || !alertMessage}
                variant={settings?.emergencyAlert?.active ? "outline" : "primary"}
                size="sm"
                className={`flex-1 ${!settings?.emergencyAlert?.active ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white' : 'border-red-200 text-red-600'}`}
              >
                {isLocked ? <Lock size={14} className="mr-2" /> : <Power size={14} className="mr-2" />} 
                {settings?.emergencyAlert?.active ? 'Turn OFF' : 'Turn ON'}
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-red-600/70 font-medium mt-3 italic">
            * This banner will appear as a scrolling bar at the very top of the public website.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => handleAction(() => {})}
            variant="ghost" 
            className="h-20 flex-col gap-2 bg-navy-50 text-navy-900 border-navy-100 font-bold hover:bg-gold-400 hover:text-navy-950 transition-all group"
          >
            {isLocked ? <Lock size={20} className="text-red-400" /> : <Save size={20} />}
            <span className="text-[10px] uppercase tracking-widest leading-none">Database Backup</span>
          </Button>
          <Button 
            onClick={() => handleAction(() => {})}
            variant="ghost" 
            className="h-20 flex-col gap-2 bg-navy-50 text-navy-900 border-navy-100 font-bold hover:bg-gold-400 hover:text-navy-950 transition-all group"
          >
            {isLocked ? <Lock size={20} className="text-red-400" /> : <X size={20} />}
            <span className="text-[10px] uppercase tracking-widest leading-none">Flush Cache</span>
          </Button>
        </div>
      </div>

      <SubscriptionGuard 
        isOpen={isSubsGuardOpen} 
        onClose={() => setIsSubsGuardOpen(false)}
        schoolName={settings?.schoolName || 'St. Xavier International School'}
      />
    </Card>
  );
};
