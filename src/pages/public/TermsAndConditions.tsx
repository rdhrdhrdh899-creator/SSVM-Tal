import React from 'react';
import { motion } from 'motion/react';
import { FileText, School, IndianRupee, ShieldAlert, Award, Radio, CheckSquare } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Card } from '../../components/ui/Card';
import { useSettingsStore } from '../../store/settingsStore';
import { SCHOOL_NAME, CONTACT_INFO } from '../../constants';

export const TermsAndConditions = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;

  const termsList = [
    {
      icon: School,
      title: "1. Acceptance of Terms & Guidelines",
      content: "These Terms and Conditions govern your use of the website and school portal. By accessing the site, submitting applications, or checking credentials, you accept and agree to follow all policies specified by our board and administration."
    },
    {
      icon: CheckSquare,
      title: "2. Admissions & Online Inquiries",
      content: "All online applications, registrations, and inquiries submitted via our forms must be complete and accurate. Submitting an admission inquiry or paying registration charges does not guarantee final admission, which remains subject to seat availability, document validation, and school-specific criteria."
    },
    {
      icon: IndianRupee,
      title: "3. Fees & Online Payments",
      content: "Tuition fees, lab fees, and registration costs must be deposited as per the schedule declared by the administration. Any processed online transactions or successful fees deposited through our gateway are subjects of official reconciliation. Refunds or charge reversals will be examined according to the school policy."
    },
    {
      icon: Award,
      title: "4. User Accounts & Security",
      content: "Students, teachers, and admins have custom portal credentials. You are solely responsible for protecting your password. Any unauthorized logins or actions performed from an authenticated session should be notified to the system support representative immediately."
    },
    {
      icon: ShieldAlert,
      title: "5. Intellectual Property & Copyright",
      content: "All content, dynamic notices, banners, emblems, achievements, logos, and gallery photos on this website are the intellectual property of Apex Vidya or respective contributors. Copying, distributing, republishing, or utilizing these assets elsewhere without official consent is strictly prohibited."
    },
    {
      icon: Radio,
      title: "6. Modifications of Website Contents",
      content: "Apex Vidya reserves the right to modify admission guidelines, curriculum structure, fee layouts, school schedules, and digital policies at any moment without prior declaration. Visitors should re-read this handbook and portal disclosures periodically."
    }
  ];

  return (
    <PageLayout>
      {/* Hero Header Banner */}
      <div className="bg-navy-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950 to-navy-950" />
        <div className="absolute inset-0 diagonal-pattern opacity-5" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-400/10 text-gold-400 text-xs font-black uppercase tracking-widest mb-6 border border-gold-400/25">
            <FileText size={12} className="fill-gold-400/10 animate-pulse" /> School Regulations
          </span>
          <h1 className="heading-serif text-5xl md:text-7xl font-bold text-white mb-6">Terms of Service</h1>
          <div className="w-24 h-2 bg-gold-400 mx-auto rounded-full mb-8" />
          <p className="text-xl text-cream-50/70 max-w-3xl mx-auto font-medium leading-relaxed">
            Please read these terms and conditions carefully before using our digital portals.
          </p>
        </motion.div>
      </div>

      {/* Main content body */}
      <section className="py-24 bg-cream-50/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-xl shadow-navy-950/[0.02]">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-150 pb-8 mb-12 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-navy-900 heading-serif">Terms & Conditions</h3>
                  <p className="text-gray-500 text-sm mt-1">Official terms of use for Apex Vidya public layout & dashboards.</p>
                </div>
                <div className="bg-gold-50 border border-gold-200 rounded-2xl px-5 py-2.5 text-right md:w-fit w-full text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gold-800">Effective Date</span>
                  <span className="text-sm font-bold text-navy-950 font-mono">May 30, 2026</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-12 text-lg">
                These terms serve as the digital agreement between <strong>{currentSchoolName}</strong> and you (the student, guardian, teacher, or portal guest). By interacting with any part of our platform, you accept these provisions as active and binding rules of collaboration.
              </p>

              {/* Grid of Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {termsList.map((item, index) => (
                  <Card key={index} className="p-8 hover:translate-y-[-4px] transition-transform duration-300 border-l-4 border-gold-400">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-xl flex items-center justify-center border border-navy-100 shadow-sm">
                        <item.icon size={22} className="text-gold-500" />
                      </div>
                      <h4 className="font-bold text-navy-900 text-lg heading-serif">{item.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                  </Card>
                ))}
              </div>

              {/* Disclaimer Notice Box */}
              <div className="p-8 bg-red-50/70 rounded-3xl border border-red-150 mb-12">
                <h4 className="font-bold text-red-950 mb-3 text-lg heading-serif">Limitation of Liability & Disclaimer</h4>
                <p className="text-sm text-red-900/90 leading-relaxed">
                  While we make continuous attempts to publish genuine, reliable, and error-free details, academic curriculum tables, exam datasheets, and administrative fees schedules, the information on this website is provided on an "as-is" and "as-available" basis. Apex Vidya disclaims all responsibility for manual oversight, delays, or dynamic changes that are currently undergoing updates in our offices.
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
