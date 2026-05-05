import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { ShoppingCart, Trash2, ShieldCheck, MapPin, Clock, Star, Activity, User as UserIcon, Calendar, Info, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LabDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [lab, setLab] = useState(null);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart and Booking State
  const { items: cartItems, labId: cartLabId, addToCart, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const [bookingDetails, setBookingDetails] = useState({
    fullName: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    address: '',
    slot: '',
    notes: ''
  });

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const [labRes, testsRes] = await Promise.all([
          api.get(`/labs/${id}`),
          api.get(`/tests/lab/${id}`)
        ]);
        setLab(labRes.data);
        setTests(testsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabData();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post('/bookings', {
        labId: lab._id,
        testIds: cartItems.map(item => item._id),
        patientDetails: {
          fullName: bookingDetails.fullName,
          age: parseInt(bookingDetails.age),
          gender: bookingDetails.gender,
          phone: bookingDetails.phone,
          address: bookingDetails.address
        },
        slot: bookingDetails.slot,
        amountPaid: getTotalPrice(),
        notes: bookingDetails.notes
      });

      const { booking, order } = res.data;

      if (order.id.startsWith('dummy_order')) {
        await api.post('/bookings/verify-payment', {
          razorpay_order_id: order.id,
          razorpay_payment_id: 'dummy_pay_' + Date.now(),
          razorpay_signature: 'dummy_sig',
          bookingId: booking._id
        });
        clearCart();
        navigate('/dashboard');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_12345',
        amount: order.amount,
        currency: order.currency,
        name: "HomeTester",
        description: `Booking for ${cartItems.length} tests`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post('/bookings/verify-payment', {
              ...response,
              bookingId: booking._id
            });
            clearCart();
            navigate('/dashboard');
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: bookingDetails.fullName,
          contact: bookingDetails.phone,
        },
        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setShowCheckout(false);

    } catch (error) {
      console.error(error);
      alert('Failed to create booking');
    }
  };

  if (isLoading) return <div className="text-center py-24 text-slate-500 font-medium">Preparing Lab Profile...</div>;
  if (!lab) return <div className="text-center py-24 text-slate-500 font-medium">Laboratory record not found.</div>;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
      
      {/* Lab Header Profile */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} />
              Verified Partner Laboratory
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">{lab.labName}</h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <MapPin className="text-blue-500 w-5 h-5 shrink-0" />
              <p className="text-lg">{lab.address}, {lab.city} - {lab.pincode}</p>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operating Hours</p>
                  <p className="font-bold text-slate-800">{lab.operatingTimings?.open} - {lab.operatingTimings?.close}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Home Collection</p>
                  <p className="font-bold text-slate-800">{lab.homeCollectionAvailable ? 'Available' : 'Clinic Only'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 text-center space-y-4">
            <div className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-2">
              {lab.rating} <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trust Rating</p>
            <div className="h-px bg-slate-200 w-12 mx-auto" />
            <p className="text-slate-500 text-sm font-medium">Based on {lab.reviewCount} verified patient visits</p>
          </div>
        </div>
      </div>

      {/* Tests Catalog */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Available Test Panels</h2>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{tests.length} Panels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map(test => (
            <div key={test._id} className="medical-card p-8 flex flex-col group">
              <div className="mb-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">
                  {test.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{test.testName}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{test.description}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-2"><Clock size={14}/> Report Delivery</span>
                  <span className="font-bold text-slate-800">{test.reportDeliveryTime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-2"><Info size={14}/> Fasting Required</span>
                  <span className="font-bold text-slate-800">{test.fastingRequired ? 'Yes (8-12h)' : 'No'}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">₹{test.discountedPrice}</p>
                  <p className="text-xs text-slate-400 line-through">₹{test.originalPrice}</p>
                </div>
                {cartItems.some(item => item._id === test._id) ? (
                  <Button 
                    variant="outline"
                    className="rounded-xl border-red-100 text-red-600 hover:bg-red-50"
                    onClick={() => removeFromCart(test._id)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 font-bold shadow-lg shadow-blue-600/10 transition-all active:scale-95" 
                    onClick={() => {
                      const res = addToCart(test, lab._id);
                      if (!res.success) alert(res.message);
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {tests.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No tests currently available from this laboratory.</p>
          </div>
        )}
      </div>

      {/* Floating Modern Cart Summary */}
      <AnimatePresence>
        {cartItems.length > 0 && cartLabId === lab._id && !showCheckout && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl"
          >
            <div className="bg-slate-900 text-white rounded-[2rem] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-4 pl-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cartItems.length} Tests Selected</p>
                  <p className="text-xl font-bold">₹{getTotalPrice()}</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowCheckout(true)}
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 px-8 font-bold text-lg"
              >
                Checkout Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Overlay Redesign */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Secure Checkout</h2>
                    <p className="text-xs text-slate-500 font-medium">Verify your details and proceed to payment</p>
                  </div>
                </div>
                <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 grid lg:grid-cols-5 gap-12">
                
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order Summary</h3>
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div key={item._id} className="flex justify-between items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate">{item.testName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-slate-900 text-sm">₹{item.discountedPrice}</p>
                            <button onClick={() => {
                              removeFromCart(item._id);
                              if (cartItems.length === 1) setShowCheckout(false);
                            }} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total Payable</span>
                    <span className="text-2xl font-bold text-blue-600">₹{getTotalPrice()}</span>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-700">Safe & Secure Payment via Razorpay</p>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleBook} className="lg:col-span-3 space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <UserIcon size={16} /> Patient Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1">Full Name</label>
                        <Input required placeholder="As per ID proof" className="h-12 rounded-xl" value={bookingDetails.fullName} onChange={e => setBookingDetails({...bookingDetails, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1">Phone Number</label>
                        <Input required placeholder="For collection coordination" className="h-12 rounded-xl" value={bookingDetails.phone} onChange={e => setBookingDetails({...bookingDetails, phone: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1">Age</label>
                        <Input required type="number" placeholder="Years" className="h-12 rounded-xl" value={bookingDetails.age} onChange={e => setBookingDetails({...bookingDetails, age: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 ml-1">Gender</label>
                        <select 
                          className="flex h-12 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required 
                          value={bookingDetails.gender} 
                          onChange={e => setBookingDetails({...bookingDetails, gender: e.target.value})}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2"><MapPin size={14}/> Collection Address</label>
                      <Input required placeholder="Complete home/office address" className="h-12 rounded-xl" value={bookingDetails.address} onChange={e => setBookingDetails({...bookingDetails, address: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-2"><Calendar size={14}/> Preferred Collection Time</label>
                      <Input required type="datetime-local" className="h-12 rounded-xl" value={bookingDetails.slot} onChange={e => setBookingDetails({...bookingDetails, slot: e.target.value})} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                    Proceed to Payment • ₹{getTotalPrice()}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
