import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await api.get('/user/getwallet', { withCredentials: true });
        setWalletData(response?.data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, []);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < walletData.transactions.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (!walletData) {
    return <div style={{ textAlign: 'center', padding: '1rem' }}>Loading...</div>;
  }

  const paginatedTransactions = walletData.transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '1rem',
      backgroundColor: 'white',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Wallet</h2>
        <div style={{ color: '#1E40AF', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Wallet Balance: ₹ {parseFloat(walletData.balance).toFixed(2)}
        </div>
      </div>

      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#f3f4f6',
          fontWeight: 'bold',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <span>Description</span>
          <span>Type</span>
          <span>Amount</span>
        </div>

        {paginatedTransactions.map((transaction, index) => (
          <div key={index} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
          }}>
            <span>{transaction.description}</span>
            <span>{transaction.type === 'credit' ? 'Credited' : 'Debited'}</span>
            <span style={{
              color: transaction.type === 'credit' ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }}>
              {transaction.type === 'credit' ? `+₹${parseFloat(transaction.amount).toFixed(2)}` : `-₹${parseFloat(transaction.amount).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === 1 ? '#e0e0e0' : '#1E40AF',
            color: 'white',
            borderRadius: '4px',
            border: 'none',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        <span style={{ fontWeight: 'bold' }}>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= walletData.transactions.length}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage * itemsPerPage >= walletData.transactions.length ? '#e0e0e0' : '#1E40AF',
            color: 'white',
            borderRadius: '4px',
            border: 'none',
            cursor: currentPage * itemsPerPage >= walletData.transactions.length ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WalletPage;
