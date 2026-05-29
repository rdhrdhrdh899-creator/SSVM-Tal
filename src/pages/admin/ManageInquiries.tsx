import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, Search, Filter, Check, Trash2, 
  ExternalLink, FileSpreadsheet, User, Clock, 
  Phone, Mail, CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db, auth } from '../../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useSettingsStore } from '../../store/settingsStore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOOL_NAME } from '../../constants';

interface Inquiry {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  natureOfInquiry: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Discussed' | 'Solved';
}

export const ManageInquiries = () => {
  const { settings } = useSettingsStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [natureFilter, setNatureFilter] = useState<string>('All');
  
  // Google Sheets Export States
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [createdSheetUrl, setCreatedSheetUrl] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        const list: Inquiry[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Inquiry);
        });
        // Sort by date descending
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching inquiries:', error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Discussed' | 'Solved') => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry.');
    }
  };

  const handleExportToSheets = async () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }

    setIsExporting(true);
    setExportStatus('Connecting to Google Account...');
    setCreatedSheetUrl('');

    try {
      // Setup auth provider with specific scopes
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');
      provider.addScope('https://www.googleapis.com/auth/drive.file');

      // Request Google login with popup
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
            title: `${schoolName} - Website Inquiries (${new Date().toLocaleDateString()})`
          }
        })
      });

      if (!createResponse.ok) {
        throw new Error('Google Sheets creation failed.');
      }

      const spreadsheet = await createResponse.json();
      const spreadsheetId = spreadsheet.spreadsheetId;
      const spreadsheetUrl = spreadsheet.spreadsheetUrl;

      setExportStatus('Formatting and inserting inquiry records...');
      
      const headers = [
        'Submission Timestamp',
        'Full Name',
        'Phone Number',
        'Email Address',
        'Nature of Inquiry',
        'Detailed Query Message',
        'Current Tracking Status'
      ];

      const dataRows = filteredInquiries.map((inq) => [
        new Date(inq.createdAt).toLocaleString(),
        inq.fullName,
        inq.phoneNumber,
        inq.emailAddress,
        inq.natureOfInquiry,
        inq.message,
        inq.status
      ]);

      const values = [headers, ...dataRows];

      // Update values in range Sheet1!A1
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
      alert(error.message || 'Export to Google Sheets failed. Check console.');
      setExportStatus('');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phoneNumber.includes(searchQuery) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
    const matchesNature = natureFilter === 'All' || inq.natureOfInquiry === natureFilter;

    return matchesSearch && matchesStatus && matchesNature;
  });

  const uniqueNatures = Array.from(new Set(inquiries.map(i => i.natureOfInquiry)));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="heading-serif text-3xl font-black text-navy-950 flex items-center gap-3">
            <MessageSquare size={32} className="text-gold-500" /> Web Inquiry Desk
          </h1>
          <p className="text-gray-500 font-medium tracking-tight mt-1">
            Review and track inquiries submitted by parents, students, and website visitors
          </p>
        </div>
        
        {/* Google Sheet Link / Button */}
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
      </div>

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

      {/* Filters & Search */}
      <div className="grid md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="md:col-span-2">
          <Input 
            label="Search inquiries"
            placeholder="Search by name, email, query details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} className="text-gray-400" />}
          />
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Status Tracking</label>
          <select 
            className="mt-1 flex w-full h-[46px] rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm font-bold text-navy-905 outline-none focus:ring-2 focus:ring-navy-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Inquiries</option>
            <option value="Pending">Pending</option>
            <option value="Discussed">Discussed</option>
            <option value="Solved">Solved</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nature of Inquiry</label>
          <select 
            className="mt-1 flex w-full h-[46px] rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm font-bold text-navy-905 outline-none focus:ring-2 focus:ring-navy-100"
            value={natureFilter}
            onChange={(e) => setNatureFilter(e.target.value)}
          >
            <option value="All">All Natures</option>
            {uniqueNatures.map((n, idx) => (
              <option key={idx} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] border border-gray-100 text-center text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">No Inquiries Found</p>
            <p className="text-sm mt-1">There are no matching inquiries logged in the database.</p>
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <Card key={inq.id} className="p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                {/* Information block */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-1.5 bg-navy-50 text-navy-950 rounded-full text-xs font-extrabold tracking-tight">
                      {inq.natureOfInquiry}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-tight ${
                      inq.status === 'Solved' ? 'bg-green-100 text-green-700' :
                      inq.status === 'Discussed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inq.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium font-mono flex items-center gap-1 ml-auto lg:ml-0">
                      <Clock size={12} /> {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                      <User size={18} className="text-gray-400" /> {inq.fullName}
                    </h3>
                    <p className="text-sm text-gray-650 font-medium leading-relaxed mt-3 whitespace-pre-line bg-gray-50/70 p-4 rounded-2xl border border-gray-100/50">
                      "{inq.message}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500">
                    <a href={`tel:${inq.phoneNumber}`} className="flex items-center gap-2 hover:text-navy-900 transition-colors">
                      <Phone size={14} className="text-emerald-500" /> {inq.phoneNumber}
                    </a>
                    <a href={`mailto:${inq.emailAddress}`} className="flex items-center gap-2 hover:text-navy-900 transition-colors">
                      <Mail size={14} className="text-navy-700" /> {inq.emailAddress}
                    </a>
                  </div>
                </div>

                {/* Operations dropdown / actions */}
                <div className="flex lg:flex-col items-center gap-3 shrink-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0">
                  <div className="text-xs font-extrabold text-gray-400 uppercase tracking-widest hidden lg:block mb-1">
                    Mark Inquiry Status
                  </div>
                  
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(inq.id, 'Pending')}
                      className={`px-3 py-1 text-xs rounded-xl font-bold flex-1 lg:flex-none ${inq.status === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : ''}`}
                    >
                      Pending
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(inq.id, 'Discussed')}
                      className={`px-3 py-1 text-xs rounded-xl font-bold flex-1 lg:flex-none ${inq.status === 'Discussed' ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
                    >
                      Discussed
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(inq.id, 'Solved')}
                      className={`px-3 py-1 text-xs rounded-xl font-bold flex-1 lg:flex-none ${inq.status === 'Solved' ? 'bg-green-50 border-green-200 text-green-600' : ''}`}
                    >
                      Solved
                    </Button>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(inq.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 w-full lg:w-full mt-0 lg:mt-3 rounded-xl font-bold"
                  >
                    <Trash2 size={16} className="mr-2 inline" /> Delete Query
                  </Button>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
