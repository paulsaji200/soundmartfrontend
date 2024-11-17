import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const WalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [amount, setAmount] = useState('1000');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await api.get('/user/getwallet', { withCredentials: true });
        setWalletData(response?.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, []);

  if (!walletData) {
    return <div style={{ textAlign: 'center', padding: '1rem' }}>Loading...</div>;
  }

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem', fontSize: '1.5rem' }}>🏦</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Wallet</span>
        </div>
        <div style={{ color: '#1E40AF', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Wallet Balance : ₹ {parseFloat(walletData.balance).toFixed(2)}
        </div>
      </div>
      
      <button style={{ 
        width: '100%', 
        backgroundColor: '#DC2626', 
        color: 'white', 
        padding: '0.75rem', 
        borderRadius: '4px', 
        border: 'none', 
        marginBottom: '1rem', 
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        VIEW TRANSACTION HISTORY
      </button>
      
      <div style={{ 
        marginBottom: '1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden'
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
        
        {walletData.transactions.map((transaction, index) => (
          <div key={index} style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: index < walletData.transactions.length - 1 ? '1px solid #e0e0e0' : 'none',
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

      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
        <a href="#" style={{ color: '#1E40AF', textDecoration: 'none' }}>View More...</a>
      </div>

      <div style={{ 
        backgroundColor: '#FDE7F3', 
        padding: '1.5rem', 
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>ADD MONEY TO WALLET</h2>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginBottom: '1rem', 
              borderRadius: '4px', 
              border: '1px solid #e0e0e0',
              fontSize: '1rem'
            }}
          />
          <button style={{ 
            backgroundColor: '#6B21A8', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '4px', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%'
          }}>
            PAY
          </button>
        </div>
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Payment Method</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Select any payment method</p>
          <div>
            {['Debit Card / Credit card', 'UPI Method', 'Internet Banking'].map((method, index) => (
              <label key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.75rem',
                fontSize: '1rem'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.toLowerCase().replace(/ /g, '')}
                  checked={paymentMethod === method.toLowerCase().replace(/ /g, '')}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                />
                {method}
              </label>
            ))}
          </div>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic' }}>*Internet Charges may apply</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
