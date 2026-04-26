import React, { useEffect, useState } from 'react';
import { 
  Settings, Building2, BookOpen, ShieldCheck, 
  Share2, Palette, Database, Save, RefreshCcw,
  Globe, Phone, Mail, MapPin, Check, AlertCircle,
  Layout, MessageSquare, Twitter, Facebook, Instagram, Youtube,
  AppWindow, Key, UserCheck, Image as ImageIcon, Briefcase
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { SubscriptionGuard } from '../../components/ui/SubscriptionGuard';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';

export const SystemSettings = () => {
  const { settings, loading, fetchSettings, updateSettings } = useSettingsStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security' | 'integrations' | 'branding' | 'data'>('profile');
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };

  const handlePrincipalChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      principal: { ...prev.principal, [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'School Profile', icon: Building2 },
    { id: 'academic', label: 'Academic Setup', icon: BookOpen },
    { id: 'principal', label: "Principal's Office", icon: UserCheck },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'branding', label: 'Branding & UI', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">System Configuration</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Manage global school and portal settings</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold border border-green-100"
              >
                <Check size={14} /> Settings Saved Successfully
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            variant="primary" 
            onClick={() => handleAction(handleSave)} 
            isLoading={isSaving}
            className="shadow-xl shadow-navy-100"
          >
            {isLocked ? <Lock size={18} className="mr-2" /> : <Save size={18} className="mr-2" />} 
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-navy-900 text-white shadow-xl shadow-navy-100 scale-[1.02]' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-navy-900'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-gold-400' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <Card className="lg:col-span-3 p-8 border-0 shadow-sm relative overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                      <Building2 size={24} className="text-gold-500" /> School Identity
                    </h2>
                    <p className="text-sm text-gray-400">Basic information about the educational institution</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label="Official School Name"
                      value={formData.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      icon={<Building2 size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Official Email"
                      type="email"
                      value={formData.schoolEmail}
                      onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                      icon={<Mail size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Contact Number"
                      value={formData.schoolPhone}
                      onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                      icon={<Phone size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Official Website"
                      value={formData.websiteUrl || ''}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      icon={<Globe size={18} className="text-gray-400" />}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-navy-900 ml-1">Physical Address</label>
                    <textarea 
                      className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-navy-100 outline-none transition-all min-h-[100px] resize-none"
                      value={formData.schoolAddress}
                      onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                      placeholder="Enter full school address..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="space-y-6">
                   <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                      <BookOpen size={24} className="text-gold-500" /> Academic Setup
                    </h2>
                    <p className="text-sm text-gray-400">Manage sessions, classes and curriculum flow</p>
                  </div>

                  <div className="p-6 bg-gold-50 rounded-3xl border border-gold-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gold-900">Current Academic Session</h4>
                      <p className="text-xs text-gold-700 opacity-80">This session will be used for all new registrations and records.</p>
                    </div>
                    <select 
                      className="px-6 py-2 bg-white border-2 border-gold-200 rounded-xl font-bold text-navy-900 outline-none"
                      value={formData.activeSession}
                      onChange={(e) => handleInputChange('activeSession', e.target.value)}
                    >
                      <option value="2023-24">2023-2024</option>
                      <option value="2024-25">2024-2025</option>
                      <option value="2025-26">2025-2026</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-gray-100 shadow-none bg-gray-50/50">
                       <h4 className="font-bold text-navy-900 mb-2">Class Management</h4>
                       <p className="text-xs text-gray-500 mb-4">Current Classes: Prep to XII</p>
                       <Button variant="outline" size="sm" className="w-full">Configure Classes</Button>
                    </Card>
                    <Card className="p-6 border border-gray-100 shadow-none bg-gray-50/50">
                       <h4 className="font-bold text-navy-900 mb-2">Subject Mapping</h4>
                       <p className="text-xs text-gray-500 mb-4">Total Subjects Defined: 18</p>
                       <Button variant="outline" size="sm" className="w-full">Map Subjects</Button>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'principal' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                      <UserCheck size={24} className="text-gold-500" /> Principal's Office
                    </h2>
                    <p className="text-sm text-gray-400">Manage principal information and public message</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <Input 
                        label="Principal's Full Name"
                        value={formData.principal?.name || ''}
                        onChange={(e) => handlePrincipalChange('name', e.target.value)}
                        placeholder="e.g. Dr. Sarah Mitchell"
                        icon={<UserCheck size={18} className="text-gray-400" />}
                      />
                      <Input 
                        label="Designation"
                        value={formData.principal?.designation || ''}
                        onChange={(e) => handlePrincipalChange('designation', e.target.value)}
                        placeholder="e.g. Principal"
                        icon={<Briefcase size={18} className="text-gray-400" />}
                      />
                      <Input 
                        label="Profile Photo URL"
                        value={formData.principal?.photo || ''}
                        onChange={(e) => handlePrincipalChange('photo', e.target.value)}
                        placeholder="URL to principal's photo"
                        icon={<ImageIcon size={18} className="text-gray-400" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-navy-900 ml-1">Principal's Message (Full)</label>
                      <textarea 
                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-navy-100 outline-none transition-all min-h-[250px] resize-none"
                        value={formData.principal?.message || ''}
                        onChange={(e) => handlePrincipalChange('message', e.target.value)}
                        placeholder="Type the principal's message here..."
                      />
                      <p className="text-[10px] text-gray-400 italic">
                        * This message will appear on the dedicated "Principal's Message" page.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-navy-50 rounded-3xl border border-navy-100">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                        <img 
                          src={formData.principal?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'} 
                          className="w-full h-full object-cover" 
                          alt="Preview" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900">Live Preview</h4>
                        <p className="text-xs text-gray-500 mb-2">How it looks on the home page</p>
                        <div className="p-4 bg-white rounded-xl border border-navy-100">
                          <p className="text-sm text-gray-600 italic line-clamp-2">"{formData.principal?.message || 'No message set'}"</p>
                          <p className="text-[10px] font-bold text-navy-900 mt-2">— {formData.principal?.name || 'Name not set'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                   <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                      <ShieldCheck size={24} className="text-gold-500" /> Portal Security
                    </h2>
                    <p className="text-sm text-gray-400">Access control and system maintenance settings</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${formData.maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          <AppWindow size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900">System Maintenance Mode</h4>
                          <p className="text-xs text-gray-500">When enabled, only admins can access the portal.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleInputChange('maintenanceMode', !formData.maintenanceMode)}
                        className={`w-14 h-8 rounded-full transition-all relative ${formData.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.maintenanceMode ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                          <Globe size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900">Public Admissions Open</h4>
                          <p className="text-xs text-gray-500">Allow parents to submit admission forms online.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleInputChange('admissionsOpen', !formData.admissionsOpen)}
                        className={`w-14 h-8 rounded-full transition-all relative ${formData.admissionsOpen ? 'bg-navy-900' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.admissionsOpen ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                     <h4 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                        <AlertCircle size={18} /> Danger Zone
                     </h4>
                     <p className="text-xs text-red-600 opacity-80 mb-4">Irreversible actions that affect the entire application database.</p>
                     <div className="flex gap-3 text-red-600">
                        <Button variant="ghost" size="sm" className="bg-white border border-red-100 hover:bg-red-100">Reset All Passwords</Button>
                        <Button variant="ghost" size="sm" className="bg-white border border-red-100 hover:bg-red-100">Archive Session Data</Button>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-6">
                   <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                       <Share2 size={24} className="text-gold-500" /> External Integrations
                    </h2>
                    <p className="text-sm text-gray-400">Manage communication tools and social media links</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label="WhatsApp Support Number (without +)"
                      placeholder="91xxxxxxxxxx"
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      icon={<MessageSquare size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Notice Board Expiry (Days)"
                      type="number"
                      value={formData.noticeExpiryDays || 30}
                      onChange={(e) => handleInputChange('noticeExpiryDays', parseInt(e.target.value))}
                      icon={<RefreshCcw size={18} className="text-gray-400" />}
                    />
                  </div>

                  <div className="pt-4">
                    <h4 className="font-bold text-navy-950 mb-4 flex items-center gap-2">
                      <Globe size={18} className="text-blue-500" /> Social Media Channels
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input 
                        label="Facebook URL"
                        value={formData.socialLinks?.facebook}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        icon={<Facebook size={18} className="text-blue-600" />}
                        className="rounded-xl"
                      />
                      <Input 
                        label="Instagram URL"
                        value={formData.socialLinks?.instagram}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        icon={<Instagram size={18} className="text-pink-600" />}
                        className="rounded-xl"
                      />
                      <Input 
                        label="Twitter (X) URL"
                        value={formData.socialLinks?.twitter}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        icon={<Twitter size={18} className="text-black" />}
                        className="rounded-xl"
                      />
                      <Input 
                        label="YouTube URL"
                        value={formData.socialLinks?.youtube}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        icon={<Youtube size={18} className="text-red-600" />}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-6">
                   <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                       <Palette size={24} className="text-gold-500" /> Portal Branding
                    </h2>
                    <p className="text-sm text-gray-400">Customize the look and feel of your portal</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-navy-900 border-l-4 border-gold-400 pl-3">Theme Colors</h4>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Color</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                               <input 
                                  type="color" 
                                  className="w-10 h-10 rounded-lg cursor-pointer"
                                  value={formData.primaryColor || '#001F3F'}
                                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                               />
                               <span className="text-sm font-mono font-bold">{formData.primaryColor}</span>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secondary Color</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                               <input 
                                  type="color" 
                                  className="w-10 h-10 rounded-lg cursor-pointer"
                                  value={formData.secondaryColor || '#FFD700'}
                                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                               />
                               <span className="text-sm font-mono font-bold">{formData.secondaryColor}</span>
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-bold text-navy-900 border-l-4 border-maroon-400 pl-3">Welcome UI</h4>
                       <div className="space-y-4">
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dashboard Welcome Message</label>
                            <textarea 
                              className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-navy-100 outline-none transition-all min-h-[120px] resize-none"
                              value={formData.welcomeMessage}
                              onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                            />
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 bg-navy-50 rounded-[2.5rem] border border-navy-100">
                    <h4 className="font-bold text-navy-950 mb-4">School Logo & Assets</h4>
                    <div className="flex items-center gap-8">
                       <div className="w-32 h-32 bg-white rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                          <Building2 size={40} />
                          <span className="text-[10px] font-bold mt-2">LOGO</span>
                       </div>
                       <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-4">Recommended Size: 512x512px. Supports PNG, JPG or SVG formats.</p>
                          <div className="flex gap-3">
                             <Button variant="primary" size="sm">Upload Logo</Button>
                             <Button variant="ghost" size="sm" className="bg-white border border-gray-200">Remove</Button>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                   <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                       <Database size={24} className="text-gold-500" /> Data Management
                    </h2>
                    <p className="text-sm text-gray-400">Backup, export and analyze school data</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                       <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                          <Layout size={24} />
                       </div>
                       <h4 className="text-lg font-bold text-navy-950 mb-2">Student Registry Export</h4>
                       <p className="text-sm text-gray-500 mb-6">Download the complete list of registered students with profile details in CSV format.</p>
                       <Button variant="outline" className="w-full">Export Student Data</Button>
                    </Card>

                    <Card className="p-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                          <RefreshCcw size={24} />
                       </div>
                       <h4 className="text-lg font-bold text-navy-950 mb-2">Notice Library Backup</h4>
                       <p className="text-sm text-gray-500 mb-6">Archives all historical notices and circulars broadcasted in the current session.</p>
                       <Button variant="outline" className="w-full">Export Notices</Button>
                    </Card>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-bold text-navy-950 mb-4 flex items-center gap-2">
                       <ShieldCheck size={18} className="text-navy-400" /> System Activity Log
                    </h4>
                    <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-gray-100/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                             <tr>
                                <th className="px-6 py-4">Event Occurred</th>
                                <th className="px-6 py-4">Action Taken</th>
                                <th className="px-6 py-4">Modified By</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                             <tr>
                                <td className="px-6 py-4 font-bold text-gray-500">2 Mins Ago</td>
                                <td className="px-6 py-4 text-navy-900">System Config Updated</td>
                                <td className="px-6 py-4 font-bold text-navy-900">Super Admin</td>
                             </tr>
                             <tr>
                                <td className="px-6 py-4 font-bold text-gray-500">1 Hour Ago</td>
                                <td className="px-6 py-4 text-navy-900">New Student Registered</td>
                                <td className="px-6 py-4 font-bold text-navy-900">Teacher: Smith</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      <SubscriptionGuard 
        isOpen={isSubsGuardOpen} 
        onClose={() => setIsSubsGuardOpen(false)}
        schoolName={settings?.schoolName || 'St. Xavier International School'}
      />
    </div>
  );
};
