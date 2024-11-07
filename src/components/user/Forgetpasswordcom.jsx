
import { Link } from "react-router-dom";

const Forgetpasswordcom = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Left Section */}
        <div className="hidden md:block md:w-1/2 bg-red-500 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Forgot Your Password?
          </h2>
          <p className="text-sm text-white">
            Dont worry, we can help you reset it. Enter your phone number or email, verify the OTP, and set a new password.
          </p>
        </div>

        {/* Right Section (Forget Password Form) */}
        <div className="w-full md:w-1/2 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
                Phone Number or Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-red-500"
                type="text"
                id="contact"
                placeholder="Enter your phone number or email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                OTP
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-red-500"
                type="text"
                id="otp"
                placeholder="Enter the OTP sent to your contact"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                New Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-red-500"
                type="password"
                id="new-password"
                placeholder="Enter your new password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Re-enter New Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-red-500"
                type="password"
                id="confirm-password"
                placeholder="Re-enter your new password"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none"
                type="submit"
              >
                Continue
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-700">
                Remembered your password?{" "}
                <Link to="/login" className="text-green-500 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgetpasswordcom;
