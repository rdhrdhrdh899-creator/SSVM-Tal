import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, FileText, Megaphone, Calendar, 
  Search, ShieldAlert, CheckCircle, TrendingUp,
  PieChart as PieChartIcon, ArrowUpRight, ChevronLeft, LogOut, User as UserIcon
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PostNoticeModal } from '../../components/dashboard/PostNoticeModal';
import { SubscriptionGuard } from '../../components/ui/SubscriptionGuard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { useNoticeStore } from '../../store/noticeStore';
import { useAdmissionStore } from '../../store/admissionStore';
import { useLeaveStore } from '../../store/leaveStore';
import { useBlogStore } from '../../store/blogStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Lock } from 'lucide-react';

// Mock Data for Charts
const revenueData = [
  { month: 'Jan', amount: 8.5 }, { month: 'Feb', amount: 12.0 }, { month: 'Mar', amount: 15.2 },
  { month: 'Apr', amount: 14.8 }, { month: 'May', amount: 11.5 }, { month: 'Jun', amount: 9.8 }
];

const genderData = [
  { name: 'Boys', value: 1540 },
  { name: 'Girls', value: 1307 }
];

const COLORS = ['#1a237e', '#f59e0b'];

export const AdminDashboard = () => {
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isSubsGuardOpen, setIsSubsGuardOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notices = useNoticeStore((state) => state.notices).slice(0, 4);
  const fetchNotices = useNoticeStore((state) => state.fetchNotices);
  const rawAdmissionLeads = useAdmissionStore((state) => state.applications);
  const fetchApplications = useAdmissionStore((state) => state.fetchApplications);
  const { leaves, fetchAllLeaves } = useLeaveStore();
  const { posts, fetchPosts } = useBlogStore();
  
  React.useEffect(() => {
    fetchApplications();
    fetchNotices();
    fetchAllLeaves();
    fetchPosts();
  }, [fetchApplications, fetchNotices, fetchAllLeaves, fetchPosts]);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  
  // Combine real store data with mock data (to always show some UI if the store is empty)
  // Ensure we show up to 3 items, prioritizing the real store data
  const defaultMockLeads = [
    { id: '1', studentName: 'Kavita Joshi', applyingClass: '9', status: 'New' },
    { id: '2', studentName: 'Mohit Reddy', applyingClass: '11', status: 'Reviewed' },
    { id: '3', studentName: 'Sara Khan', applyingClass: '1', status: 'Interview' }
  ];
  const combinedLeads = [...rawAdmissionLeads, ...defaultMockLeads].slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center text-gold-400 border-2 border-white shadow-lg">
            <UserIcon size={28} />
          </div>
          <div>
            <h1 className="heading-serif text-3xl font-black text-navy-950">Welcome, {user?.name || 'Administrator'}</h1>
            <p className="text-gray-500 font-medium tracking-tight">System performance and institutional control panel</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="bg-white border-gray-200" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="shadow-lg shadow-navy-800/20 group"
            onClick={() => handleAction(() => {})}
          >
            {isLocked ? <Lock size={16} className="mr-2 text-red-400" /> : <UserPlus size={16} className="mr-2" />}
            New Admission
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={2847} icon={Users} color="navy" trend="+4.2%" />
        <StatCard label="Blog Articles" value={posts.length} icon={FileText} color="gold" trend="Active" />
        <StatCard label="Mon Revenue" value={14.2} prefix="₹" suffix="L" icon={TrendingUp} color="emerald" trend="+12%" />
        <StatCard label="Attendance %" value={92} suffix="%" icon={CheckCircle} color="blue" trend="+2.1%" />
      </div>

      {/* Quick Access Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6 bg-gradient-to-br from-navy-900 to-navy-950 text-white overflow-hidden h-full relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert size={80} />
            </div>
            <div className="relative z-10">
              <h3 className="heading-serif text-lg font-bold mb-4">Urgent Actions</h3>
              <div className="space-y-3">
                {pendingLeaves > 0 && (
                  <div 
                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/20 text-xs cursor-pointer hover:bg-white/20 transition-all font-bold"
                    onClick={() => navigate('/admin/leaves')}
                  >
                    <span>{pendingLeaves} Teacher leave requests pending</span>
                    <Badge variant="warning">High</Badge>
                  </div>
                )}
                {[
                  { text: '12 Fee defaulters notice pending', alert: 'High' },
                  { text: 'Admission Interview for Class 11', alert: 'Med' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                    <span>{item.text}</span>
                    <Badge variant={item.alert === 'High' ? 'danger' : 'warning'}>{item.alert}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="heading-serif text-xl font-bold text-navy-900">Revenue Analysis</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Fee collection (Last 6 Months)</p>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold tracking-widest bg-white shadow-sm">Monthly</Button>
              <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold tracking-widest text-gray-400">Quarterly</Button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a237e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1a237e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#1a237e' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#1a237e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mini Stats Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="heading-serif text-lg font-bold text-navy-900 mb-6 flex items-center">
              <Users className="mr-2 text-gold-500" size={20} /> Gender Ratio
            </h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Boys</p>
                <p className="text-lg font-black text-navy-800">54%</p>
              </div>
              <div className="text-center border-l border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Girls</p>
                <p className="text-lg font-black text-gold-500">46%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tables Area */}
      <div className="grid xl:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900">Recent Admission Leads</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-navy-600 font-bold"
              onClick={() => navigate('/admin/admissions')}
            >
              View All <ArrowUpRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <th className="pb-4 font-bold">Lead Name</th>
                  <th className="pb-4 font-bold">Class</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {combinedLeads.map((lead, i) => (
                  <tr key={lead.id || i} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-navy-900">{lead.studentName}</td>
                    <td className="py-4 text-gray-500 font-medium">Grade {lead.applyingClass}</td>
                    <td className="py-4">
                      <Badge variant={lead.status === 'New' ? 'gold' : lead.status === 'Interview Scheduled' || lead.status === 'Interview' ? 'warning' : lead.status === 'Rejected' ? 'danger' : 'primary'}>
                        {lead.status === 'Interview Scheduled' ? 'Interview' : lead.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-navy-50 text-navy-600"><Search size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900">Latest Notices</h3>
            <Button 
              variant="primary" 
              size="sm" 
              className="rounded-full"
              onClick={() => handleAction(() => setIsNoticeModalOpen(true))}
            >
              {isLocked && <Lock size={14} className="mr-2" />}
              Post Notice
            </Button>
          </div>
          <div className="space-y-4">
            {notices.map((n, i) => (
              <div key={n.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gold-400 transition-all cursor-pointer">
                <div className="flex items-center space-x-4 max-w-[85%]">
                  <div className="w-10 h-10 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-gold-500 shadow-sm border border-gray-100"><Megaphone size={18} /></div>
                  <div className="min-w-0">
                    <p className="font-bold text-navy-900 text-sm truncate">{n.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{n.category} • {new Date(n.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                <ChevronLeft className="rotate-180 text-gray-300" size={16} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <PostNoticeModal 
        isOpen={isNoticeModalOpen} 
        onClose={() => setIsNoticeModalOpen(false)} 
      />

      <SubscriptionGuard 
        isOpen={isSubsGuardOpen} 
        onClose={() => setIsSubsGuardOpen(false)}
        schoolName={settings?.schoolName || 'St. Xavier International School'}
      />
    </div>
  );
};
