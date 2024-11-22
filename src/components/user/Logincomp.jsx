import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google"; // Import Google login hook
import { FcGoogle } from "react-icons/fc"; // Import Google icon
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import api from "../../utils/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user/auth";
import { getCartAsync } from "../../redux/user/Cart";
const Logincomp = () => {
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState({
    success: false,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await api.get("/user/usertoken-verify", {
          withCredentials: true,
        });
        if (res.status === 201) {
          setLoginStatus({
            success: true,
            message: "You are already logged in!",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking user token:", error);
      }
    };

    checkToken();
  }, [navigate]);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let validationErrors = {};
    if (!loginData.email) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!loginData.password) {
      validationErrors.password = "Password is required";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form before submitting
    if (!validateForm()) return;
  
    try {
      // Make the API call to the login endpoint
      const response = await api.post("/user/login", loginData, {
        withCredentials: true, 
      });
  
      
      if (response.status === 200) {
        setLoginStatus({ success: true, message: "Login successful!" });
        
        // Get the user data from the response
        const user = response.data.user;
  
        // Dispatch the user data to the Redux store
        dispatch(setUser(user));
  
        // Store the token in cookies for future requests
        Cookies.set("token", response.data.token);
               dispatch(getCartAsync())
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Handle login failure
        setLoginStatus({
          success: false,
          message: "Login failed. Please try again.",
        });
      }
    } catch (error) {
      // Handle any errors that occurred during the API call
      setLoginStatus({
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };
  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.get(`user/google?code=${tokenResponse.code}`, { withCredentials: true });
        console.log("Google login successful:", response.data);
        navigate("/")
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
        <h2 className="text-4xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {loginStatus.message && (
          <div
            className={`mb-4 text-center py-2 px-4 rounded-lg ${
              loginStatus.success
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {loginStatus.message}
          </div>
        )}

        {!loginStatus.success && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-white text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                type="email"
                id="email"
                placeholder="Enter your email"
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-white text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-gray-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                type="password"
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              className="w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none transition duration-300"
              type="submit"
            >
              Login
            </button>
            <button
              type="button"
              onClick={googleLogin}
              className="w-full mt-4 flex items-center justify-center bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none transition duration-300"
            >
              <FcGoogle className="mr-2" />
              Login with Google
            </button>
            <div className="flex justify-between items-center mt-4">
              <Link
                to="/forgetpassword"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
              <Link
                to="/register"
                className="text-sm text-blue-500 hover:underline"
              >
                Register here
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Logincomp;
