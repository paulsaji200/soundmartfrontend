import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useParams } from 'react-router-dom';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        setError('Error fetching order details');
      }
      setLoading(false);
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await api.put(`/admin/updateorders/${orderId}/${productId}`, { status: newStatus }, { withCredentials: true });
      setOrder({
        ...order,
        products: order.products.map((product) =>
          product.productId._id === productId ? { ...product, status: newStatus } : product
        ),
      });
    } catch (error) {
      setError('Error updating product status');
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  const isStatusChangeAllowed = (status) => {
    return status !== 'Returned' && status !== 'Cancelled';
  };

  const isOrderFinalized = (paymentStatus, productStatus) => {
    return paymentStatus === 'Completed' || !isStatusChangeAllowed(productStatus);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold">Customer Information</h2>
        <p className="text-lg mt-2"><strong>Name:</strong> {order.user.name}</p>
        <p className="text-lg"><strong>Email:</strong> {order.user.email}</p>
        <p className="text-lg mt-4"><strong>Total Price:</strong> ${order.totalPrice}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold">Shipping Address</h2>
        <p className="text-lg mt-2"><strong>Address:</strong> {order.shippingAddress.address}</p>
        <p className="text-lg"><strong>City:</strong> {order.shippingAddress.city}</p>
        <p className="text-lg"><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
        <p className="text-lg"><strong>Country:</strong> {order.shippingAddress.country}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product) => (
              <tr key={product.productId._id} className="text-center border-b">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.quantity}</td>
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">{product.status}</td>
                <td className="py-3 px-4">
                  <select
                    className="bg-gray-100 border rounded px-2 py-1"
                    value={product.status}
                    onChange={(e) => handleStatusChange(product.productId._id, e.target.value)}
                    disabled={isOrderFinalized(order.paymentStatus, product.status)}
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
