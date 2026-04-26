import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Bell, Layout, BookOpen, 
  Eye, EyeOff, Save, Check, AlertCircle,
  Phone, Mail, MapPin, Camera, Lock,
  Monitor, Moon, Sun, Smartphone, Calendar,
  MessageSquare, FileCheck, ClipboardList
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const TeacherSettings = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'notifications' | 'privacy'>('profile');
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultSettings = {
    bio: '',
    phoneVisibility: true,
    notifications: {
      studentQueries: true,
      leaveRequests: true,
      newNotices: true,
    },
    attendanceReminderTime: '08:30',
    theme: 'light',
    dashboardOrder: ['notices', 'attendance', 'timetable'],
    autoGrading: false,
    lessonPlanTemplate: 'Standard',
    securityQuestion: '',
    securityAnswer: ''
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        subject: user.subject || '',
        photo: user.photo || '',
        teacherSettings: user.teacherSettings || defaultSettings
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      teacherSettings: { ...prev.teacherSettings, [field]: value }
    }));
  };

  const handleNestedSettingsChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      teacherSettings: {
        ...prev.teacherSettings,
        [parent]: { ...prev.teacherSettings[parent], [field]: value }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return null;

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'academic', label: 'Academic Tools', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Security & Privacy', icon: Shield },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Settings</h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">Customize your teacher dashboard and preferences</p>
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
                <Check size={14} /> Profile Updated
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={isSaving}
            className="shadow-xl shadow-navy-100"
          >
            <Save size={18} className="mr-2" /> Save Settings
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm",
                activeTab === tab.id 
                  ? 'bg-navy-900 text-white shadow-xl shadow-navy-100 scale-[1.02]' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-navy-900'
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-gold-400' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="lg:col-span-3 p-8 border-0 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-navy-50 border-4 border-white shadow-lg overflow-hidden">
                        <img 
                          src={formData.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-navy-900 text-gold-400 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform">
                        <Camera size={14} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-950">{formData.name}</h3>
                      <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Teacher Profile</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      icon={<User size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Email Address"
                      value={formData.email}
                      disabled
                      icon={<Mail size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      icon={<Phone size={18} className="text-gray-400" />}
                    />
                    <Input 
                      label="Primary Subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      icon={<BookOpen size={18} className="text-gray-400" />}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-navy-900 ml-1">Short Bio / Introduction</label>
                    <textarea 
                      className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-navy-100 outline-none transition-all min-h-[100px] resize-none"
                      value={formData.teacherSettings.bio}
                      onChange={(e) => handleSettingsChange('bio', e.target.value)}
                      placeholder="Tell students about yourself..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-navy-950 mb-6 border-b border-gray-100 pb-2">Academic Tool Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                          <FileCheck size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900">Auto-Grading for Quizzes</h4>
                          <p className="text-xs text-gray-500">Enable automatic scoring for multiple choice questions.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSettingsChange('autoGrading', !formData.teacherSettings.autoGrading)}
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative",
                          formData.teacherSettings.autoGrading ? 'bg-navy-900' : 'bg-gray-200'
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-6 h-6 bg-white rounded-full transition-all",
                          formData.teacherSettings.autoGrading ? 'left-7' : 'left-1'
                        )} />
                      </button>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                          <ClipboardList size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900">Lesson Plan Template</h4>
                          <p className="text-xs text-gray-500">Select your default template for creating daily plans.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {['Standard', 'Visual', 'Detailed'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleSettingsChange('lessonPlanTemplate', t)}
                            className={cn(
                              "py-2 px-4 rounded-xl text-xs font-bold transition-all border-2",
                              formData.teacherSettings.lessonPlanTemplate === t 
                                ? 'border-navy-900 bg-navy-900 text-white' 
                                : 'border-gray-200 text-gray-500 hover:border-navy-100'
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-navy-950 mb-6 border-b border-gray-100 pb-2">Communication & Alerts</h3>
                   
                   <div className="grid gap-4">
                     {[
                       { key: 'studentQueries', label: 'Student Queries', desc: 'Get notified when students ask questions via portal.', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
                       { key: 'leaveRequests', label: 'Leave Requests', desc: 'Alerts for student leave applications.', icon: FileCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
                       { key: 'newNotices', label: 'New Notices', desc: 'Notifications for new school circulars.', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' }
                     ].map((pref) => (
                       <div key={pref.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                         <div className="flex items-center gap-4">
                           <div className={cn("p-3 rounded-2xl", pref.bg, pref.color)}>
                              <pref.icon size={20} />
                           </div>
                           <div>
                             <h4 className="font-bold text-navy-900">{pref.label}</h4>
                             <p className="text-xs text-gray-500">{pref.desc}</p>
                           </div>
                         </div>
                         <button 
                            onClick={() => handleNestedSettingsChange('notifications', pref.key, !formData.teacherSettings.notifications[pref.key as keyof typeof formData.teacherSettings.notifications])}
                            className={cn(
                              "w-12 h-6 rounded-full transition-all relative",
                              formData.teacherSettings.notifications[pref.key as keyof typeof formData.teacherSettings.notifications] ? 'bg-navy-900' : 'bg-gray-200'
                            )}
                          >
                            <div className={cn(
                              "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all",
                              formData.teacherSettings.notifications[pref.key as keyof typeof formData.teacherSettings.notifications] ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                          </button>
                       </div>
                     ))}
                   </div>

                   <div className="mt-8 p-6 bg-gold-50/50 rounded-3xl border border-gold-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gold-100 text-gold-600 rounded-2xl">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-navy-900">Daily Attendance Reminder</h4>
                            <p className="text-xs text-gray-500">Choose your preferred time to be reminded for marking daily attendance.</p>
                          </div>
                        </div>
                        <input 
                          type="time" 
                          className="px-6 py-3 bg-white border border-gold-200 rounded-2xl outline-none font-black text-navy-900 shadow-sm focus:ring-4 focus:ring-gold-100 transition-all cursor-pointer"
                          value={formData.teacherSettings.attendanceReminderTime}
                          onChange={(e) => handleSettingsChange('attendanceReminderTime', e.target.value)}
                        />
                      </div>
                    </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-navy-950 mb-6 border-b border-gray-100 pb-2">Security & Privacy</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                          <Eye size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900">Show Phone to Parents</h4>
                          <p className="text-xs text-gray-500">Allow parents/students to see your contact number.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSettingsChange('phoneVisibility', !formData.teacherSettings.phoneVisibility)}
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative",
                          formData.teacherSettings.phoneVisibility ? 'bg-navy-900' : 'bg-gray-200'
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-6 h-6 bg-white rounded-full transition-all",
                          formData.teacherSettings.phoneVisibility ? 'left-7' : 'left-1'
                        )} />
                      </button>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
                      <h4 className="font-bold text-navy-950 flex items-center gap-2">
                         <Lock size={18} className="text-gold-500" /> Account Security
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Security Question</label>
                          <select 
                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-navy-900 outline-none"
                            value={formData.teacherSettings.securityQuestion}
                            onChange={(e) => handleSettingsChange('securityQuestion', e.target.value)}
                          >
                             <option value="">Select a question...</option>
                             <option value="pet">What was your first pet's name?</option>
                             <option value="school">What school did you first attend?</option>
                             <option value="city">In what city were you born?</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Security Answer</label>
                          <Input 
                            value={formData.teacherSettings.securityAnswer || ''}
                            onChange={(e) => handleSettingsChange('securityAnswer', e.target.value)}
                            placeholder="Your answer..."
                            type="password"
                            className="bg-gray-50 border-0 rounded-xl"
                          />
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Change Password</Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};
