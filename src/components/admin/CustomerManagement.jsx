import React, { useEffect, useState } from 'react';
import { FcApproval, FcCancel } from "react-icons/fc";
import ReactPaginate from 'react-paginate';
import api from '../../utils/axios';

const CustomerManagement = () => {
  const [customerData, setCustomerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customersPerPage = 25;
  const offset = currentPage * customersPerPage;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/viewcustomer");
        setCustomerData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching customer data');
        setLoading(false);
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  const statusButton = async (customer) => {
    try {
      await api.put(`/admin/userstatus/${customer._id}`);
      const updatedCustomers = await api.get("/admin/viewcustomer");
      setCustomerData(updatedCustomers.data.data);
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const paginatedCustomers = customerData.slice(offset, offset + customersPerPage);
  const pageCount = Math.ceil(customerData.length / customersPerPage);

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="bg-white rounded p-4 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Customers</h2>
        <div className="overflow-auto flex-grow">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Mobile</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Update</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer, index) => (
                <tr key={customer._id}>
                  <td className="py-2 px-4 border-b">{offset + index + 1}</td>
                  <td className="py-2 px-4 border-b">{customer?.name || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{customer?.email || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{customer?.phoneNumber || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {customer.blocked ? <FcCancel /> : <FcApproval />}
                  </td>
                  <td className="py-2 px-4 border-b flex justify-center space-x-2">
                    <button
                      onClick={() => statusButton(customer)}
                      className={`text-white p-2 rounded w-20 ${
                        customer.blocked ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {customer.blocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex space-x-2"}
            activeClassName={"bg-blue-500 text-white"}
            pageClassName={"p-2 bg-gray-200 rounded"}
            previousClassName={"p-2 bg-gray-200 rounded"}
            nextClassName={"p-2 bg-gray-200 rounded"}
            breakClassName={"p-2 bg-gray-200 rounded"}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
