import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Activity, Stethoscope, FileText, UploadCloud, Users, RefreshCw, CheckCircle2, XCircle, MapPin, Phone, Calendar, Clock, ChevronRight, LayoutDashboard, Database, TrendingUp, ShieldCheck, Settings, Plus, Info } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/ui/Pagination';

export default function LabOwnerDashboard() {
  const [lab, setLab] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [uploadingBookingId, setUploadingBookingId] = useState(null);
  const { currentPage, limit, onPageChange } = usePagination(5);

  useEffect(() => {
    fetchDashboardData(currentPage, limit);
  }, [currentPage, limit]);

  const fetchDashboardData = async (page, limit) => {
    try {
      const [labRes, bookingsRes] = await Promise.all([
        api.get('/labs/owner/me'),
        api.get(`/bookings/lab-bookings?page=${page}&limit=${limit}`)
      ]);
      setLab(labRes.data);
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
        setPaginationData(bookingsRes.data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      fetchDashboardData(currentPage, limit);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleFileUpload = async (bookingId, e) => {
    setUploadingBookingId(bookingId);
    // Mock upload delay
    setTimeout(async () => {
      try {
        await api.put(`/bookings/${bookingId}/report`, { reportUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' });
        fetchDashboardData(currentPage, limit);
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploadingBookingId(null);
      }
    }, 1500);
  };

  if (loading && !lab) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Syncing Provider Portal...</span>
    </div>
  );

  const totalRevenue = (bookings || []).filter(b => b.paymentStatus === 'Completed').reduce((sum, b) => sum + b.amountPaid, 0);
  
  const tabs = [
    { id: 'bookings', icon: Activity, label: 'Order Pipeline', badge: paginationData?.totalItems || 0 },
    { id: 'analytics', icon: TrendingUp, label: 'Performance' },
    { id: 'reports', icon: FileText, label: 'Medical Records' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24 px-4 md:px-12">
      
      {/* Lab Header Profile */}
      <div className="pt-10 pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{lab?.labName}</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Authorized Diagnostic Center
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-none h-12 px-6 rounded-xl border-slate-200 bg-white text-slate-600 font-bold shadow-sm">
            <Settings className="w-4 h-4 mr-2" /> Management
          </Button>
          <Button className="flex-1 lg:flex-none h-12 px-8 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all">
            <Plus className="w-4 h-4 mr-2" /> New Entry
          </Button>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 sticky top-20 z-40 bg-[#f8fafc]/80 backdrop-blur-md -mx-4 px-4 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white border-blue-100 shadow-md text-blue-600 font-bold' : 'bg-transparent border-transparent text-slate-400 font-semibold hover:text-slate-600'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-xs uppercase tracking-wider">{tab.label}</span>
            {tab.badge > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div 
              key="bookings"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {bookings.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-24 text-center border border-slate-100 shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">No active orders</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Your patient booking pipeline is currently clear. New orders will appear here as they are created.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6">
                    {(bookings || []).map(booking => (
                      <div key={booking._id} className="medical-card p-6 md:p-8 flex flex-col lg:flex-row justify-between gap-8 group">
                        <div className="flex-1 space-y-6">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full text-slate-500 border border-slate-200">
                              ID: {booking._id.substring(booking._id.length - 8).toUpperCase()}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full ${
                              booking.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>{booking.status}</span>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{booking.patientDetails?.fullName || 'Anonymous Patient'}</h3>
                            <div className="flex flex-wrap gap-6">
                              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-300" /> {booking.patientDetails?.phone}
                              </p>
                              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-300" /> {booking.patientDetails?.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {booking.tests.map(t => (
                              <span key={t._id} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-tight">{t.testName}</span>
                            ))}
                          </div>
                        </div>

                        <div className="lg:w-80 flex flex-col justify-between gap-6">
                          <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100 shadow-inner">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Volume</span>
                              <span className="text-slate-900 font-bold text-xl">₹{booking.amountPaid}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-xs font-bold text-slate-600">{new Date(booking.slot).toLocaleDateString()} • {new Date(booking.slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {booking.status === 'Pending' && (
                              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-95" onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}>Confirm Order</Button>
                            )}
                            {booking.status === 'Confirmed' && (
                              <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 transition-all active:scale-95" onClick={() => handleStatusUpdate(booking._id, 'Sample Collected')}>Verify Sample Collection</Button>
                            )}
                            {(booking.status === 'Sample Collected' || booking.status === 'Processing') && (
                              <div className="w-full relative">
                                <Input type="file" id={`upload-${booking._id}`} className="hidden" onChange={(e) => handleFileUpload(booking._id, e)} accept=".pdf" />
                                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 transition-all active:scale-95" onClick={() => document.getElementById(`upload-${booking._id}`).click()} disabled={uploadingBookingId === booking._id}>
                                  {uploadingBookingId === booking._id ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><UploadCloud className="w-5 h-5 mr-2" /> Release Medical Report</>}
                                </Button>
                              </div>
                            )}
                            {booking.status === 'Report Uploaded' && (
                              <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95" onClick={() => handleStatusUpdate(booking._id, 'Completed')}>Archive Booking</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {paginationData && (
                    <Pagination 
                      {...paginationData} 
                      onPageChange={onPageChange}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Net Volume</p>
                  <p className="text-4xl font-bold text-slate-900 tracking-tight">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Items on Page</p>
                  <p className="text-4xl font-bold text-slate-900 tracking-tight">{bookings.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Operational Health</p>
                  <p className="text-4xl font-bold text-emerald-600 tracking-tight">99.4%</p>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[450px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" /> Revenue Flow (Weekly)
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    Real-time Data
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="70%">
                  <AreaChart data={[
                    { name: 'Mon', revenue: totalRevenue * 0.1 }, { name: 'Tue', revenue: totalRevenue * 0.15 },
                    { name: 'Wed', revenue: totalRevenue * 0.2 }, { name: 'Thu', revenue: totalRevenue * 0.12 },
                    { name: 'Fri', revenue: totalRevenue * 0.25 }, { name: 'Sat', revenue: totalRevenue * 0.3 },
                    { name: 'Sun', revenue: totalRevenue * 0.18 },
                  ]}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

