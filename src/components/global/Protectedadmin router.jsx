import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed
import api from '../../utils/axios';

const AdminProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get("admin/admintoken-verify",{withCredentials:true}) 
      
      
        console.log(response)
        setIsValid(response.data.valid);
      } catch (err) {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    
    return <div>Loading...</div>;
  }

  if (isValid === false) {
    // If token is invalid or user is not an admin, redirect to the admin login page
    return <Navigate to="/admin/login" />;
  }

  // If token is valid, render the protected component (children)
  return children;
    
};

export default AdminProtectedRoute;
