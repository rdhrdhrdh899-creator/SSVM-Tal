import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Key, Database, MailCheck, Globe } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Card } from '../../components/ui/Card';
import { useSettingsStore } from '../../store/settingsStore';
import { SCHOOL_NAME, CONTACT_INFO } from '../../constants';

export const PrivacyPolicy = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;

  const policies = [
    {
      icon: Eye,
      title: "Information Collection & Capture",
      description: "We collect information you explicitly provide to us when submitting Admission Applications, Contact/Inquiry Forms, or logging into our Digital Portals. This includes student names, guardian contact details, dates of birth, previous academic records, and email addresses."
    },
    {
      icon: Database,
      title: "Academic & Portal Data Storage",
      description: "All submitted data is stored securely using cloud-hosted databases (such as Firestore) with strictly configured access rules. Your data is used exclusively to facilitate school admissions, manage student achievements, assign homework, publish notices, and handle fees."
    },
    {
      icon: Lock,
      title: "Security & Encryption",
      description: "We implement robust security measures to prevent unauthorized access, alternation, disclosure, or destruction of your personal data. Login credentials (passwords) are handled securely with standard cryptographic hashes, and private dashboards are protected by real-time authentication."
    },
    {
      icon: Key,
      title: "Data Access Controls",
      description: "Only authorized school administrators, class teachers, and verified parents/students have access to their respective portal areas. Each user's visibility is limited strictly by role-based authorization to protect personal identity."
    },
    {
      icon: MailCheck,
      title: "No Third-Party Sharing",
      description: "We DO NOT sell, trade, rent, or lease your personal identification information to third parties. We may share generic aggregated demographic information (such as student count statistics) not linked to any personal identification."
    },
    {
      icon: Globe,
      title: "Cookies & Session Management",
      description: "Our digital portal uses secure client-side tokens (like localStorage or secure session state) to maintain logins and remember dashboard preferences. We do not use persistent tracking pixel cookies for marketing or advertising purposes."
    }
  ];

  return (
    <PageLayout>
      {/* Hero Banner Header */}
      <div className="bg-navy-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950 to-navy-950" />
        <div className="absolute inset-0 diagonal-pattern opacity-5" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-400/10 text-gold-400 text-xs font-black uppercase tracking-widest mb-6 border border-gold-400/25">
            <Shield size={12} className="fill-gold-400/10 animate-pulse" /> Security & Trust
          </span>
          <h1 className="heading-serif text-5xl md:text-7xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="w-24 h-2 bg-gold-400 mx-auto rounded-full mb-8" />
          <p className="text-xl text-cream-50/70 max-w-3xl mx-auto font-medium leading-relaxed">
            How {currentSchoolName} safeguards the personal data of our students, parents, faculty, and website visitors.
          </p>
        </motion.div>
      </div>

      {/* Main Content Info */}
      <section className="py-24 bg-cream-50/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-xl shadow-navy-950/[0.02]">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-150 pb-8 mb-12 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-navy-900 heading-serif">Website & Portal Policy</h3>
                  <p className="text-gray-500 text-sm mt-1">Applicable to all online interactions and registration forms.</p>
                </div>
                <div className="bg-gold-50 border border-gold-200 rounded-2xl px-5 py-2.5 text-right md:w-fit w-full text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gold-800">Last Revised</span>
                  <span className="text-sm font-bold text-navy-950 font-mono">May 30, 2026</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-12 text-lg">
                At <strong>{currentSchoolName}</strong>, we are committed to maintaining the confidentiality, integrity, and security of any personal information shared with us on our web portal. This policy describes how we collect, protect, and handle data when visitors interact with our admissions forms, contact tools, student logins, and administrative portals.
              </p>

              {/* Grid of policies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {policies.map((p, index) => (
                  <Card key={index} className="p-8 hover:translate-y-[-4px] transition-transform duration-300 border-l-4 border-gold-400">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-xl flex items-center justify-center border border-navy-100 shadow-sm">
                        <p.icon size={22} className="text-gold-500" />
                      </div>
                      <h4 className="font-bold text-navy-900 text-lg heading-serif">{p.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
                  </Card>
                ))}
              </div>

              {/* Legal & Consent Notice */}
              <div className="p-8 bg-gold-50/50 rounded-3xl border border-gold-200 mb-12">
                <h4 className="font-bold text-gold-950 mb-3 text-lg heading-serif">Consent & Academic Commitment</h4>
                <p className="text-sm text-gold-900/90 leading-relaxed">
                  By utilizing our website, completing an admission registration, or accessing the portal, you consent to our privacy policy guidelines. Parents and guardians of applicants below 18 years of age accept this on behalf of their wards. For statutory compliance, any official adjustments made to school policies will be updated directly on this page.
                </p>
              </div>

              {/* Bottom Notice */}
              <div className="text-center bg-navy-900 text-cream-50 p-8 rounded-3xl space-y-4">
                <h4 className="heading-serif font-bold text-lg text-gold-400">Questions or Clarifications?</h4>
                <p className="text-xs text-cream-50/70 max-w-md mx-auto leading-relaxed">
                  If you have queries regarding this statement, our database, or wish to request data correction/removal, you are welcome to reach out to our administration.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 items-center justify-center text-xs font-mono font-bold">
                  <span className="bg-white/5 px-4 py-2 rounded-xl text-gold-300">📧 {settings?.schoolEmail || CONTACT_INFO.email}</span>
                  <span className="bg-white/5 px-4 py-2 rounded-xl text-gold-300">📞 {settings?.schoolPhone || CONTACT_INFO.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
