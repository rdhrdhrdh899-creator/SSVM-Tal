import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Users, Trophy, Calendar, CheckCircle, ArrowRight, Play, BookOpen, Microscope, Music, Bike, Smartphone, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { HeroSlider } from '../../components/HeroSlider';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Testimonials } from '../../components/public/Testimonials';
import { PrincipalSection } from '../../components/public/PrincipalSection';
import { SCHOOL_NAME, SCHOOL_TAGLINE, CBSE_AFFILIATION } from '../../constants';
import { useNoticeStore } from '../../store/noticeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../lib/utils';

const StatItem = ({ icon: Icon, value, label, suffix = '+' }: { icon: any, value: number, label: string, suffix?: string }) => {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  const count = useCountUp(value, 2000, isVisible);

  return (
    <div ref={setRef} className="flex flex-col items-center text-center p-6 border-r border-gold-400/20 last:border-0">
      <div className="text-gold-400 mb-4"><Icon size={32} /></div>
      <div className="heading-serif text-4xl font-extrabold text-gold-500 mb-1">
        {count}{suffix}
      </div>
      <p className="text-cream-50/70 text-xs font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
};

export const Home = () => {
  const notices = useNoticeStore((state) => state.notices).slice(0, 3);
  const fetchNotices = useNoticeStore((state) => state.fetchNotices);
  const { settings } = useSettingsStore();
  const currentSchoolName = settings?.schoolName || SCHOOL_NAME;

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="overflow-hidden">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats Bar */}
      <section className="bg-navy-900 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center">
            <StatItem icon={GraduationCap} value={2800} label="Students Enrolled" />
            <StatItem icon={Users} value={120} label="Expert Faculty" />
            <StatItem icon={Award} value={10000} label="Alumni Worldwide" />
            <StatItem icon={Calendar} value={28} label="Years Excellence" suffix="+" />
            <StatItem icon={CheckCircle} value={95} label="Board Pass Rate" suffix="%" />
            <StatItem icon={Trophy} value={200} label="Annual Achievements" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-cream-50 relative">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title={`The ${currentSchoolName} Advantage`} 
            subtitle="Providing a holistic environment where academic rigor meets extracurricular brilliance." 
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "CBSE Curriculum Excellence", desc: "Rigorous academic framework focused on conceptual clarity and competitive edge." },
              { icon: Microscope, title: "Smart Labs & Digital Classrooms", desc: "Advanced science and computer labs equipped with the latest technology." },
              { icon: Bike, title: "25+ Extracurricular Activities", desc: "From archery to robotics, we offer a wide range of platforms to discover talent." },
              { icon: Trophy, title: "Sports Academy", desc: "Professional coaching in cricket, football, basketball and swimming." },
              { icon: Smartphone, title: "Parent Connect App", desc: "Real-time updates on attendance, fees, and performance at your fingertips." },
              { icon: GraduationCap, title: "Career Counseling", desc: "Specialized guidance for IIT-JEE, NEET, and international university admissions." }
            ].map((feature, i) => (
              <Card key={i} hoverEffect goldBorder className="p-8">
                <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-white transition-all">
                  <feature.icon size={28} />
                </div>
                <h3 className="heading-serif text-xl font-bold text-navy-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
                <Link to="/about" className="text-gold-600 font-bold text-sm flex items-center hover:translate-x-1 transition-transform">
                  Learn More <ChevronRight size={16} />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Message Section */}
      <PrincipalSection />

      {/* Notice Board Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-maroon-500">
                <div className="flex items-center space-x-3">
                  <div className="bg-maroon-600 text-white p-2 rounded-lg"><Calendar size={24} /></div>
                  <h2 className="heading-serif text-3xl font-bold text-navy-900">Latest Notices & Circulars</h2>
                </div>
                <Link to="/notices" className="text-navy-600 font-bold hover:text-gold-500 transition-colors">View All Notices →</Link>
              </div>

              <div className="space-y-4">
                {notices.map((notice) => (
                  <Card key={notice.id} className="p-4 border-l-4 border-gold-400 hover:border-maroon-500 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={notice.category === 'Holiday' ? 'danger' : 'primary'}>{notice.category}</Badge>
                          <span className="text-xs text-gray-400 font-bold">{formatDate(notice.date)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">{notice.title}</h3>
                        <div 
                          className="text-gray-600 text-sm line-clamp-2 mt-1 prose prose-sm max-w-none [&>p]:inline" 
                          dangerouslySetInnerHTML={{ __html: notice.content }}
                        />
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">Read More</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-navy-900 text-white p-8">
                <h3 className="heading-serif text-xl font-bold text-gold-400 mb-6 flex items-center">
                  <Award className="mr-3" /> Quick Portals
                </h3>
                <div className="flex flex-col space-y-4">
                  {[
                    { name: 'Online Fee Payment', path: '/login' },
                    { name: 'Academic Calendar', path: '/events' },
                    { name: 'Result Portal', path: '/login' },
                    { name: 'TC Application', path: '/contact' }
                  ].map((link, i) => (
                    <Link key={i} to={link.path} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="font-bold">{link.name}</span>
                      <ArrowRight size={16} className="text-gold-500" />
                    </Link>
                  ))}
                </div>
              </Card>

              <Card className="p-8 border-dashed border-2 border-gold-400 bg-gold-50/50">
                <h3 className="heading-serif text-xl font-bold text-navy-900 mb-4">Admissions Open 2024-25</h3>
                <p className="text-gray-600 text-sm mb-6">Limited seats available for Class 1 to 11. Merit based scholarships available.</p>
                <Link to="/admissions">
                  <Button variant="emerald" className="w-full">Apply Online Now</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="py-24 bg-navy-950 text-white relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10 diagonal-pattern" />
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionTitle title="Hall of Fame — Our Pride" subtitle="Celebrating our stellar performers across academics and beyond." light />
          
          <div className="flex overflow-x-auto pb-12 gap-8 snap-x no-scrollbar">
            {[
              { name: "Rahul Deshmukh", score: "99.2%", stream: "CBSE Class XII - Science", year: "2023", quote: "Excellence is not an act, but a habit." },
              { name: "Simran Kaur", score: "98.8%", stream: "CBSE Class X", year: "2023", quote: "Dream big, study hard." },
              { name: "Aditya Verma", score: "98.5%", stream: "CBSE Class XII - Commerce", year: "2022", quote: "Discipline is the key." },
              { name: "Ishaan Gupta", score: "97.4%", stream: "CBSE Class XII - Science", year: "2023", quote: "Curiosity lights the path." }
            ].map((topper, i) => (
              <motion.div key={i} className="min-w-[300px] snap-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 text-center group hover:bg-white/10 transition-all">
                <div className="w-24 h-24 bg-navy-800 rounded-full mx-auto relative mb-6 border-4 border-gold-500 p-1">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topper.name}`} className="rounded-full" alt={topper.name} />
                  <div className="absolute -bottom-2 -right-2 bg-gold-500 text-navy-950 p-2 rounded-full shadow-lg">
                    <Trophy size={16} />
                  </div>
                </div>
                <h3 className="heading-serif text-xl font-bold mb-1">{topper.name}</h3>
                <div className="text-gold-400 font-bold text-3xl mb-4 italic">{topper.score}</div>
                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-6">{topper.stream} | {topper.year}</p>
                <p className="text-sm italic text-white/70">"{topper.quote}"</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12 bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-500">47+</div>
              <div className="text-xs uppercase tracking-wider text-white/50">National Olympiad Winners</div>
            </div>
            <div className="text-center border-x border-white/10 px-4">
              <div className="text-3xl font-bold text-gold-500">89+</div>
              <div className="text-xs uppercase tracking-wider text-white/50">Sports Champions</div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-3xl font-bold text-gold-500">120+</div>
              <div className="text-xs uppercase tracking-wider text-white/50">Art & Culture Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-cream-100 to-white relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-navy-900 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
            {/* Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 rounded-full blur-2xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl -ml-16 -mb-16" />
            
            <h2 className="heading-serif text-4xl md:text-5xl font-bold text-white mb-6">Ready to join our community?</h2>
            <p className="text-cream-50/70 text-lg mb-10 max-w-2xl mx-auto">
              Admission for the Academic Session 2024-2025 are now open. Experience our campus brilliance and academic rigor.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/admissions">
                <Button variant="emerald" size="lg" className="rounded-full px-12 group">
                  Start Application <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-12 text-white border-white/20 hover:bg-white/10">Inquire Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size?: number, className?: string }) => <ArrowRight size={size} className={className} />;
