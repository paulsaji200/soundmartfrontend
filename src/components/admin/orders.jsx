import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utils/axios';
import { FaEye, FaEdit, FaSpinner, FaSearch } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10); // Number of orders per page
  const [totalOrders, setTotalOrders] = useState(0); // Total number of orders

  const fetchOrders = async (page = 1, query = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/getorders`, {
        params: {
          page,
          limit: ordersPerPage,
          search: query,
        },
        withCredentials: true,
      });
      setOrders(response.data.data);
      setTotalOrders(response.data.totalOrders); // Update the total number of orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when a new search is performed
    fetchOrders(1, searchQuery);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/admin/vieworderdetails/${orderId}`);
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setIsModalOpen(true);
  };

  const handleEditOrder = async () => {
    try {
      await api.patch(`/admin/orders/${selectedOrder._id}`, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
      });

      setSuccessMessage("Order updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, orderStatus: newStatus, paymentStatus: newPaymentStatus }
            : order
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("There was an error updating the order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h2>
      
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 flex items-center"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{(currentPage - 1) * ordersPerPage + index + 1}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.order_ID}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex items-center">
                    <MdAttachMoney className="text-green-500 mr-1" />
                    <p className="text-gray-900 whitespace-no-wrap">{order.totalPrice}</p>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <button
                    onClick={() => handleViewDetails(order._id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEye className="text-xl" />
                  </button>
                  <button
                        onClick={() => openEditModal(order)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-1/3">
      <h3 className="text-lg font-bold mb-4">Edit Order Status</h3>
     
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Payment Status</label>
        <select
          value={newPaymentStatus}
          onChange={(e) => setNewPaymentStatus(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleEditOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}


      {/* Pagination */}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderManagement;
