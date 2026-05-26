import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Smartphone, CreditCard, 
  QrCode, ArrowLeft, CheckCircle2, 
  Lock, ArrowRight, Wallet
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';

export const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount') || '1000';
  const method = queryParams.get('method') || 'UPI';
  const reason = queryParams.get('reason') || 'Institutional Fee';

  const [step, setStep] = useState<'scan' | 'processing' | 'success'>('scan');

  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePaymentSubmit = () => {
    setStep('processing');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {step === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy-100 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-navy-950 p-8 text-white relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldCheck size={100} />
                 </div>
                 <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-xs font-bold text-navy-300 hover:text-white transition-colors">
                   <ArrowLeft size={14} /> Back to Portal
                 </button>
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">Total Payable</p>
                      <h1 className="text-4xl font-black mt-1">₹{Number(amount).toLocaleString()}</h1>
                    </div>
                    {method === 'PhonePe' ? <Smartphone size={32} className="text-purple-400" /> : <QrCode size={32} className="text-gold-400" />}
                 </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                 <div className="text-center">
                    <div className="w-48 h-48 bg-gray-50 rounded-3xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-200 mb-4 p-4">
                       <div className="relative group cursor-pointer" onClick={handlePaymentSubmit}>
                          <QrCode size={140} className="text-navy-900 group-hover:opacity-50 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="primary" size="sm" className="bg-navy-950">Confirm Payment</Button>
                          </div>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Scan this QR to pay via {method}</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-navy-900 shadow-sm border border-gray-100">
                             <Wallet size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase">Reason</p>
                             <p className="text-sm font-bold text-navy-950">{reason}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-navy-900 shadow-sm border border-gray-100">
                             <Lock size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
                             <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                Secure Connection <CheckCircle2 size={14} />
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <Button 
                   variant="primary" 
                   className="w-full h-14 rounded-2xl text-lg font-black bg-navy-950 hover:bg-navy-900 shadow-xl shadow-navy-100"
                   onClick={handlePaymentSubmit}
                 >
                   I've Paid Already <ArrowRight size={20} className="ml-2" />
                 </Button>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">POWERED BY RAVEN PAYGATE 3.0</p>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-white rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl"
            >
               <div className="w-24 h-24 border-8 border-gold-400 border-t-navy-950 rounded-full animate-spin mx-auto" />
               <div>
                 <h2 className="text-2xl font-black text-navy-950">Verifying Payment...</h2>
                 <p className="text-gray-500 mt-2">Connecting with {method} bank servers. Do not close this window.</p>
               </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl"
            >
               <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={48} />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-navy-950">Success!</h2>
                 <p className="text-gray-500 mt-2">Payment of ₹{Number(amount).toLocaleString()} confirmed.</p>
                 <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Transaction ID</p>
                    <p className="text-sm font-mono font-bold text-navy-900 mt-1">RAV-9210-XP29-001X</p>
                 </div>
               </div>
               <Button 
                variant="primary" 
                className="w-full h-14 rounded-2xl font-black"
                onClick={() => navigate('/admin/fees')}
               >
                 Back to Fees Dashboard
               </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
