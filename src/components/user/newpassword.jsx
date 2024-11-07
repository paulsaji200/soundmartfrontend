import  { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import api from '../../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EnterPasswordComponent = 
() => {
  const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const user_id = searchParams.get('user_id');
    const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Make an API request to reset the password
      const response = await api.post(
        '/user/resetpassword',
        { user_id, token, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage('Password reset successfully!');
        setTimeout(()=>{
          navigate("/")
        },2000)
        
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Enter New Password</h2>

        {message && <p className="mb-4 text-green-500">{message}</p>}
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Password Input */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterPasswordComponent;
