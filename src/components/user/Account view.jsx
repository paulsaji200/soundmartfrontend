import React, { useState, useEffect } from 'react';
import api from '../../utils/axios'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';

const UserOverview = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '••••••••',
  });
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [formValues, setFormValues] = useState(userInfo); // Local state for form values

  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user/profile', { withCredentials: true });
        setUserInfo({
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          password: '••••••••',
        });
        setFormValues({
          name: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          password: '',
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedInfo = {
        name: formValues.name,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
      };

  
      await api.put('/user/editprofile', updatedInfo, { withCredentials: true });
      setUserInfo(updatedInfo);
      setIsEditing(false); 
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const inputStyle = (isEditable) => (
    isEditable
      ? 'w-full px-3 py-2 border border-gray-300 rounded-md'
      : 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500'
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">My Details</h2>

      <div className="space-y-6">
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className={inputStyle(isEditing)}
            readOnly={!isEditing}
          />
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className={inputStyle(isEditing)}
            readOnly={!isEditing}
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            className={inputStyle(isEditing)}
            readOnly={!isEditing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={isEditing ? formValues.password : userInfo.password}
            onChange={handleChange}
            className={inputStyle(false)}
            readOnly
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
        
        {isEditing ? (
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
        )}

       
        <button
          onClick={() => {
            navigate('/forgetpassword');
          }}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default UserOverview;
