import { useState } from 'react';
import api from '../../utils/axios';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("sdbdhsc")
    console.log(email,password)
    try {
      const response = await api.post(
        '/admin/login', 
        {
          email: email,
          password: password
        },
        {
          withCredentials: true 
        }
      );

      if (response.status === 201) {
        setSuccess('Login successful! Redirecting...');
        setError(''); // Clear any previous errors
        setTimeout(() => {
          navigate('/admin');
        }, 2000); // Delay for success message to be visible
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setSuccess(''); // Clear any previous successes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {error && (
          <div className="bg-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-200 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
