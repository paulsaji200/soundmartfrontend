import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc"; // Google Icon Import
import api from "../../utils/axios";

const Registercomp = () => {
  const [userData, setData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleChange = (e) => {
    setData({ ...userData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!userData.name) newErrors.name = "Name is required";
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!userData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(userData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!userData.password) newErrors.password = "Password is required";
    if (userData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    if (userData.password !== userData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Save the registration data to local storage
      localStorage.setItem("registrationData", JSON.stringify(userData));
      
      // Send email verification request
      await api.post("user/send-otp", { email: userData.email });
      
      setMessage("Registration successful! Please verify your email.");
      navigate("/verify"); // Redirect to OTP verification page
      setData({ name: "", email: "", phoneNumber: "", password: "", confirmPassword: "" });
      setErrors({});
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.get(`user/google?code=${tokenResponse.code}`, { withCredentials: true });
        console.log("Google login successful:", response.data);
      } catch (error) {
        console.log("Google login failed:", error);
      }
    },
    onError: (error) => {
      console.log("Google login error:", error);
    },
    flow: "auth-code",
  });


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-black p-8 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-white text-center mb-6">Register</h2>

        {/* Status Message */}
        {message && (
          <div
            className={`mb-4 text-center py-2 px-4 rounded-lg ${
              message.includes("successful") ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Registration Fields */}
          {/* ... (rest of your registration form fields) */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              id="name"
              value={userData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Phone Number"
              id="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none transition duration-300"
          >
            Register
          </button>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={googleLogin}
            className="w-full mt-4 flex items-center justify-center bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none transition duration-300"
          >
            <FcGoogle className="mr-2" /> {/* Google icon */}
            Register with Google
          </button>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-white">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registercomp;
