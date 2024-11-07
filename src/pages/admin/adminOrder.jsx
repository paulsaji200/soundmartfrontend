import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utils/axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/admin/getorders", { withCredentials: true });
        console.log(response.data.data)
        // Access the nested 'data' inside the response object
        setOrders(response.data.data); // Correctly extract the orders array
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  const handleViewDetails = async (orderId) => {
    const response = await axios.get(`/api/admin/orders/${orderId}`);
    const orderDetails = response.data;
  
    // Show a modal or navigate to an Order Details page
    // You can use libraries like React Modal or simply route to a new page
    console.log(orderDetails); // You can pass this data to a modal or details component
  };
  const handleEditOrder = (orderId) => {
    const newStatus = prompt("Enter new status (Processing, Completed, Cancelled):");
    const newPaymentStatus = prompt("Enter payment status (Pending, Paid, Failed):");
  
    axios.put(`/api/admin/orders/${orderId}`, {
      orderStatus: newStatus,
      paymentStatus: newPaymentStatus,
    })
    .then(response => {
      alert("Order updated successfully");
      // Optionally refetch the orders here
    })
    .catch(error => {
      console.error("There was an error updating the order:", error);
    });
  };
  
  

  return (
    <div className="order-table">
      <h2>All Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total Price</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>Details</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name} ({order.user?.email})</td>
              <td>${order.totalPrice}</td>
              <td>{order.orderStatus}</td>
              <td>{order.paymentStatus}</td>
              <td>
                <button onClick={() => handleViewDetails(order._id)}>View</button>
              </td>
              <td>
                <button onClick={() => handleEditOrder(order._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
