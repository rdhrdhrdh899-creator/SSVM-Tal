import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Users, Star, 
  Award, Target, AlertTriangle, ChevronRight,
  Search, Filter, BarChart2, PieChart as PieChartIcon
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { cn } from '../../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, LineChart, Line 
} from 'recharts';

export const ClassPerformance = () => {
  const { user } = useAuthStore();
  const { students, fetchClassStudents } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.class) fetchClassStudents(user.class);
  }, [user]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock performance data for visualization
  const performanceData = [
    { name: 'Week 1', avg: 72 },
    { name: 'Week 2', avg: 78 },
    { name: 'Week 3', avg: 75 },
    { name: 'Week 4', avg: 82 },
    { name: 'Week 5', avg: 88 },
  ];

  const distributionData = [
    { range: '90-100', count: 8, color: '#10B981' },
    { range: '80-89', count: 12, color: '#3B82F6' },
    { range: '70-79', count: 15, color: '#F59E0B' },
    { range: 'Below 70', count: 5, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Class Analytics</h1>
          <p className="text-gray-500 font-medium tracking-tight">Monitor academic progress and identify top performers</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="rounded-xl">
              <BarChart2 size={16} className="mr-2" /> Detailed Report
           </Button>
           <Button variant="primary" size="sm" className="rounded-xl">
              <Award size={16} className="mr-2" /> Award Badges
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         <StatCard label="Class Average" value={82} suffix="%" icon={TrendingUp} color="emerald" />
         <StatCard label="Top Performers" value={distributionData[0].count} icon={Star} color="gold" />
         <StatCard label="Needs Attention" value={distributionData[3].count} icon={AlertTriangle} color="maroon" />
         <StatCard label="Participation" value={95} suffix="%" icon={Users} color="navy" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Performance Trends */}
         <Card className="lg:col-span-2 p-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900 mb-8">Performance Trends</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94A3B8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94A3B8' }} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Line type="monotone" dataKey="avg" stroke="#1E293B" strokeWidth={4} dot={{ r: 6, fill: '#EAB308', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Grade Distribution */}
         <Card className="p-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900 mb-8">Grade Distribution</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} />
                     <Tooltip cursor={{ fill: 'transparent' }} />
                     <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={24}>
                        {distributionData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Rank List */}
      <Card className="p-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h3 className="heading-serif text-xl font-bold text-navy-900">Student Rank List</h3>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search student..."
                 className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-medium outline-none"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left border-b border-gray-100">
                     <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Rank</th>
                     <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Student</th>
                     <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Class</th>
                     <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Latest Score</th>
                     <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Status</th>
                     <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 text-right">Progress</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredStudents.map((s, i) => (
                     <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4 font-black text-navy-900">#{i + 1}</td>
                        <td className="py-5 px-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-xs">
                                 {s.name.charAt(0)}
                              </div>
                              <span className="font-bold text-navy-950 text-sm whitespace-nowrap">{s.name}</span>
                           </div>
                        </td>
                        <td className="py-5 px-4 font-bold text-gray-500 text-xs">{s.class}</td>
                        <td className="py-5 px-4">
                           <Badge variant="primary" className="bg-navy-50 text-navy-900 border-0 font-black">{85 + (i * -2)}%</Badge>
                        </td>
                        <td className="py-5 px-4">
                           <div className="flex items-center gap-1.5">
                              {i < 3 ? (
                                 <><TrendingUp size={14} className="text-emerald-500" /> <span className="text-[10px] font-bold text-emerald-600 uppercase">Improving</span></>
                              ) : (
                                 <><Users size={14} className="text-gray-400" /> <span className="text-[10px] font-bold text-gray-400 uppercase">Stable</span></>
                              )}
                           </div>
                        </td>
                        <td className="py-5 px-4 text-right">
                           <Button variant="ghost" size="sm" className="rounded-lg">
                              <ChevronRight size={18} />
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};
