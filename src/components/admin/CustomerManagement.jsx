import React, { useEffect, useState } from 'react';
import { FcApproval, FcCancel } from "react-icons/fc";
import ReactPaginate from 'react-paginate';
import api from '../../utils/axios';

const CustomerManagement = () => {
  const [customerData, setCustomerData] = useState(null);
  const[change,setchange] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const customersPerPage = 25;
  const offset = currentPage * customersPerPage;
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/admin/viewcustomer");
        setCustomerData(response.data.data);
      } catch (err) {
        setError('Error fetching customer data');
        console.error(err);
      }
    };

    fetchCustomers();
  }, [change]);

  // Function to handle block/unblock status change
  const statusButton = async (customer) => {
    setchange(change+1)
    try {
      const response = await api.put(`/admin/userstatus/${customer._id}`);
      console.log(response.data);
      // Optionally, refresh the customer list here after status change
      // e.g., fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  // Paginate customers
  const paginatedCustomers = customerData ? customerData.slice(offset, offset + customersPerPage) : [];
  const pageCount = customerData ? Math.ceil(customerData.length / customersPerPage) : 0;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="bg-white rounded p-4 flex-grow">
        <h2 className="text-2xl font-bold mb-4">Customers</h2>

        {/* Table Container */}
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
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td className="py-2 px-4 border-b">{offset + index + 1}</td>
                    <td className="py-2 px-4 border-b">{customer.name}</td>
                    <td className="py-2 px-4 border-b">{customer.email}</td>
                    <td className="py-2 px-4 border-b">{customer.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">
                      <button>
                        {customer.blocked ? <FcCancel /> : <FcApproval />}
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b flex justify-center space-x-2">
                      <button className="bg-blue-500 text-white p-2 rounded w-20">
                        Edit
                      </button>
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-2 px-4 border-b text-center">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
