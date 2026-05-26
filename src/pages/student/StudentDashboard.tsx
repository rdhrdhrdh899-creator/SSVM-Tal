import React from 'react';
import { 
  Book, Wallet, ClipboardList, PenTool, 
  Calendar, CreditCard, ShoppingBag, Download,
  Play, CheckCircle2, TrendingUp, ArrowUpRight, Megaphone
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useNoticeStore } from '../../store/noticeStore';
import { formatDate } from '../../lib/utils';
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip as RT } from 'recharts';

import { useNavigate } from 'react-router-dom';

const attendanceData = [{ name: 'Attendance', value: 87, fill: '#1a237e' }];

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { notices, fetchNotices } = useNoticeStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const studentNotices = notices.filter(n => 
    n.target === 'All' || 
    n.target?.toString().includes('Students')
  ).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-navy-900 rounded-[2.5rem] p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rotate-45 translate-x-32 -translate-y-32 opacity-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full -translate-x-24 translate-y-24 opacity-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl border-4 border-gold-400 bg-white p-1 shadow-lg">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="h-full w-full rounded-2xl" alt="profile" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="heading-serif text-3xl md:text-4xl font-black mb-2">Hello, {user?.name.split(' ')[0]}!</h1>
            <p className="text-cream-50/60 font-medium text-lg italic">Class {user?.class}-{user?.section} | Roll No: {user?.rollNumber || '—'}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" className="rounded-full px-8 shadow-lg shadow-gold-500/20">View Report Card</Button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Attendance" value={87} suffix="%" icon={CheckCircle2} color="navy" trend="+2%" />
        <StatCard label="Fee Balance" value={25000} prefix="₹" icon={Wallet} color="maroon" />
        <StatCard label="Homework" value={3} icon={PenTool} color="gold" trend="New" />
        <StatCard label="Library Books" value={2} icon={Book} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900 flex items-center">
              <Megaphone size={22} className="mr-3 text-gold-500" /> Recent Notices
            </h3>
            <Badge variant="gold">Student Portal</Badge>
          </div>
          <div className="space-y-4">
            {studentNotices.length > 0 ? (
              studentNotices.map((notice, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border-l-4 border-gold-400 hover:bg-gold-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black uppercase text-gray-400">{formatDate(notice.date)}</span>
                    {notice.important && <Badge variant="maroon" className="scale-75 origin-right">Urgent</Badge>}
                  </div>
                  <p className="font-bold text-navy-900 text-sm line-clamp-1">{notice.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{notice.content.replace(/<[^>]*>/g, '')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic py-4">No recent notices for students.</p>
            )}
          </div>
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-navy-600 font-bold" 
            onClick={() => {
              if (user?.role === 'admin') navigate('/admin/notices');
              else if (user?.role === 'teacher') navigate('/teacher/notices');
              else navigate('/notices');
            }}
          >
            View All Notices <ArrowUpRight size={14} className="ml-1" />
          </Button>
        </Card>

        <Card className="lg:col-span-2 p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900">Academic Progress</h3>
            <Badge variant="success">Great Progress!</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={20} data={attendanceData}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                  <RT />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-navy-900">87%</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Attendance</span>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Assignments Submitted', val: '18/20' },
                { label: 'Quiz Average', val: '9.2/10' },
                { label: 'Rank in Class', val: '5th' }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">{m.label}</span>
                  <span className="font-black text-navy-900">{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
