import{ useState } from 'react';
import { MailIcon, ArrowRightIcon } from 'lucide-react';
import api from '../../utils/axios';

const EnterEmailComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Invalid email address');
      }
          console.log(email)
      const ab = await api.post("/user/forgetpassword",{email:email},{withCredentials:true});
   console.log(ab)

      setMessage('Reset link sent to your email!');
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Enter Your Email</h2>
        
        {message && (
          <p className={`mb-4 ${message.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-10 pr-3 py-2 border text-black rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            ) : (
              <>
                Send Reset Link
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterEmailComponent;