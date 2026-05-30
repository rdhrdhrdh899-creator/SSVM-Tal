import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Map, HelpCircle, Compass, Shield, Users, Radio, LayoutDashboard, Globe } from 'lucide-react';
import { PageLayout } from '../../components/public/PageLayout';
import { Card } from '../../components/ui/Card';
import { useSettingsStore } from '../../store/settingsStore';
import { SCHOOL_NAME } from '../../constants';

export const Sitemap = () => {
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;

  const sitemapSections = [
    {
      title: "Public Pages (सार्वजनिक पेज)",
      icon: Compass,
      bgColor: "from-blue-50 to-indigo-50/50",
      accentColor: "border-blue-400 text-blue-600 bg-blue-100",
      links: [
        { name: "Home Dashboard (मुख्य गृह)", path: "/", desc: "Welcome portal featuring current announcements, key highlights, principal introduction, and quick statistics." },
        { name: "Our Legacy (हमारे बारे में)", path: "/about", desc: "Our humble history, mission values, vision priorities, achievement timeline, and managing body info." },
        { name: "Principal's Message (प्राचार्य संदेश)", path: "/principal-message", desc: "Direct addressing message from the head desk regarding policies, student discipline, and academic standards." },
        { name: "Online Admissions (प्रवेश पंजीकरण)", path: "/admissions", desc: "Multi-step interactive digital admissions registration and enquiry form for current semesters." },
        { name: "Events & News (हालिया कार्यक्रम)", path: "/events", desc: "Detailed timeline and summary cards for current cultural programmes, sports tournaments, and webinars." },
        { name: "Global Gallery (चित्र दीर्घा)", path: "/gallery", desc: "Visual high-definition capture archive organized by semesters, campus views, annual days, and science labs." },
        { name: "Notices & Guidelines (आधिकारिक सूचनाएं)", path: "/notices", desc: "Daily dynamic boards for urgent alerts, circulars, syllabus updates, exam datesheets, and PDF attachments." },
        { name: "Key Achievements (मुख्य उपलब्धियां)", path: "/achievements", desc: "Honoring our students, state level records, board examination merit holders, and teacher rewards." },
        { name: "Contact & Support (संपर्क करें)", path: "/contact", desc: "Address coordinates, dynamic Google maps integration, administration emails, WhatsApp help widgets." },
        { name: "Apex Blog (ज्ञान संग्रह)", path: "/blog", desc: "Editorial and pedagogical write-ups, student articles, and educational materials compiled by school faculty." }
      ]
    },
    {
      title: "Academic & Access Portals (शैशव एवं एक्सेस पोर्टल)",
      icon: LayoutDashboard,
      bgColor: "from-amber-50 to-orange-50/50",
      accentColor: "border-amber-400 text-amber-600 bg-amber-100",
      links: [
        { name: "Unified Portal Login (एकीकृत लॉगिन)", path: "/login", desc: "Single entry portal configured with Firebase Authentication for registered Admin, Teacher, and Student credentials." },
        { name: "Admin Dashboard Workspace (प्रशासक डैशबोर्ड)", path: "/login", desc: "Protected admin terminal to handle user registry, settings, admissions audits, billing sheets, and blogs." },
        { name: "Teacher Workspace (शिक्षक पोर्टल)", path: "/login", desc: "Academic desk for dynamic homework uploads, notice boards, leave application request handling, and grade reports." },
        { name: "Student Portal (छात्र पोर्टल)", path: "/login", desc: "Interactive student profile to view fee balances, homework assignments, notice boards, and submit leaves." }
      ]
    },
    {
      title: "Regulatory & Legal Agreements (कानूनी एवं नियम सम्बन्धी)",
      icon: Shield,
      bgColor: "from-emerald-50 to-teal-50/50",
      accentColor: "border-emerald-400 text-emerald-600 bg-emerald-100",
      links: [
        { name: "Privacy Guidelines (गोपनीयता नीति)", path: "/privacy-policy", desc: "Thorough details explanation on the secure capture, encryption, storage, and scope of admission forms and user logins." },
        { name: "Terms of Use (सेवा की शर्तें)", path: "/terms-and-conditions", desc: "Active administrative rules specifying curriculum edits liability, payment procedures, and intellectual copyright properties." },
        { name: "Interactive Sitemap (साइट नक्शा)", path: "/sitemap", desc: "This current indexed layout enabling convenient single-click navigation throughout the entire public domain." }
      ]
    }
  ];

  return (
    <PageLayout>
      {/* Banner */}
      <div className="bg-navy-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-950 to-navy-950" />
        <div className="absolute inset-0 diagonal-pattern opacity-5" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-400/10 text-gold-400 text-xs font-black uppercase tracking-widest mb-6 border border-gold-400/25">
            <Map size={12} className="fill-gold-400/10" /> Site Directory
          </span>
          <h1 className="heading-serif text-5xl md:text-7xl font-bold text-white mb-6">Interactive Sitemap</h1>
          <div className="w-24 h-2 bg-gold-400 mx-auto rounded-full mb-8" />
          <p className="text-xl text-cream-50/70 max-w-3xl mx-auto font-medium leading-relaxed font-sans">
            A comprehensive, structured index of all pages, interactive platforms, and workspaces managed on the {currentSchoolName} digital platform.
          </p>
        </motion.div>
      </div>

      {/* Main Content Sections */}
      <section className="py-24 bg-cream-50/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-16">
            {sitemapSections.map((section, sectorIndex) => (
              <div key={sectorIndex} className="space-y-6">
                {/* Section Header with stylized elements */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold ${section.accentColor}`}>
                    <section.icon size={20} />
                  </div>
                  <h2 className="heading-serif text-2xl font-bold text-navy-950 tracking-tight">{section.title}</h2>
                </div>

                {/* Section Grid of links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.links.map((link, linkIndex) => (
                    <Link 
                      key={linkIndex} 
                      to={link.path}
                      className="group block h-full text-left"
                    >
                      <Card 
                        className={`p-6 h-full border border-gray-150 bg-gradient-to-br ${section.bgColor} group-hover:border-gold-400 group-hover:shadow-md transition-all duration-300 rounded-[1.5rem] flex flex-col justify-between`}
                      >
                        <div>
                          <h4 className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors mb-2 text-base">
                            {link.name}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-normal">
                            {link.desc}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center text-[10px] font-mono tracking-wider text-navy-950/40 group-hover:text-gold-600 font-bold justify-between">
                          <span>{link.path === '/login' ? 'AUTH SECURED' : 'PUBLIC PAGE'}</span>
                          <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300 font-black">
                            VISIT LINK ➔
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Helper Box */}
            <div className="bg-white border border-gray-200 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center border border-navy-100 text-gold-500">
                <HelpCircle size={24} />
              </div>
              <div className="flex-grow space-y-1">
                <h4 className="font-bold text-navy-900 text-lg heading-serif">Need help finding scholastic references?</h4>
                <p className="text-sm text-gray-500">If you cannot locate certain curricular material, syllabus patterns, contact our online live assistance desk or office directly.</p>
              </div>
              <div className="shrink-0 flex items-center gap-4">
                <Link to="/contact" className="bg-navy-950 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl hover:bg-navy-900 transition-colors">
                  Contact Office
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
