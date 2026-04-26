import React from 'react';
import { 
  Users, CheckCircle, Clock, BookOpen, 
  TrendingUp, Calendar, ArrowUpRight,
  CheckSquare, UserPlus, Megaphone, Upload
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useAssignmentStore } from '../../store/assignmentStore';
import { useLeaveStore } from '../../store/leaveStore';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

import { useNavigate } from 'react-router-dom';

export const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const { students, fetchClassStudents } = useStudentStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { leaves, fetchStudentLeavesForTeacher } = useLeaveStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
       fetchClassStudents(user.class || '');
       fetchAssignments(user.id);
       fetchStudentLeavesForTeacher(user.class || '');
    }
  }, [user]);

  const pendingAssignments = assignments.length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-serif text-4xl font-black text-navy-950">Namaste, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 font-medium tracking-wide mt-1">Here's what's happening in your school dashboard today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-xs font-black text-navy-900 uppercase tracking-widest leading-none">Live Session</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="My Students" value={students.length} icon={Users} color="navy" />
        <StatCard label="Avg Presence" value={92} suffix="%" icon={CheckCircle} color="emerald" />
        <StatCard label="Pending Tasks" value={pendingAssignments} icon={Clock} color="maroon" />
        <StatCard label="Leave Requests" value={pendingLeaves} icon={Calendar} color="gold" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-0 shadow-sm overflow-hidden relative">
          {/* Activity Feed */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900 border-b-2 border-gold-500 pb-1">Activity Feed</h3>
            <Badge variant="gold" className="rounded-lg">Recent Updates</Badge>
          </div>
          
          <div className="space-y-6">
            {[
              { type: 'assignment', text: 'Physics Assignment "Laws of Motion" created', time: '10 mins ago', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
              { type: 'leave', text: 'Aryan applied for 2 days leave (Medical)', time: '1 hour ago', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
              { type: 'attendance', text: 'Class attendance marked for today', time: '3 hours ago', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className={cn("p-3 rounded-xl", activity.bg, activity.color)}>
                  <activity.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy-950">{activity.text}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{activity.time}</p>
                </div>
                <button className="p-2 text-gray-300 hover:text-navy-900">
                   <ArrowUpRight size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full rounded-2xl mt-8 py-6 border-dashed border-2">View Implementation History</Button>
        </Card>

        <div className="space-y-8">
           <Card className="p-8 bg-navy-900 text-white border-0 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Mark Attendance', icon: CheckSquare, path: '/teacher/attendance' },
                   { label: 'Add Student', icon: UserPlus, path: '/teacher/students' },
                   { label: 'New Notice', icon: Megaphone, path: '/teacher/notices' },
                   { label: 'Upload Note', icon: Upload, path: '/teacher/notes' }
                 ].map((action, i) => (
                   <button 
                     key={i}
                     className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-center group"
                     onClick={() => navigate(action.path)}
                   >
                      <div className="w-10 h-10 bg-gold-400/20 text-gold-400 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                         <action.icon size={20} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{action.label}</p>
                   </button>
                 ))}
              </div>
           </Card>

           <Card className="p-8 border-0 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <TrendingUp size={32} />
              </div>
              <h4 className="text-lg font-black text-navy-950">Weekly Analysis</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">Class performance is 12% higher than last week!</p>
              <div className="mt-6 flex justify-center gap-2">
                 {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="w-2 rounded-full bg-emerald-500 transition-all" style={{ height: `${20 + (i * 10)}px`, opacity: i/7 }} />
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
