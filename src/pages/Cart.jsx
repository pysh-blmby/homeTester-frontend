import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, ShoppingBag, ShieldCheck, MapPin, Calendar, CreditCard, ChevronRight, User as UserIcon, Activity, RefreshCw, AlertCircle, Clock, Heart, CheckCircle2, Lock } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const [masterDetails, setMasterDetails] = useState({
    fullName: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    address: '',
    slot: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    const labId = item.labId._id || item.labId;
    if (!acc[labId]) {
      acc[labId] = {
        labDetails: item.labDetails,
        tests: [],
        subTotal: 0
      };
    }
    acc[labId].tests.push(item);
    acc[labId].subTotal += item.discountedPrice;
    return acc;
  }, {});

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!masterDetails.address || !masterDetails.slot) {
      alert('Collection address and time slot are required.');
      return;
    }

    setIsProcessing(true);
    try {
      const bookingsPayload = Object.keys(groupedItems).map(labId => ({
        labId,
        testIds: groupedItems[labId].tests.map(t => t._id),
        subTotal: groupedItems[labId].subTotal,
      }));

      const res = await api.post('/bookings/multi', {
        bookings: bookingsPayload,
        totalAmount: getTotalPrice(),
        patientDetails: {
          fullName: masterDetails.fullName,
          age: parseInt(masterDetails.age),
          gender: masterDetails.gender,
          phone: masterDetails.phone,
          address: masterDetails.address
        },
        slot: masterDetails.slot,
      });

      const { bookings, order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_12345',
        amount: order.amount,
        currency: order.currency,
        name: "HomeTester Health",
        description: `Diagnostic Booking`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post('/bookings/verify-payment', {
              ...response,
              bookingIds: bookings.map(b => b._id)
            });
            clearCart();
            setIsSuccess(true);
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: masterDetails.fullName, contact: masterDetails.phone },
        theme: { color: "#2563eb" }
      };

      if (order.id.startsWith('dummy_order')) {
          await api.post('/bookings/verify-payment', {
            razorpay_order_id: order.id,
            razorpay_payment_id: 'dummy_pay_' + Date.now(),
            razorpay_signature: 'dummy_sig',
            bookingIds: bookings.map(b => b._id)
          });
          clearCart();
          setIsSuccess(true);
          return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-center p-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 md:p-16 rounded-[3rem] max-w-2xl shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Booking Confirmed</h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">Your diagnostic request has been successfully placed. You can track the status and download reports from your dashboard.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/dashboard')} className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10">Go to Dashboard</Button>
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1 h-14 border-slate-200 text-slate-600 font-bold rounded-2xl">Return Home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-200" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Your cart is empty</h2>
        <p className="text-slate-400 font-medium mt-2 mb-8 max-w-xs mx-auto">It seems you haven't added any diagnostic tests to your booking yet.</p>
        <Button onClick={() => navigate('/search')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-12 h-14 shadow-xl shadow-blue-600/10 transition-all active:scale-95">
          Browse Available Tests
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-32 pt-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Review Your Booking</h1>
            <p className="text-slate-500 font-medium">Verify your selected tests and patient information.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs font-bold uppercase tracking-widest text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Checkout
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-8">
            {Object.keys(groupedItems).map(labId => {
              const group = groupedItems[labId];
              return (
                <div key={labId} className="medical-card overflow-hidden">
                  <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/10">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{group.labDetails?.labName}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">{group.tests.length} Tests</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {group.tests.map((item) => (
                      <div key={item._id} className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-2">
                          <h4 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{item.testName}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> {item.reportDeliveryTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="font-bold text-xl text-slate-900">₹{item.discountedPrice}</p>
                            <p className="text-xs text-slate-400 line-through font-medium">₹{item.originalPrice}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 transition-colors h-12 w-12 rounded-2xl hover:bg-red-50" onClick={() => removeFromCart(item._id)}>
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Privacy Reassurance */}
            <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">Your health data is protected</p>
                <p className="text-xs text-blue-700/70 font-medium leading-relaxed">We follow strict medical privacy protocols. Your patient information and reports are encrypted and shared only with authorized medical professionals.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-10 sticky top-28">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Patient Information</h3>
                <p className="text-sm text-slate-400 font-medium">Please provide accurate details for sample collection.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="As per medical ID" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-sm"
                      value={masterDetails.fullName}
                      onChange={e => setMasterDetails({...masterDetails, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                    <input 
                      type="number" 
                      placeholder="Years" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-sm"
                      value={masterDetails.age}
                      onChange={e => setMasterDetails({...masterDetails, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-sm"
                      value={masterDetails.gender}
                      onChange={e => setMasterDetails({...masterDetails, gender: e.target.value})}
                    >
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Collection Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Full home or office address" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-sm"
                      value={masterDetails.address}
                      onChange={e => setMasterDetails({...masterDetails, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Time Slot</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="datetime-local" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-14 pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-sm"
                      value={masterDetails.slot}
                      onChange={e => setMasterDetails({...masterDetails, slot: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="flex justify-between items-end mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Grand Total</span>
                    <p className="text-sm font-medium text-slate-500">(All inclusive)</p>
                  </div>
                  <span className="text-4xl font-bold text-slate-900">₹{getTotalPrice()}</span>
                </div>
                <Button 
                  onClick={handleCheckout} 
                  disabled={isProcessing}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Proceed to Payment</>}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                  <Lock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile Summary */}
      <div className="md:hidden fixed bottom-24 left-4 right-4 z-50">
        <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-white/10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
            <p className="text-2xl font-bold text-white tracking-tight">₹{getTotalPrice()}</p>
          </div>
          <Button onClick={handleCheckout} className="bg-blue-600 text-white font-bold rounded-xl px-10 h-12 shadow-lg shadow-blue-600/20 transition-all active:scale-95">Pay Now</Button>
        </div>
      </div>
    </div>
  );
}

