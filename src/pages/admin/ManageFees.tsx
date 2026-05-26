import React, { useState } from 'react';
import { 
  Wallet, Search, Filter, Plus, 
  ArrowUpRight, ArrowDownLeft, 
  Download, CreditCard, Smartphone,
  CheckCircle2, Clock, XCircle,
  QrCode, Link as LinkIcon
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// Mock Data
const transactions = [
  { id: 'TXN001', student: 'Rahul Sharma', class: 'X-A', amount: 4500, type: 'Tuition Fee', method: 'UPI', status: 'Completed', date: '2024-04-20' },
  { id: 'TXN002', student: 'Priya Singh', class: 'VIII-C', amount: 1200, type: 'Transport', method: 'PhonePe', status: 'Pending', date: '2024-04-21' },
  { id: 'TXN003', student: 'Amit Kumar', class: 'XII-B', amount: 500, type: 'Library Fine', method: 'Cash', status: 'Completed', date: '2024-04-19' },
  { id: 'TXN004', student: 'Sonia Verma', class: 'XI-A', amount: 8000, type: 'Annual Fee', method: 'Card', status: 'Failed', date: '2024-04-18' },
];

export const ManageFees = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'PhonePe' | 'UPI' | 'Card'>('PhonePe');
  const [paymentAmount, setPaymentAmount] = useState('1000');
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
  const navigate = useNavigate();

  const handleProcessPayment = () => {
    navigate(`/admin/payment-gateway?amount=${paymentAmount}&method=${selectedMethod}&reason=School Fee Payment`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>;
      case 'Pending': return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'Failed': return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Fee <span className="text-gold-600">Management</span></h1>
          <p className="text-gray-500 font-medium">Collect, track and manage institutional revenue</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Export Report
          </Button>
          <Button variant="primary" size="sm" onClick={() => {
            setPaymentStep('select');
            setIsPaymentModalOpen(true);
          }}>
            <Plus size={16} className="mr-2" /> New Payment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg shadow-navy-900/5 bg-navy-950 text-white overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <Wallet size={20} className="text-gold-400" />
              </div>
              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">+12.5%</Badge>
            </div>
            <p className="text-navy-300 text-xs font-bold uppercase tracking-widest">Total Collection</p>
            <h3 className="text-3xl font-black mt-1 leading-none">₹12.4L</h3>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg shadow-navy-900/5 bg-white overflow-hidden relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <ArrowUpRight size={20} className="text-emerald-600" />
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border-0">Healthy</Badge>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Received This Month</p>
          <h3 className="text-3xl font-black mt-1 leading-none text-navy-950">₹4.8L</h3>
        </Card>

        <Card className="p-6 border-0 shadow-lg shadow-navy-900/5 bg-white overflow-hidden relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Clock size={20} className="text-amber-600" />
            </div>
            <Badge className="bg-amber-50 text-amber-600 border-0">High</Badge>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pending Amount</p>
          <h3 className="text-3xl font-black mt-1 leading-none text-navy-950">₹2.1L</h3>
        </Card>

        <Card className="p-6 border-0 shadow-lg shadow-navy-900/5 bg-white overflow-hidden relative group text-center flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mb-4">
             <QrCode size={32} className="text-navy-900" />
           </div>
           <p className="text-navy-950 font-bold text-sm">Scan To Collect</p>
           <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mt-1">Direct UPI Gateway</p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <Card className="lg:col-span-2 p-8 border-0 shadow-xl shadow-navy-900/5 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900">Recent Transactions</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input className="pl-10 h-10 w-64 bg-gray-50 border-0" placeholder="Search transactions..." />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter size={16} />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 italic text-gray-400 text-xs font-bold">
                  <th className="pb-4">STUDENT / CLASS</th>
                  <th className="pb-4">FEE TYPE</th>
                  <th className="pb-4">METHOD</th>
                  <th className="pb-4">AMOUNT</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((txn, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-bold text-navy-950">{txn.student}</p>
                      <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{txn.class}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium text-gray-600">{txn.type}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {txn.method === 'UPI' && <Smartphone size={14} className="text-navy-600" />}
                        {txn.method === 'PhonePe' && <Badge className="bg-purple-100 text-purple-700 text-[10px]">PhonePe</Badge>}
                        {txn.method === 'Cash' && <Badge className="bg-gray-100 text-gray-600 text-[10px]">Cash</Badge>}
                        {txn.method === 'Card' && <CreditCard size={14} className="text-navy-600" />}
                        {txn.method === 'UPI' && <span className="text-xs font-bold">BHIM UPI</span>}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-black text-navy-950 tracking-tight">₹{txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4">{getStatusBadge(txn.status)}</td>
                    <td className="py-4 text-xs text-gray-400 font-medium">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payment Reminders */}
        <div className="space-y-6">
          <Card className="p-8 border-0 shadow-xl shadow-navy-900/5 bg-gradient-to-br from-gold-400 to-gold-500 relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="heading-serif text-xl font-bold text-navy-950 mb-2">Automated Billing</h4>
               <p className="text-navy-900/70 text-sm mb-6">Send automated fee alerts via WhatsApp to parents.</p>
               <Button className="bg-navy-950 text-white w-full border-0 font-bold h-12 shadow-xl shadow-gold-600/20">
                 Run Billing Cycle
               </Button>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone size={80} />
             </div>
          </Card>

          <Card className="p-8 border-0 shadow-xl shadow-navy-900/5">
            <h4 className="text-navy-950 font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-gold-500" /> Quick Payment Link
            </h4>
            <div className="space-y-4">
               <div>
                 <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Recipient Student</label>
                 <Input className="bg-gray-50 border-0" placeholder="Student Name or ID" />
               </div>
               <div>
                 <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Purpose</label>
                 <select className="w-full h-11 bg-gray-50 border-0 rounded-2xl px-4 text-sm font-medium outline-none">
                   <option>Tuition Fee</option>
                   <option>Transport Fee</option>
                   <option>Exam Fee</option>
                 </select>
               </div>
               <Button 
                variant="primary" 
                className="w-full"
                onClick={() => navigate('/admin/payment-gateway?amount=5000&method=UPI&reason=Quick Fee Collection')}
               >
                 <LinkIcon size={16} className="mr-2" /> Generate UPI Link
               </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        title="Direct Payment Gateway"
        size="sm"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {paymentStep === 'select' && (
              <motion.div 
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Step 1: Choose Method</p>
                  <h4 className="text-2xl font-black text-navy-950 mt-1">₹{paymentAmount}</h4>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setSelectedMethod('PhonePe')}
                    className={`w-full p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedMethod === 'PhonePe' ? 'border-navy-950 bg-navy-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                        <Smartphone size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-navy-950">PhonePe</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Direct Intent flow</p>
                      </div>
                    </div>
                    {selectedMethod === 'PhonePe' && <CheckCircle2 size={20} className="text-navy-950" />}
                  </button>

                  <button 
                    onClick={() => setSelectedMethod('UPI')}
                    className={`w-full p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedMethod === 'UPI' ? 'border-navy-950 bg-navy-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <QrCode size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-navy-950">Any UPI App</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Google Pay, Paytm, etc.</p>
                      </div>
                    </div>
                    {selectedMethod === 'UPI' && <CheckCircle2 size={20} className="text-navy-950" />}
                  </button>

                  <button 
                    onClick={() => setSelectedMethod('Card')}
                    className={`w-full p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${selectedMethod === 'Card' ? 'border-navy-950 bg-navy-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                        <CreditCard size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-navy-950">Debit / Credit Card</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Powered by Razorpay</p>
                      </div>
                    </div>
                    {selectedMethod === 'Card' && <CheckCircle2 size={20} className="text-navy-950" />}
                  </button>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full h-14 rounded-3xl text-lg font-black"
                  onClick={handleProcessPayment}
                >
                  Confirm & Pay
                </Button>
              </motion.div>
            )}

            {paymentStep === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 border-4 border-gold-400 border-t-navy-950 rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="text-xl font-black text-navy-950">Waiting for {selectedMethod}...</h4>
                  <p className="text-sm text-gray-500 mt-2">Please complete the payment on your phone.</p>
                </div>
              </motion.div>
            )}

            {paymentStep === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-navy-950">Payment Successful!</h4>
                  <p className="text-sm text-gray-500 mt-2">Transaction ID: <span className="font-mono text-xs">PH-2910-VX92</span></p>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Back to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>
    </div>
  );
};
