import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Shield, Globe, Power, Calendar, 
  Search, Filter, ExternalLink, ShieldCheck, 
  ShieldAlert, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { SystemSettings } from '../../types';

export const SuperAdminDashboard = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      // Typically settings are in settings/config
      // In a multi-tenant system they would be in a collection
      // For this app, settings/config is the primary one, 
      // but the prompt implies "lists all registered schools/admins"
      // Suggesting we look at the users collection where role is admin
      const q = query(collection(db, 'users'), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      const adminUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // In a real multi-tenant setup, school settings would be linked.
      // Here we will fetch the global settings as the primary school.
      const settingsDoc = await getDocs(collection(db, 'settings'));
      const allSettings = settingsDoc.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Combine for dashboard view
      setSchools(allSettings.map(s => ({
        ...s,
        admin: (adminUsers as any[]).find(u => u.schoolId === s.id) || adminUsers[0] // Fallback for single tenant demo
      })));

    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMasterSwitch = async (schoolId: string, currentStatus: boolean) => {
    try {
      const schoolRef = doc(db, 'settings', schoolId);
      await updateDoc(schoolRef, {
        'subscription.masterToggle': !currentStatus
      });
      setSchools(prev => prev.map(s => 
        s.id === schoolId ? { ...s, subscription: { ...s.subscription, masterToggle: !currentStatus } } : s
      ));
    } catch (error) {
      console.error('Error toggling master switch:', error);
    }
  };

  const updateSubscription = async (schoolId: string, status: string, expiry: string) => {
    if (!status || !expiry) {
      console.warn('Attempted to update subscription with missing data', { status, expiry });
      return;
    }
    try {
      const schoolRef = doc(db, 'settings', schoolId);
      await updateDoc(schoolRef, {
        'subscription.status': status,
        'subscription.expiryDate': expiry
      });
      setSchools(prev => prev.map(s => 
        s.id === schoolId ? { ...s, subscription: { ...(s.subscription || {}), status, expiryDate: expiry } } : s
      ));
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border-2 border-red-100 max-w-md">
          <ShieldAlert size={64} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-950 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have Super Admin privileges to access this control panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-serif text-4xl font-bold text-navy-950">God Mode <span className="text-gold-600">Panel</span></h1>
          <p className="text-gray-500 font-medium">Master Authority & Subscription Control</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-navy-900 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <ShieldCheck size={16} /> Super Admin Active
          </Badge>
          <Button variant="outline" onClick={fetchSchools} className="bg-white">
            <Globe size={16} className="mr-2" /> Refresh Data
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-navy-950 text-white border-0 overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Users size={160} />
          </div>
          <div className="relative z-10">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-widest mb-1">Total Schools</p>
            <h2 className="text-4xl font-black">{schools.length}</h2>
          </div>
        </Card>
        <Card className="p-6 bg-white border-0 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-5 text-emerald-600">
            <CheckCircle size={160} />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Active Subscriptions</p>
          <h2 className="text-4xl font-black text-emerald-600">
            {schools.filter(s => s.subscription?.status === 'Active').length}
          </h2>
        </Card>
        <Card className="p-6 bg-white border-0 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-5 text-red-600">
            <XCircle size={160} />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Locked Schools</p>
          <h2 className="text-4xl font-black text-red-600">
            {schools.filter(s => s.subscription?.masterToggle === false).length}
          </h2>
        </Card>
      </div>

      <Card className="p-6 border-0 shadow-sm bg-white rounded-[2rem]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="heading-serif text-2xl font-bold text-navy-950">School Administration List</h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by school name or admin email..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-navy-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">School / Admin</th>
                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Expiry</th>
                <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Master Toggle</th>
                <th className="text-right py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {schools.filter(s => 
                s.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                s.admin?.email?.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((school) => (
                <tr key={school.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-navy-900 font-bold">
                        {school.schoolName?.[0] || 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-navy-950 text-sm">{school.schoolName || 'Unnamed School'}</p>
                        <p className="text-[10px] text-gray-500 font-bold tracking-tight">{school.admin?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      className={`text-xs font-black px-3 py-1 rounded-full outline-none appearance-none cursor-pointer ${
                        school.subscription?.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                        school.subscription?.status === 'Trial' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}
                      value={school.subscription?.status || 'Inactive'}
                      onChange={(e) => updateSubscription(school.id, e.target.value, school.subscription?.expiryDate || new Date().toISOString())}
                    >
                      <option value="Active">Active</option>
                      <option value="Trial">Trial</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="date" 
                      className="text-xs font-bold text-gray-600 bg-transparent border-b border-dashed border-gray-300 focus:border-navy-500 outline-none"
                      value={school.subscription?.expiryDate?.split('T')[0] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const d = new Date(val);
                        if (isNaN(d.getTime())) return;
                        const newDate = d.toISOString();
                        updateSubscription(school.id, school.subscription?.status || 'Inactive', newDate);
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => toggleMasterSwitch(school.id, school.subscription?.masterToggle !== false)}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                        school.subscription?.masterToggle !== false ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                        school.subscription?.masterToggle !== false ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button variant="ghost" size="sm" className="text-navy-400 hover:text-navy-900">
                      <ExternalLink size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
              {schools.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Search size={48} />
                      <p className="font-bold text-sm tracking-widest uppercase">No schools found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
