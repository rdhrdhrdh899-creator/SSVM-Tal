import React, { useState } from 'react';
import { CreditCard, ShieldAlert, CheckCircle2, Lock, ArrowRight, Zap, ShieldCheck, Smartphone, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';

interface SubscriptionGuardProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
}

export const SubscriptionGuard = ({ isOpen, onClose, schoolName }: SubscriptionGuardProps) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'Razorpay' | 'PhonePe' | 'UPI'>('Razorpay');
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate(`/admin/payment-gateway?amount=4999&method=${method}&reason=Annual Portal Subscription`);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Portal Subscription Expired"
      size="md"
    >
      <div className="space-y-8 p-4">
        {/* Header Alert */}
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h3 className="heading-serif text-2xl font-bold text-navy-950 mb-2">Access Locked</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
              Your portal access has been limited by the <span className="text-red-600 font-bold">Super Admin</span> or your subscription has expired.
            </p>
          </div>
        </div>

        {/* Plan Comparison or Renew CTA */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 bg-navy-950 text-white rounded-[2rem] border-0 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Zap size={60} />
             </div>
             <Badge className="bg-gold-500 text-navy-950 px-3 py-1 mb-4">Recommended</Badge>
             <h4 className="text-xl font-bold mb-1">Annual Pro</h4>
             <p className="text-navy-300 text-xs mb-6">Full feature set with God Mode support</p>
             
             <div className="flex items-baseline gap-1 mb-6">
               <span className="text-3xl font-black">₹4,999</span>
               <span className="text-navy-400 text-xs text-navy-400">/year</span>
             </div>

             {/* Payment Method Selector */}
             <div className="space-y-2 mb-6">
                {[
                  { id: 'Razorpay', icon: CreditCard, label: 'Cards / NetBanking' },
                  { id: 'PhonePe', icon: Smartphone, label: 'PhonePe Direct' },
                  { id: 'UPI', icon: QrCode, label: 'Any UPI App' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={`w-full p-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                      method === m.id ? 'bg-white text-navy-950 border-2 border-gold-400' : 'bg-navy-900/50 text-navy-300 border-2 border-transparent'
                    }`}
                  >
                    <m.icon size={16} className={method === m.id ? 'text-gold-500' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
             </div>

             <Button 
               className="w-full bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold border-0 h-12"
               onClick={handlePayment}
               disabled={loading}
             >
               {loading ? 'Processing...' : `Pay via ${method}`} <ArrowRight size={16} className="ml-2" />
             </Button>
          </div>

          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
             <h4 className="text-navy-950 font-bold mb-4">What's Locked?</h4>
             <ul className="space-y-3">
               {[
                 'Faculty Management',
                 'Notice Broadcaster',
                 'Admission Processor',
                 'Academic Slider Control',
                 'System Preferences'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                   <Lock size={12} className="text-red-400" />
                   {item}
                 </li>
               ))}
             </ul>
             <div className="mt-8 pt-8 border-t border-gray-200">
               <p className="text-[10px] text-gray-400 italic">
                 Contact support for bulk institutional pricing or government waivers.
               </p>
             </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest text-gray-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          Secured by Razorpay • God Mode Engine
        </div>
      </div>
    </Modal>
  );
};
