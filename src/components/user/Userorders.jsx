import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersasync, cancelOrder, returnOrder } from '../../redux/user/getordres';
import api from '../../utils/axios';
import axios from 'axios';
 // Import axios for making API calls

const UserOrders = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reason, setReason] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false); // For tracking payment success
  const [popUpMessage, setPopUpMessage] = useState(''); // For displaying success/failure messages

  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  const retryPayment = async (order) => {
    try {
      const options = {
        key: 'rzp_test_homhAZdqfLrL9E',
        amount: order.totalPrice*100, 
        currency: 'INR',
        name: 'Soundmart',
        description: 'Retry Transaction',
        image: '/your_logo.png',
        order_id: order.id,
        handler: async (response) => {
          const razorpay_payment_id = response.razorpay_payment_id;

          try {
            const paymentVerification = await axios.post('http://localhost:5000/verify-payment', {
              razorpay_payment_id: razorpay_payment_id,
              amount: order.totalPrice*100,
              orderId: order._id,
            }, { withCredentials: true });

            if (paymentVerification.data.success) {
              setOrderSuccess(true);
              setPopUpMessage('Order placed successfully!');
              setTimeout(() => {
                setOrderSuccess(false);
                window.location.reload();
              }, 2000);
            } else {
              alert('Payment verification failed. Please try again.');
            }
          } catch (verificationError) {
            console.error('Payment verification failed', verificationError);
            alert('Retry payment failed. Please check your internet connection.');
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
    } catch (error) {
      console.error('Retry payment failed', error);
      alert('Retry payment failed. Please try again.');
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/user/invoice/${orderId}`, {
        withCredentials: true,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(getOrdersasync());
      setLoading(false);
    };
    fetchOrders();
  }, [dispatch]);

  const handleCancelOrder = (orderId, productId) => {
    setModalType('cancel');
    setSelectedOrder(orderId);
    setSelectedProduct(productId);
    setShowModal(true);
  };

  const handleReturnOrder = (orderId, productId) => {
    setModalType('return');
    setSelectedOrder(orderId);
    setSelectedProduct(productId);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (modalType === 'cancel') {
      dispatch(cancelOrder({ orderId: selectedOrder, productId: selectedProduct, reason }));
    } else if (modalType === 'return') {
      dispatch(returnOrder({ orderId: selectedOrder, productId: selectedProduct, reason }));
    }
    setShowModal(false);
    setReason(''); // Reset reason after confirmation
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      {orders.slice().reverse().map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded">
          <div className="flex justify-between mb-2">
            <div>
              <p>Order ID: {order._id}</p>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                Ship To: {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
              </p>
            </div>
            <div className="text-right">
  <p className="font-bold">Total: ₹{order.totalPrice.toLocaleString()}</p>
  <p>Payment Method: {order.paymentMethod}</p>
  <p>Payment Status: {order.paymentStatus}</p>
  <p>Coupon Amount: ₹{order.couponAmount}</p>
  
  
  <button className='bg-blue-500 text-white mt-4 p-2' onClick={() => downloadInvoice(order._id)}>
    Download Invoice
  </button>



  {order.paymentStatus !== "Paid" && (
    <button 
      className='bg-red-500 text-white mt-4 p-2 ml-2' 
      onClick={() => retryPayment(order)}
    >
      Retry Payment
    </button>
  )}
</div>

          </div>

          <h2 className="text-xl font-bold mb-2">Products</h2>
          {order.products.map((product) => (
            <div key={product._id} className="border p-4 mb-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ₹{product.price.toLocaleString()}</p>
                  <p>Status: {product.status}</p>
                </div>
                <div>
                  {['Ordered', 'Shipped'].includes(product.status) && (
                    <button
                      className="border border-gray-300 px-4 py-2 rounded"
                      onClick={() => handleCancelOrder(order._id, product._id)}
                    >
                      Cancel order
                    </button>
                  )}
                  {product.status === 'Delivered' && (
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleReturnOrder(order._id, product._id)}
                    >
                      Return product
                    </button>
                  )}
                  {product.status === 'Cancelled' && (
                    <p className="text-red-600 font-bold">Cancelled</p>
                  )}
                  {product.status === 'Returned' && (
                    <p className="text-red-600 font-bold">Returned</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <p>
              <strong>Last Updated On:</strong> {new Date(order.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              {modalType === 'cancel' ? 'Cancel Order' : 'Return Product'}
            </h2>
            <p className="mb-4">
              Are you sure you want to {modalType === 'cancel' ? 'cancel' : 'return'} this product?
            </p>

            {/* Reason selection */}
            <label htmlFor="reason" className="block mb-2">Select a reason:</label>
            <select
              id="reason"
              className="w-full mb-4 p-2 border rounded"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="Changed mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found better price">Found a better price</option>
            </select>

            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up message */}
      {popUpMessage && (
        <div className="fixed bottom-0 right-0 p-4 bg-green-500 text-white">
          {popUpMessage}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
