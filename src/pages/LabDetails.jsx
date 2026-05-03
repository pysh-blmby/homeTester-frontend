import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { ShoppingCart, Trash2 } from 'lucide-react';

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

      // Handle dummy order immediately
      if (order.id.startsWith('dummy_order')) {
        await api.post('/bookings/verify-payment', {
          razorpay_order_id: order.id,
          razorpay_payment_id: 'dummy_pay_' + Date.now(),
          razorpay_signature: 'dummy_sig',
          bookingId: booking._id
        });
        alert('Dummy Payment successful & Booking confirmed!');
        clearCart();
        navigate('/dashboard');
        return;
      }

      // Razorpay integration
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
            alert('Payment successful & Booking confirmed!');
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

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (!lab) return <div className="text-center py-12">Lab not found</div>;

  return (
    <div className="space-y-8">
      {/* Lab Header */}
      <Card className="border-none bg-primary/5">
        <CardHeader>
          <CardTitle className="text-3xl">{lab.labName}</CardTitle>
          <CardDescription className="text-lg">
            {lab.address}, {lab.city} - {lab.pincode}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Timings</p>
            <p className="font-medium">{lab.operatingTimings?.open} - {lab.operatingTimings?.close}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Home Collection</p>
            <p className="font-medium">{lab.homeCollectionAvailable ? 'Available' : 'Not Available'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rating</p>
            <p className="font-medium">{lab.rating} ⭐ ({lab.reviewCount} reviews)</p>
          </div>
        </CardContent>
      </Card>

      {/* Tests List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <Card key={test._id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{test.testName}</CardTitle>
                <CardDescription>{test.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">{test.description}</p>
                <div className="flex gap-2 items-center">
                  <span className="text-xl font-bold">₹{test.discountedPrice}</span>
                  <span className="text-sm line-through text-muted-foreground">₹{test.originalPrice}</span>
                </div>
                <div className="text-sm">
                  <p>Delivery: {test.reportDeliveryTime}</p>
                  <p>Fasting: {test.fastingRequired ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
              <CardFooter>
                {cartItems.some(item => item._id === test._id) ? (
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => removeFromCart(test._id)}
                  >
                    Remove from Cart
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      const res = addToCart(test, lab._id);
                      if (!res.success) alert(res.message);
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        {tests.length === 0 && <p className="text-muted-foreground">No tests available for this lab currently.</p>}
      </div>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && cartLabId === lab._id && !showCheckout && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button 
            size="lg" 
            className="rounded-full h-16 px-6 shadow-xl flex items-center gap-2"
            onClick={() => setShowCheckout(true)}
          >
            <ShoppingCart size={24} />
            <span className="text-lg font-bold">{cartItems.length} Tests</span>
            <span className="text-lg opacity-80">| ₹{getTotalPrice()}</span>
          </Button>
        </div>
      )}

      {/* Checkout Form Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Checkout ({cartItems.length} Tests)</CardTitle>
              <CardDescription>Review your cart and fill in patient details to proceed to payment</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              
              {/* Cart Summary */}
              <div className="space-y-4 border-r pr-6">
                <h3 className="font-semibold text-lg">Cart Summary</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium">{item.testName}</p>
                        <p className="text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">₹{item.discountedPrice}</span>
                        <Trash2 
                          size={16} 
                          className="text-destructive cursor-pointer hover:opacity-70"
                          onClick={() => {
                            removeFromCart(item._id);
                            if (cartItems.length === 1) setShowCheckout(false);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input required value={bookingDetails.fullName} onChange={e => setBookingDetails({...bookingDetails, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input required value={bookingDetails.phone} onChange={e => setBookingDetails({...bookingDetails, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input required type="number" value={bookingDetails.age} onChange={e => setBookingDetails({...bookingDetails, age: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required 
                      value={bookingDetails.gender} 
                      onChange={e => setBookingDetails({...bookingDetails, gender: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address for Collection</label>
                  <Input required value={bookingDetails.address} onChange={e => setBookingDetails({...bookingDetails, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Slot (Date & Time)</label>
                  <Input required type="datetime-local" value={bookingDetails.slot} onChange={e => setBookingDetails({...bookingDetails, slot: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setShowCheckout(false)}>Back to Tests</Button>
                  <Button type="submit" className="w-full">Pay ₹{getTotalPrice()}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
