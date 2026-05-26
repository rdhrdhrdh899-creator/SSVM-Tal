import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CONTACT_INFO, SCHOOL_NAME } from '../../constants';
import { useSettingsStore } from '../../store/settingsStore';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const Contact = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [natureOfInquiry, setNatureOfInquiry] = useState('General Information');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const contactDetails = [
    { icon: MapPin, title: 'Our Campus', content: settings?.schoolAddress || CONTACT_INFO.address, color: 'text-gold-500' },
    { icon: Phone, title: 'Call Center', content: settings?.schoolPhone || CONTACT_INFO.phone, color: 'text-emerald-500' },
    { icon: Mail, title: 'Email Support', content: settings?.schoolEmail || CONTACT_INFO.email, color: 'text-navy-700' },
    { icon: Clock, title: 'Office Hours', content: 'Mon - Sat: 08:30 AM to 03:00 PM', color: 'text-maroon-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      await addDoc(collection(db, 'inquiries'), {
        fullName,
        phoneNumber,
        emailAddress,
        natureOfInquiry,
        message,
        createdAt: new Date().toISOString(),
        status: 'Pending'
      });
      setSubmitSuccess(true);
      setFullName('');
      setPhoneNumber('');
      setEmailAddress('');
      setNatureOfInquiry('General Information');
      setMessage('');
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setSubmitError('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="bg-navy-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="heading-serif text-5xl font-bold text-white mb-4">Contact {currentSchoolName}</h1>
          <p className="text-xl text-cream-50/60 max-w-2xl mx-auto">Have questions? We're here to help you guide your child's educational journey.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="heading-serif text-4xl font-bold text-navy-900 mb-8 border-l-4 border-gold-400 pl-6">Send an Inquiry</h2>
            <Card className="p-8 md:p-10">
              {submitSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-800"
                >
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-bold text-sm">Thank you for your inquiry!</h5>
                    <p className="text-xs text-green-700/90 mt-0.5">We have received your request and our admin desk will respond to you shortly via phone/email.</p>
                  </div>
                </motion.div>
              )}

              {submitError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800"
                >
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-bold text-sm">Submission Failed</h5>
                    <p className="text-xs text-red-700/90 mt-0.5">{submitError}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    placeholder="Your name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+91 XXXX XXXX" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required 
                  />
                </div>
                <Input 
                  label="Email Address" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required 
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-navy-900 ml-1">Nature of Inquiry</label>
                  <select 
                    className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                    value={natureOfInquiry}
                    onChange={(e) => setNatureOfInquiry(e.target.value)}
                  >
                    <option>General Information</option>
                    <option>Admissions Inquiry</option>
                    <option>Fee Related</option>
                    <option>Careers</option>
                    <option>Complaints/Feedback</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-navy-900 ml-1">Your Message</label>
                  <textarea 
                    rows={4}
                    className="flex w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                    placeholder="Describe your query in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit"
                  className="w-full rounded-xl flex items-center justify-center"
                  isLoading={isSubmitting}
                >
                  Send Message <Send size={18} className="ml-2" />
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-10">
              <h2 className="heading-serif text-4xl font-bold text-navy-900 mb-8 border-l-4 border-maroon-600 pl-6">Information Desk</h2>
              
              <div className="grid gap-8">
                {contactDetails.map((item, i) => (
                    <div key={i} className="flex items-start space-x-6">
                      <div className={`w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center ${item.color}`}>
                        <item.icon size={28} />
                      </div>
                      <div>
                        <h4 className="text-navy-900 font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-gray-500 font-medium">{item.content}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-12 h-64 bg-gray-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative">
              <div className="absolute inset-0 bg-navy-950 opacity-20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-navy-900">
                <MapPin size={40} className="mb-2 text-gold-500" />
                <span className="font-bold uppercase tracking-widest text-xs">interactive map disabled</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};
