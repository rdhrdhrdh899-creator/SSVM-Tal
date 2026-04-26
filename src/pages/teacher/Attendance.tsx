import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, XCircle, Clock, Calendar, 
  Search, Users, Save, ChevronLeft, ChevronRight,
  TrendingUp, PieChart as PieChartIcon, Download,
  CheckCircle2, History, Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store/authStore';
import { useStudentStore } from '../../store/studentStore';
import { useAttendanceStore } from '../../store/attendanceStore';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Attendance = () => {
  const { user } = useAuthStore();
  const { students, fetchClassStudents } = useStudentStore();
  const { 
    attendanceData, loading, saveAttendance, fetchDailyAttendance,
    history, fetchAttendanceHistory, historyLoading
  } = useAttendanceStore();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<{[key: string]: 'P' | 'A' | 'L'}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'daily' | 'history' | 'summary'>('daily');
  const [isSaving, setIsSaving] = useState(false);

  const teacherClass = user?.class || 'X-A';

  useEffect(() => {
    fetchClassStudents(teacherClass);
    fetchAttendanceHistory(teacherClass);
  }, [teacherClass, fetchClassStudents, fetchAttendanceHistory]);

  useEffect(() => {
    fetchDailyAttendance(teacherClass, selectedDate);
  }, [selectedDate, teacherClass, fetchDailyAttendance]);

  useEffect(() => {
    if (attendanceData) {
      setRecords(attendanceData.records);
    } else {
      // Default all to present if no data exists
      const initial: {[key: string]: 'P' | 'A' | 'L'} = {};
      students.forEach(s => {
        initial[s.id] = 'P';
      });
      setRecords(initial);
    }
  }, [attendanceData, students]);

  const handleStatusChange = (studentId: string, status: 'P' | 'A' | 'L') => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const allPresent: {[key: string]: 'P' | 'A' | 'L'} = {};
    students.forEach(s => { allPresent[s.id] = 'P'; });
    setRecords(allPresent);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAttendance({
        date: selectedDate,
        class: teacherClass,
        records,
        updatedBy: user?.id || 'system'
      });
      alert('Attendance saved successfully!');
    } catch (error) {
      alert('Failed to save attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toString().includes(searchTerm)
  );

  const stats = {
    present: Object.values(records).filter(v => v === 'P').length,
    absent: Object.values(records).filter(v => v === 'A').length,
    leave: Object.values(records).filter(v => v === 'L').length,
    total: students.length
  };

  const chartData = [
    { name: 'Present', value: stats.present, color: '#10B981' },
    { name: 'Absent', value: stats.absent, color: '#EF4444' },
    { name: 'Leave', value: stats.leave, color: '#F59E0B' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950">Student Attendance</h1>
          <div className="flex items-center mt-2 gap-3">
            <Badge variant="primary" className="bg-navy-900 border-0">{teacherClass}</Badge>
            <div className="flex bg-gray-100 p-1 rounded-xl">
               <button 
                 onClick={() => setView('daily')}
                 className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", view === 'daily' ? "bg-white text-navy-900 shadow-sm" : "text-gray-400 hover:text-navy-900")}
               >Daily</button>
               <button 
                 onClick={() => setView('history')}
                 className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", view === 'history' ? "bg-white text-navy-900 shadow-sm" : "text-gray-400 hover:text-navy-900")}
               >History</button>
               <button 
                 onClick={() => setView('summary')}
                 className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", view === 'summary' ? "bg-white text-navy-900 shadow-sm" : "text-gray-400 hover:text-navy-900")}
               >Insights</button>
            </div>
          </div>
        </div>

        {view === 'daily' && (
          <div className="flex items-center gap-4">
             <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-12 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-navy-100 outline-none"
                />
             </div>
             <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                <Save size={18} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Attendance'}
             </Button>
          </div>
        )}
      </div>

      {view === 'daily' && (
        <div className="grid lg:grid-cols-4 gap-8">
           {/* Summary Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                 <h4 className="font-bold text-navy-900 mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-gold-500" /> Today's Overview
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                       <span className="text-xs font-bold text-emerald-700 uppercase">Present</span>
                       <span className="text-lg font-black text-emerald-900">{stats.present}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                       <span className="text-xs font-bold text-red-700 uppercase">Absent</span>
                       <span className="text-lg font-black text-red-900">{stats.absent}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gold-50 rounded-xl border border-gold-100">
                       <span className="text-xs font-bold text-gold-700 uppercase">Leave</span>
                       <span className="text-lg font-black text-gold-900">{stats.leave}</span>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                       <p className="text-3xl font-black text-navy-950">{Math.round((stats.present / stats.total) * 100) || 0}%</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total Attendance</p>
                    </div>
                 </div>
              </Card>

              <Button variant="outline" className="w-full rounded-2xl text-xs py-4 border-dashed border-2 hover:bg-navy-50" onClick={handleMarkAllPresent}>
                 <CheckCircle2 size={16} className="mr-2 text-emerald-500" /> Mark All as Present
              </Button>
           </div>

           {/* Main List */}
           <div className="lg:col-span-3 space-y-4">
              <Card className="p-4 border-0 shadow-sm">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search student by name or roll number..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-navy-100"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </Card>

              <div className="space-y-3">
                 {loading ? (
                    <div className="py-20 text-center">Loading student records...</div>
                 ) : filteredStudents.map((student) => (
                    <Card key={student.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-all group">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center font-black">
                                {student.rollNumber}
                             </div>
                             <div>
                                <p className="font-bold text-navy-950">{student.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">ID: {student.id.slice(0, 8)}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100">
                             {[
                               { label: 'P', color: 'bg-emerald-500', active: records[student.id] === 'P' },
                               { label: 'A', color: 'bg-red-500', active: records[student.id] === 'A' },
                               { label: 'L', color: 'bg-gold-500', active: records[student.id] === 'L' }
                             ].map((status) => (
                                <button
                                  key={status.label}
                                  onClick={() => handleStatusChange(student.id, status.label as any)}
                                  className={cn(
                                    "w-10 h-10 rounded-xl font-black text-sm transition-all",
                                    status.active ? `${status.color} text-white shadow-lg scale-110` : "text-gray-400 hover:text-navy-900"
                                  )}
                                >
                                   {status.label}
                                </button>
                             ))}
                          </div>
                       </div>
                    </Card>
                 ))}
              </div>
           </div>
        </div>
      )}

      {view === 'history' && (
        <Card className="p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="heading-serif text-xl font-bold text-navy-900">Attendance Log</h3>
              <Button variant="outline" size="sm" className="rounded-xl">
                 <Download size={16} className="mr-2" /> Export CSV
              </Button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left border-b border-gray-100">
                       <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                       <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Present</th>
                       <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Absent</th>
                       <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Percentage</th>
                       <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {historyLoading ? (
                       <tr><td colSpan={5} className="py-10 text-center">Reading history...</td></tr>
                    ) : history.map((record) => {
                       const pCount = Object.values(record.records).filter(v => v === 'P').length;
                       const aCount = Object.values(record.records).filter(v => v === 'A').length;
                       const perc = Math.round((pCount / Object.keys(record.records).length) * 100);
                       
                       return (
                          <tr key={record.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                             <td className="py-4 font-bold text-navy-900">{record.date}</td>
                             <td className="py-4"><Badge variant="primary" className="bg-emerald-50 text-emerald-700 border-0 font-bold">{pCount}</Badge></td>
                             <td className="py-4"><Badge variant="primary" className="bg-red-50 text-red-700 border-0 font-bold">{aCount}</Badge></td>
                             <td className="py-4 font-black text-navy-950">{perc}%</td>
                             <td className="py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-navy-400" onClick={() => {
                                   setSelectedDate(record.date);
                                   setView('daily');
                                }}>Edit</Button>
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </Card>
      )}

      {view === 'summary' && (
        <div className="grid md:grid-cols-2 gap-8">
           <Card className="p-8">
              <h3 className="heading-serif text-xl font-bold text-navy-900 mb-8">Attendance Distribution</h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={chartData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                       >
                          {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                       <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="p-8">
              <h3 className="heading-serif text-xl font-bold text-navy-900 mb-6">Attendance Summary Report</h3>
              <div className="space-y-6">
                 {[
                    { label: 'Highest Attendance Day', val: 'Monday', color: 'text-emerald-600' },
                    { label: 'Average Class Presence', val: '92%', color: 'text-navy-900' },
                    { label: 'Most Regular Student', val: 'Aarav Sharma', color: 'text-gold-600' },
                    { label: 'Alert: Low Attendance', val: '3 Students', color: 'text-red-500' }
                 ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                       <span className="text-sm font-bold text-gray-500">{stat.label}</span>
                       <span className={cn("font-black text-lg", stat.color)}>{stat.val}</span>
                    </div>
                 ))}
                 <Button variant="primary" className="w-full rounded-xl py-6">Generate Detailed Report</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};
