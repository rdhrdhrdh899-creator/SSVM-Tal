import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, Filter, 
  MoreVertical, Mail, Phone, Calendar,
  CheckCircle, XCircle, Clock, Eye,
  ArrowRight, User, Download, FileSpreadsheet,
  ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAdmissionStore } from '../../store/admissionStore';
import { AdmissionApplication } from '../../types';
import { db, auth } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSettingsStore } from '../../store/settingsStore';
import { SCHOOL_NAME } from '../../constants';

export const ManageAdmissions = () => {
  const { settings } = useSettingsStore();
  const { applications, loading, fetchApplications, updateStatus } = useAdmissionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<AdmissionApplication | null>(null);

  // Google Sheets Export States
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [createdSheetUrl, setCreatedSheetUrl] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredLeads = applications.filter(lead => {
    const matchesSearch = 
      lead.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'gold';
      case 'Reviewed': return 'primary';
      case 'Interview': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'danger';
      default: return 'primary';
    }
  };

  const handleUpdateStatus = async (id: string, status: AdmissionApplication['status']) => {
    await updateStatus(id, status);
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No records to export.');
      return;
    }
    const headers = [
      'Date Filed',
      'Student Name',
      'Date of Birth',
      'Gender',
      'Applying for Class',
      'Last School Attended',
      'Percentage in Last Class',
      'Father Name',
      'Mother Name',
      'Contact Phone',
      'Official Email',
      'Residential Address',
      'Pincode',
      'Current Application Status'
    ];
    
    const csvRows = [headers.map(h => `"${h.replace(/"/g, '""')}"`)];
    
    filteredLeads.forEach(lead => {
      const formData = lead.data || {};
      const row = [
        new Date(lead.date).toLocaleString(),
        lead.studentName,
        formData.dob || '',
        formData.gender || '',
        lead.applyingClass,
        formData.previousSchool || '',
        formData.previousMarks || '',
        formData.fatherName || lead.parentName,
        formData.motherName || '',
        lead.phone,
        lead.email,
        formData.address || '',
        formData.pincode || '',
        lead.status
      ];
      csvRows.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`));
    });
    
    const csvContent = "\uFEFF" + csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Admissions_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportToSheets = async () => {
    if (filteredLeads.length === 0) {
      alert('No admission leads to export.');
      return;
    }

    setIsExporting(true);
    setExportStatus('Connecting to Google Account...');
    setCreatedSheetUrl('');
    setExportError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');
      provider.addScope('https://www.googleapis.com/auth/drive.file');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (!accessToken) {
        throw new Error('Failed to obtain Google access token. Please authorize again.');
      }

      setExportStatus('Creating Google Spreadsheet...');
      const schoolName = settings?.schoolName || SCHOOL_NAME;
      
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `${schoolName} - Admission Applications (${new Date().toLocaleDateString()})`
          }
        })
      });

      if (!createResponse.ok) {
        throw new Error('Google Sheets creation failed.');
      }

      const spreadsheet = await createResponse.json();
      const spreadsheetId = spreadsheet.spreadsheetId;
      const spreadsheetUrl = spreadsheet.spreadsheetUrl;

      setExportStatus('Formatting and inserting application records...');
      
      const headers = [
        'Submission Date',
        'Student Name',
        'Date of Birth',
        'Gender',
        'Applying for Class',
        'Last School Attended',
        'Percentage in Last Class',
        'Father\'s Name',
        'Mother\'s Name',
        'Contact Phone',
        'Official Email',
        'Residential Address',
        'Pincode',
        'Processing Status'
      ];

      const dataRows = filteredLeads.map((lead) => {
        const formData = lead.data || {};
        return [
          new Date(lead.date).toLocaleString(),
          lead.studentName,
          formData.dob || '',
          formData.gender || '',
          lead.applyingClass,
          formData.previousSchool || '',
          formData.previousMarks || '',
          formData.fatherName || lead.parentName,
          formData.motherName || '',
          lead.phone,
          lead.email,
          formData.address || '',
          formData.pincode || '',
          lead.status
        ];
      });

      const values = [headers, ...dataRows];

      const writeResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values
          })
        }
      );

      if (!writeResponse.ok) {
        throw new Error('Failed to write records to Google Sheet.');
      }

      setCreatedSheetUrl(spreadsheetUrl);
      setExportStatus('Success! Click below to view Spreadsheet.');
    } catch (error: any) {
      console.error('Sheets export error:', error);
      let errMsg = error.message || 'Export to Google Sheets failed.';
      if (error.code === 'auth/popup-closed-by-user' || String(error).includes('popup-closed-by-user')) {
        errMsg = 'popup-closed-by-user';
      }
      setExportError(errMsg);
      setExportStatus('');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm animate-fade-in">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950 flex items-center gap-3">
            <FileText size={32} className="text-gold-500" /> Admission Leads
          </h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">
            Review and process new student inquiries and applications
          </p>
        </div>
        
        {/* Export Actions Pane */}
        <div className="flex flex-col items-stretch md:items-end gap-1.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {createdSheetUrl && (
              <a 
                href={createdSheetUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm border border-emerald-200 transition-all font-mono"
              >
                <ExternalLink size={16} /> Open Created Spreadsheet
              </a>
            )}
            
            <Button 
              variant="outline"
              onClick={handleExportCSV}
              className="rounded-2xl flex items-center justify-center gap-2 border-gray-200 text-navy-900 hover:bg-gray-50 font-bold"
            >
              <Download size={18} className="text-navy-700" /> Export CSV
            </Button>

            <Button 
              variant="outline"
              onClick={handleExportToSheets}
              disabled={isExporting}
              className="rounded-2xl flex items-center justify-center gap-2 border-green-200 text-green-700 hover:bg-green-50/50 hover:text-green-800 font-bold"
            >
              {isExporting ? (
                <RefreshCw className="animate-spin text-green-600" size={18} />
              ) : (
                <FileSpreadsheet className="text-green-600" size={18} />
              )}
              {isExporting ? 'Exporting...' : 'Export to Google Sheet'}
            </Button>
          </div>
          <span className="text-[11px] text-gray-500 font-bold text-left md:text-right max-w-sm leading-tight bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 mt-1">
            💡 लॉगिन के दौरान <b className="text-navy-950 font-black">"Advanced"</b> ➔ <b className="text-navy-950 font-black">"Go to React Applet (unsafe)"</b> विकल्प पर क्लिक करें।
          </span>
        </div>
      </div>

      {/* Google Sheets Export Tips / Errors */}
      {exportError === 'popup-closed-by-user' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-amber-50 border border-amber-200 rounded-[1.5rem] text-amber-950 space-y-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={24} />
            <h4 className="font-bold text-lg text-amber-950 heading-serif">लॉगिन पॉपअप बंद हो गया! (How to fix 'Unverified App' screen)</h4>
          </div>
          <div className="text-sm space-y-3 font-medium leading-relaxed pl-9">
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-100 space-y-2">
              <p className="font-bold text-amber-950">💡 यह पूरी तरह से सुरक्षित है! (No need to worry):</p>
              <p className="text-xs text-gray-650">चूंकि यह ऐप डेवलपमेंट/परीक्षण मोड में चल रहा है, इसलिए गूगल शुरुआत में "Unverified App" वार्निंग दिखाता है। इसे बायपास करके काम पूरा करने के लिए नीचे दिए गए कदम उठाएं:</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <p className="font-bold text-navy-950 text-xs uppercase tracking-wider border-b border-amber-200 pb-1">English Guides:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-xs text-gray-700">
                  <li>Click on <strong>"Export to Google Sheet"</strong> button above.</li>
                  <li>In the login window, click the small <strong className="text-navy-950">"Advanced"</strong> link on the bottom-left.</li>
                  <li>Click on <strong className="text-navy-950">"Go to React Applet (unsafe)"</strong> link at the bottom.</li>
                  <li>Select all requested permissions, then click <strong className="text-navy-950">"Continue"</strong> or <strong className="text-navy-950">"Allow"</strong>.</li>
                </ol>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-navy-950 text-xs uppercase tracking-wider border-b border-amber-200 pb-1">हिंदी में निर्देश:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-xs text-gray-700">
                  <li>ऊपर दिए गए <strong>"Export to Google Sheet"</strong> बटन पर दोबारा क्लिक करें।</li>
                  <li>पॉपअप खुलने पर नीचे बाईं तरफ छोटे अक्षरों में लिखे <strong className="text-navy-950">"Advanced" (उन्नत)</strong> पर क्लिक करें।</li>
                  <li>फिर नीचे आ रहे <strong className="text-navy-950">"Go to React Applet (unsafe)"</strong> लिंक पर क्लिक करें।</li>
                  <li>मांगी गई Google Sheets की अनुमति को टिक करें, और <strong className="text-navy-950">"Continue" (जारी रखें)</strong> पर क्लिक कर दें।</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {exportError && exportError !== 'popup-closed-by-user' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 flex items-center gap-3 text-sm font-bold animate-pulse"
        >
          <AlertCircle className="text-red-600" size={18} />
          <span>Error during export: {exportError}</span>
        </motion.div>
      )}

      {/* Export Status Notification */}
      {exportStatus && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-navy-50 border border-navy-100 rounded-2xl text-navy-900 flex items-center gap-3 text-sm font-bold"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping shrink-0" />
          <span>Google Sheets status: {exportStatus}</span>
        </motion.div>
      )}

      {/* Filters Bar */}
      <Card className="p-4 border-0 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by student, parent or email..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['All', 'New', 'Reviewed', 'Interview', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === status 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Leads List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedLead(lead)}
                className={`cursor-pointer group transition-all ${selectedLead?.id === lead.id ? 'z-10 relative' : ''}`}
              >
                <Card className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-0 shadow-sm transition-all hover:shadow-md ${selectedLead?.id === lead.id ? 'ring-2 ring-gold-400 shadow-xl' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-gold-500 shadow-sm border border-gray-100 flex-shrink-0 ${lead.status === 'New' ? 'bg-gold-50' : 'bg-gray-50'}`}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-950">{lead.studentName}</h3>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        <span>Grade {lead.applyingClass}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {new Date(lead.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex flex-col items-end">
                      <Badge variant={getStatusColor(lead.status) as any}>{lead.status}</Badge>
                    </div>
                    <ArrowRight size={18} className={`text-gray-300 group-hover:text-navy-900 transition-colors ${selectedLead?.id === lead.id ? 'text-navy-900 translate-x-1' : ''}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLeads.length === 0 && !loading && (
            <div className="py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <FileText size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">No admission leads found</p>
            </div>
          )}
        </div>

        {/* Lead Details Pane */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedLead ? (
              <motion.div
                key={selectedLead.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="sticky top-8"
              >
                <Card className="p-8 border-0 shadow-xl bg-navy-950 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <Badge variant="gold" className="bg-gold-500 text-navy-950 border-0">ADMISSION FILE</Badge>
                      <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                        <XCircle size={24} />
                      </button>
                    </div>

                    <h2 className="heading-serif text-3xl font-black mb-1">{selectedLead.studentName}</h2>
                    <p className="text-gold-400 font-bold tracking-widest uppercase text-xs mb-8">Candidate for Grade {selectedLead.applyingClass}</p>

                    <div className="space-y-6 mb-10">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Parent/Guardian</p>
                        <p className="font-bold flex items-center gap-2"><User size={14} className="text-gold-500" /> {selectedLead.parentName}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Details</p>
                        <p className="font-bold flex items-center gap-2 mb-2"><Mail size={14} className="text-gold-500" /> {selectedLead.email}</p>
                        <p className="font-bold flex items-center gap-2"><Phone size={14} className="text-gold-500" /> {selectedLead.phone}</p>
                      </div>
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Processing Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Reviewed')}
                      >
                        <CheckCircle size={14} className="mr-2 text-emerald-400" /> Mark Review
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Interview')}
                      >
                        <Clock size={14} className="mr-2 text-gold-400" /> Interview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-navy-800 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Accepted')}
                      >
                        <CheckCircle size={14} className="mr-2" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="bg-navy-800 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold py-4"
                        onClick={() => handleUpdateStatus(selectedLead.id, 'Rejected')}
                      >
                        <XCircle size={14} className="mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                <Eye size={48} className="mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest text-[10px]">Preview Panel</p>
                <p className="text-sm mt-2">Select a lead to view full application details and take actions</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
