import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartAsync, getCartAsync } from '../../redux/user/Cart';
import api from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../global/Nav';
import axios from 'axios';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const [addresses, setAddresses] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState('');
  const[walletamount,setwalletamount] = useState(0);

  useEffect(() => {
    const fetchCartAndAddresses = async () => {
      dispatch(getCartAsync()); // Fetch the cart

      try {
        const response = await api.get('/user/getaddress', { withCredentials: true });
        const walletresponse = await api.get('/user/getwallet', { withCredentials: true });
        setwalletamount(walletresponse.data.balance)
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]);
        }
      } 
      catch (error) {
        console.error('Failed to fetch addresses', error);
      }
    };

    fetchCartAndAddresses();
  }, [dispatch]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!cart || !cart.totalPrice) return; 

      try {
        const response = await api.get('/user/getcoupon', {
          params: { amount: cart.totalPrice },
          withCredentials: true,
        });
 console.log(response.data)
        setCoupons(response.data);
      } catch (error) {
        console.error('Failed to fetch coupons', error);
      }
    };

    if (cart && cart.totalPrice > 0) {
      fetchCoupons();
    }
  }, [cart]);

  useEffect(() => {
    if (cart && cart.products) {
      setSubtotal(cart.totalPrice);
      setTotal(cart.totalPrice);
    }
  }, [cart]);

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    const selected = addresses.find((addr) => addr._id === selectedId);
    setSelectedAddress(selected);
  };

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async (coupon) => {
    try {
      const response = await api.post(
        'user/couponapply',
        { couponCode: coupon.code, totalPrice: subtotal },
        { withCredentials: true }
      );

      if (response.data.success) {
        setDiscount(response.data.discountAmount);
        setTotal(subtotal - response.data.discountAmount);
        setSelectedCoupon(coupon);
        setCouponError('');
      } else {
        setCouponError(response.data.message || 'Invalid coupon code.');
      }
    } catch (error) {
      console.error('Failed to apply coupon', error);
      setCouponError('Failed to apply coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = async () => {
    if (!selectedCoupon) return;

    try {
   
      setTotal(subtotal);
      setSelectedCoupon(null);
      setDiscount(0);
    } catch (error) {
      console.error('Failed to remove coupon', error);
    }
  };
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert('Please select a delivery address and payment method.');
      return;
    }
  
    try {
      const loadRazorpayWithRetry = async (retryCount = 0) => {
        const isRazorpayLoaded = await loadRazorpay();
        if (!isRazorpayLoaded && selectedPayment === 'Razorpay' && retryCount < 3) {
          const retry = window.confirm('Razorpay SDK failed to load. Would you like to try again?');
          if (retry) {
            return loadRazorpayWithRetry(retryCount + 1);
          }
        }
        return isRazorpayLoaded;
      };
  
      const isRazorpayLoaded = await loadRazorpayWithRetry();
      if (!isRazorpayLoaded && selectedPayment === 'Razorpay') {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }
  
      const orderData = {
        address: {
          street: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.pincode,
          country: selectedAddress.state,
        },
        paymentMethod: selectedPayment,
        products: cart.products.map((item) => ({
          productId: item.productId._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        discount: discount,
        totalPrice: total,
      };
  
      const orderRes = await api.post('/user/createorder', { orderData }, { withCredentials: true });
      const order = orderRes.data;
  
      if (selectedPayment === 'Razorpay') {
        const options = {
          key: 'rzp_test_homhAZdqfLrL9E',
          amount: order.totalPrice*100, // In paise
          currency: 'INR',
          name: 'SoundMart',
          description: 'Test Transaction',
          image: '/your_logo.png',
          order_id: order.id,
          handler: async (response) => {
            const razorpay_payment_id = response.razorpay_payment_id;
  
            
            const paymentVerification = await axios.post('http://localhost:5000/verify-payment', {
              razorpay_payment_id: razorpay_payment_id,
              amount: order.totalPrice*100,
              orderId: order._id
            }, { withCredentials: true });
  
            if (paymentVerification.data.success) {
              setOrderSuccess(true);
              setPopUpMessage('Order placed successfully!');
              await api.delete('/user/clearcart', { withCredentials: true });
              setTimeout(() => {
                setOrderSuccess(false);
                navigate('/'); // Navigate after successful payment verification
              }, 2000);
            } else {
              navigate("/cart")
              alert('Payment verification failed. Please try again.');
            }
          },
          prefill: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
      
      
     
      
      
      
      else {
        
        setOrderSuccess(true);
        setPopUpMessage('Order placed successfully with Cash on Delivery!');
  
        setTimeout(async () => {
          await dispatch(clearCartAsync()); // Clear the cart after showing the success message
          setOrderSuccess(false);
          navigate('/'); 
        }, 6000);
      }
    } catch (error) {
      
      navigate("/cart")
      console.error('Failed to place order', error);
      alert('Failed to place the order. Please try again.');
    }
  };
  
  const handleChange = (e) => {
    if (e.target.value === 'addNew') {
      navigate('/userprofile/addaddress'); 
    } else {
      handleAddressChange(e); 
    }
  }
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row p-6 gap-8">
            <Nav />
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold mb-6 text-gray-800">CHECKOUT</h1>

              {orderSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r">
                  Order placed successfully!
                </div>
              )}

              <div className="flex mb-6 gap-4 overflow-x-auto">
                {cart.products.map((item) => (
                  <img
                    key={item.productId._id}
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded-md shadow"
                  />
                ))}
              </div>

              <p className="text-green-600 mb-6 font-medium">
                Arrives By {new Date().toLocaleDateString()}
              </p>

              <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Delivery Address</h2>
      
      <select
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-3"
        value={selectedAddress ? selectedAddress._id : 'default'}
        onChange={handleChange}
      >
        <option value="default" disabled>
          Select an Address
        </option>
        {addresses.map((addr) => (
          <option key={addr._id} value={addr._id}>
            {addr.name} - {addr.location}
          </option>
        ))}
        <option value="addNew">Add New Address</option> {/* Option to add a new address */}
      </select>

      {selectedAddress && (
        <p className="text-gray-700">
          {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
        </p>
      )}
    </div>
              {/* Coupons Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Coupons</h2>
                {coupons.length > 0 ? (
                  <div className="grid gap-3 mb-4">
                    {coupons.map((coupon) => (
                      <div key={coupon.code} className="border p-4 rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{coupon.code}</p>
                          <p className="text-gray-500">{coupon.description}</p>
                        </div>
                        {selectedCoupon && selectedCoupon.code === coupon.code ? (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            onClick={handleRemoveCoupon}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                            onClick={() => handleApplyCoupon(coupon)}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No coupons available.</p>
                )}
                {couponError && <p className="text-red-500">{couponError}</p>}
              </div>

              <div className="mb-6">
  <h2 className="text-xl font-semibold mb-3 text-gray-700">Payment Method</h2>
  {['Razorpay', total < 4000 && 'Cash On Delivery',walletamount>total&&"Wallet"]
    .filter(Boolean) // Filter out null/false values
    .map((method) => (
      <label key={method} className="flex items-center mb-3">
        <input
          type="radio"
          value={method}
          checked={selectedPayment === method}
          onChange={() => handlePaymentChange(method)}
          className="form-radio h-5 w-5 text-blue-600"
        />
        <span className="ml-2 text-gray-700">{method}</span>
      </label>
    ))}
</div>


              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 w-full"
                onClick={handlePlaceOrder}
              >
                PLACE ORDER
              </button>
            </div>

            <div className="lg:w-1/3">
              <h2 className="text-2xl font-semibold mb-3 text-gray-700">Order Summary</h2>
              <div className="p-6 bg-gray-50 rounded-md shadow-md mb-6">
                <div className="flex justify-between mb-4">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-900 font-medium">₹{subtotal}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-gray-600">Discount</p>
                  <p className="text-green-600 font-medium">- ₹{discount}</p>
                </div>
                <div className="flex justify-between mb-6 border-t pt-4">
                  <p className="text-gray-700 font-semibold">Total</p>
                  <p className="text-gray-900 font-bold">₹{total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {orderSuccess && (
 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
 <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
   <div className="flex justify-between items-center mb-4">
     <p className="text-2xl font-semibold text-gray-800">{popUpMessage}</p>
    
   
   </div>

   <div className="mt-6 space-y-4">
     <button 
       className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
       onClick={() => { navigate("/userprofile/orders"); }}
     >
       View Orders
     </button>
     <button 
       className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center"
       onClick={() => { navigate("/"); }}
     >
       Continue Shopping
     </button>
   </div>
   </div>
   </div>
)}

    </div>
    
  );
};

export default CheckoutPage;
