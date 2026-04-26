import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { SCHOOL_NAME, CONTACT_INFO } from '../../constants';
import { useSettingsStore } from '../../store/settingsStore';

export const Footer = () => {
  const { settings } = useSettingsStore();
  
  const socialLinks = [
    { icon: Facebook, href: settings?.socialLinks?.facebook || '#' },
    { icon: Twitter, href: settings?.socialLinks?.twitter || '#' },
    { icon: Instagram, href: settings?.socialLinks?.instagram || '#' },
    { icon: Youtube, href: settings?.socialLinks?.youtube || '#' },
  ];
  return (
    <footer className="bg-navy-950 text-cream-50/90 pt-20 pb-8 relative overflow-hidden">
      {/* Decorative Gold SVG Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-400" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* About Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-gold-400/50">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold-400" fill="currentColor">
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                </svg>
              </div>
              <span className="heading-serif font-bold text-2xl text-white uppercase">{settings?.schoolName || SCHOOL_NAME}</span>
            </Link>
            <p className="text-cream-50/60 leading-relaxed">
              Dedicated to academic excellence and character building. We nurture future leaders with traditional values and modern innovation.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="heading-serif text-xl font-bold text-white mb-8 border-b-2 border-gold-500 w-fit pb-2">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Admissions', 'Gallery', 'Current Events', 'Achievements'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-gold-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3 group-hover:scale-150 transition-transform" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="heading-serif text-xl font-bold text-white mb-8 border-b-2 border-gold-500 w-fit pb-2">Contact Us</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="mt-1 text-gold-500"><MapPin size={20} /></div>
                <p className="text-cream-50/70">{settings?.schoolAddress || CONTACT_INFO.address}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-gold-500"><Phone size={20} /></div>
                <p className="text-cream-50/70">{settings?.schoolPhone || CONTACT_INFO.phone}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-gold-500"><Mail size={20} /></div>
                <p className="text-cream-50/70">{settings?.schoolEmail || CONTACT_INFO.email}</p>
              </div>
            </div>
            <div className="mt-8">
              <h5 className="text-sm font-bold text-gold-400 uppercase tracking-widest mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <button className="bg-gold-500 text-navy-950 px-4 py-2 rounded-r-xl font-bold hover:bg-gold-400 transition-colors">Join</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-8 border-t border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-4 py-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-sm font-medium tracking-wide">
                <span className="text-gold-400 font-bold mr-2">© {new Date().getFullYear()}</span>
                {settings?.schoolName || SCHOOL_NAME}
              </p>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                CBSE Affiliation NO. 1130000
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
              <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Crafted with</span>
              <Heart size={14} className="text-red-500 fill-red-500 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] uppercase font-black tracking-widest text-gold-400">for the Future</span>
            </div>

            <div className="flex items-center gap-8">
              <Link to="/privacy-policy" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors">Privacy</Link>
              <Link to="/terms-and-conditions" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors">Terms</Link>
              <Link to="/sitemap" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors">Sitemap</Link>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-white/20 font-medium max-w-2xl mx-auto leading-relaxed">
              Disclaimer: The information provided on this website is for general educational purposes only. {settings?.schoolName || SCHOOL_NAME} reserves the right to modify curriculum, fees, and school policies without prior notice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
