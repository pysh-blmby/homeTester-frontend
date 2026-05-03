import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Activity, Stethoscope, FileText, UploadCloud, Users, RefreshCw, CheckCircle2, XCircle, MapPin, Phone, Calendar, Clock, ChevronRight, LayoutDashboard, Database, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function LabOwnerDashboard() {
  const [lab, setLab] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [uploadingBookingId, setUploadingBookingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [labRes, bookingsRes] = await Promise.all([
        api.get('/labs/owner/me'),
        api.get('/bookings/lab-bookings')
      ]);
      setLab(labRes.data);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      fetchDashboardData();
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
        fetchDashboardData();
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploadingBookingId(null);
      }
    }, 1500);
  };

  if (loading || !lab) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
      <Activity className="animate-spin text-cyan-400 w-10 h-10" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initializing Lab Terminal</span>
    </div>
  );

  const totalRevenue = (bookings || []).filter(b => b.paymentStatus === 'Completed').reduce((sum, b) => sum + b.amountPaid, 0);
  
  const tabs = [
    { id: 'bookings', icon: Activity, label: 'Live Orders', badge: (bookings || []).filter(b => b.status === 'Pending').length },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Records' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-4 md:px-12 selection:bg-cyan-500/30">
      
      {/* Lab Header */}
      <div className="pt-6 pb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Building2 className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter truncate max-w-[250px] md:max-w-none">{lab.labName}</h1>
            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Status: <span className="text-emerald-400">Node Active</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="ghost" className="flex-1 md:flex-none glass-card !rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest">Settings</Button>
          <Button className="flex-1 md:flex-none bg-cyan-500 text-black font-black rounded-2xl h-12 text-[10px] uppercase tracking-widest">Catalog +</Button>
        </div>
      </div>

      {/* Horizontal Nav */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 sticky top-16 z-40 bg-black/80 backdrop-blur-md -mx-4 px-4 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 border-cyan-500 text-black font-black' : 'bg-white/5 border-white/5 text-slate-500 font-bold'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
            {tab.badge > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${activeTab === tab.id ? 'bg-black text-white' : 'bg-cyan-500 text-black'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div 
              key="bookings"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {bookings.length === 0 ? (
                <div className="glass-card p-20 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">No Active Telemetry</div>
              ) : (
                (bookings || []).map(booking => (
                  <div key={booking._id} className="glass-card p-5 md:p-8 relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-white/5 rounded border border-white/5 text-slate-500">#{booking._id.substring(booking._id.length - 8)}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            booking.status === 'Pending' ? 'bg-amber-400/10 text-amber-400' :
                            booking.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-cyan-400/10 text-cyan-400'
                          }`}>{booking.status}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">{booking.patientDetails?.fullName || 'Patient X'}</h3>
                          <p className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                            <Phone className="w-3 h-3 text-cyan-500/50" /> {booking.patientDetails?.phone}
                          </p>
                          <p className="text-slate-500 text-xs flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-cyan-500/50" /> {booking.patientDetails?.address}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {booking.tests.map(t => (
                            <span key={t._id} className="text-[10px] font-bold bg-white/5 border border-white/5 px-2 py-1 rounded text-slate-400">{t.testName}</span>
                          ))}
                        </div>
                      </div>

                      <div className="md:w-64 space-y-4 flex flex-col justify-between">
                        <div className="glass-card !rounded-2xl p-4 bg-white/[0.02] space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>REVENUE</span>
                            <span className="text-white font-black text-lg">₹{booking.amountPaid}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>SLOT</span>
                            <span className="text-slate-300">{new Date(booking.slot).toLocaleDateString()} • {new Date(booking.slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {booking.status === 'Pending' && (
                            <Button className="w-full h-11 bg-blue-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}>Confirm</Button>
                          )}
                          {booking.status === 'Confirmed' && (
                            <Button className="w-full h-11 bg-purple-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => handleStatusUpdate(booking._id, 'Sample Collected')}>Mark Sample Collected</Button>
                          )}
                          {(booking.status === 'Sample Collected' || booking.status === 'Processing') && (
                            <div className="w-full relative">
                              <Input type="file" id={`upload-${booking._id}`} className="hidden" onChange={(e) => handleFileUpload(booking._id, e)} accept=".pdf" />
                              <Button className="w-full h-11 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => document.getElementById(`upload-${booking._id}`).click()} disabled={uploadingBookingId === booking._id}>
                                {uploadingBookingId === booking._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Upload Report'}
                              </Button>
                            </div>
                          )}
                          {booking.status === 'Report Uploaded' && (
                            <Button className="w-full h-11 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => handleStatusUpdate(booking._id, 'Completed')}>Mark Completed</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="glass-card p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Net Volume</p>
                  <p className="text-2xl font-black mt-1">₹{totalRevenue}</p>
                </div>
                <div className="glass-card p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Throughput</p>
                  <p className="text-2xl font-black mt-1">{bookings.length}</p>
                </div>
                <div className="glass-card p-6 hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Efficiency</p>
                  <p className="text-2xl font-black mt-1 text-cyan-400">98.4%</p>
                </div>
              </div>
              <div className="glass-card p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Mon', revenue: totalRevenue * 0.1 }, { name: 'Tue', revenue: totalRevenue * 0.15 },
                    { name: 'Wed', revenue: totalRevenue * 0.2 }, { name: 'Thu', revenue: totalRevenue * 0.12 },
                    { name: 'Fri', revenue: totalRevenue * 0.25 }, { name: 'Sat', revenue: totalRevenue * 0.3 },
                    { name: 'Sun', revenue: totalRevenue * 0.18 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#334155" tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} fillOpacity={0.1} fill="#22d3ee" />
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

