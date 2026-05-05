import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Beaker, DollarSign, CheckCircle2, XCircle, AlertCircle, TrendingUp, Settings, FileText, ChevronRight, LayoutDashboard, Database, CreditCard, ShieldCheck, Building2, Search, ArrowUpRight, Phone, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/ui/Pagination';

export default function SuperAdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [listData, setListData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { currentPage, limit, onPageChange } = usePagination(10);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchTabData(activeTab, currentPage, limit);
    }
  }, [activeTab, currentPage, limit]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async (tab, page, limit) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (tab === 'approvals') endpoint = `/admin/labs?status=Pending&page=${page}&limit=${limit}`;
      else if (tab === 'labs') endpoint = `/admin/labs?page=${page}&limit=${limit}`;
      else if (tab === 'finance') endpoint = `/admin/bookings?page=${page}&limit=${limit}`;
      else if (tab === 'users') endpoint = `/admin/users?page=${page}&limit=${limit}`;

      if (endpoint) {
        const res = await api.get(endpoint);
        if (res.data.success) {
          setListData(res.data.data);
          setPaginationData(res.data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tab data', error);
      setListData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLabStatus = async (id, status) => {
    try {
      await api.put(`/admin/labs/${id}/status`, { status });
      fetchTabData(activeTab, currentPage, limit);
      fetchAnalytics(); // Update stats
    } catch (error) {
      alert('Failed to update lab status');
    }
  };

  if (loading && !analytics && activeTab === 'overview') return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Governance Data...</span>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-4 ${color} rounded-2xl shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-md">
          <ArrowUpRight size={12} /> {trend}
        </div>
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Growth</span>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: 'Platform Metrics' },
    { id: 'approvals', icon: ShieldCheck, label: 'Verification Queue', badge: analytics?.pendingLabs?.length || 0 },
    { id: 'labs', icon: Building2, label: 'Partner Labs' },
    { id: 'finance', icon: CreditCard, label: 'Platform Bookings' },
    { id: 'users', icon: Users, label: 'User Registry' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24 px-4 md:px-12">
      
      {/* Platform Header */}
      <div className="pt-10 pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Platform Governance</h1>
          <p className="text-slate-500 text-sm md:text-lg font-medium flex items-center gap-2">
            Secure Administrator Access <span className="text-blue-600 font-bold px-2 py-0.5 bg-blue-50 rounded-md text-[10px] uppercase tracking-widest">Master Admin</span>
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-none h-12 px-8 rounded-xl border-slate-200 bg-white text-slate-600 font-bold shadow-sm" onClick={fetchAnalytics}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Audit Refresh
          </Button>
          <Button className="flex-1 lg:flex-none h-12 px-8 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-black transition-all">
            <Settings className="w-4 h-4 mr-2" /> System Settings
          </Button>
        </div>
      </div>

      {/* Modern Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 sticky top-20 z-40 bg-[#f8fafc]/80 backdrop-blur-md -mx-4 px-4 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onPageChange(1); }}
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
          {activeTab === 'overview' && analytics && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${(analytics.metrics.totalRevenue / 1000).toFixed(1)}K`} icon={DollarSign} trend="+24.5%" color="bg-blue-600" />
                <StatCard title="Booking Traffic" value={analytics.metrics.totalBookings} icon={Activity} trend="+12.2%" color="bg-indigo-600" />
                <StatCard title="Partner Network" value={analytics.metrics.totalLabs} icon={Building2} trend="+4.1%" color="bg-violet-600" />
                <StatCard title="User Registry" value={analytics.metrics.totalUsers} icon={Users} trend="+18.4%" color="bg-blue-900" />
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Financial Trajectory</h3>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    System Growth Mode
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.monthlyRevenue}>
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#chartGlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'approvals' || activeTab === 'labs' || activeTab === 'finance' || activeTab === 'users') && (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 capitalize">
                  {activeTab === 'finance' ? 'Platform Bookings' : activeTab} oversight
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {paginationData?.totalItems || 0} Records Found
                </span>
              </div>
              
              {listData.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-24 text-center border border-slate-100 shadow-sm">
                  <CheckCircle2 className="w-16 h-16 text-emerald-100 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-800">No records found</h3>
                  <p className="text-slate-400 text-sm mt-2">The requested governance list is currently empty.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6">
                    {listData.map(item => (
                      <div key={item._id} className="medical-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
                        <div className="flex items-center gap-6 w-full md:w-auto min-w-0">
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                            {activeTab === 'labs' || activeTab === 'approvals' ? <Building2 className="w-8 h-8 text-blue-600" /> : 
                             activeTab === 'users' ? <Users className="w-8 h-8 text-indigo-600" /> : 
                             <Activity className="w-8 h-8 text-emerald-600" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 text-2xl truncate">
                              {item.labName || item.name || `Order #${item._id.substring(item._id.length-8).toUpperCase()}`}
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-1">
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                {item.status || item.role || item.paymentStatus}
                              </p>
                              {item.ownerId && <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Users size={12}/> {item.ownerId?.name}</p>}
                              {item.email && <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.email}</p>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 w-full md:w-auto">
                          {activeTab === 'approvals' && (
                            <>
                              <Button className="flex-1 md:flex-none h-14 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/10 transition-all" onClick={() => handleLabStatus(item._id, 'Approved')}>Approve Accreditation</Button>
                              <Button variant="ghost" className="flex-1 md:flex-none h-14 px-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-all" onClick={() => handleLabStatus(item._id, 'Rejected')}>Reject</Button>
                            </>
                          )}
                          {(activeTab === 'labs' || activeTab === 'users' || activeTab === 'finance') && (
                            <Button variant="outline" className="flex-1 md:flex-none h-14 px-8 rounded-xl border-slate-200 text-slate-600 font-bold flex items-center gap-2">
                              View Details <ChevronRight size={16} />
                            </Button>
                          )}
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
        </AnimatePresence>
      </div>
    </div>
  );
}

