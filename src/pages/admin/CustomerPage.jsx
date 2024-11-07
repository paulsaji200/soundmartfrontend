import React, { useEffect, useState } from 'react';
import CustomerManagement from '../../components/admin/CustomerManagement';
import axios from 'axios';

const CustomerPage = () => {
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const df = async () => {
      const customers = await axios.get("/api/admin/viewcustomer");
      setCustomerData(customers.data.data);
    };
    df();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {customerData ? (
        <CustomerManagement customers={customerData} />
      ) : (
        <p>No customer available.</p>
      )}
    </div>
  );
};

export default CustomerPage;
