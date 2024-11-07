import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/axios";

const Otpcom = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Retrieve email from local storage
  const email = localStorage.getItem("registrationData")
    ? JSON.parse(localStorage.getItem("registrationData")).email
    : "";

  useEffect(() => {
    // Check if there's a saved timer end time in local storage
    const savedEndTime = localStorage.getItem("otpEndTime");

    if (savedEndTime) {
      const timeLeft = Math.floor((new Date(savedEndTime).getTime() - new Date().getTime()) / 1000);
      if (timeLeft > 0) {
        setTimer(timeLeft);
        setCanResend(false);
      } else {
        setCanResend(true);
      }
    } else {
      // Start the timer for the first time
      setTimer(60);
      setCanResend(false);
      setOtpSent(true);
      localStorage.setItem("otpEndTime", new Date(new Date().getTime() + 60000).toISOString());
    }

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) return prevTimer - 1;
        clearInterval(countdown);
        setCanResend(true);
        return 0;
      });
    }, 1000);

    return () => clearInterval(countdown); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
    }
  }, [timer]);

  const handleSendOtp = async () => {
    try {
      await api.post("user/send-otp", { email });
      setOtpSent(true);
      setTimer(60); // Reset the timer
      setCanResend(false);
      setMessage("OTP sent successfully");

      // Set the new end time in local storage
      const newEndTime = new Date(new Date().getTime() + 60000).toISOString();
      localStorage.setItem("otpEndTime", newEndTime);

      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        });
      }, 1000);

    } catch (err) {
      setMessage("Error sending OTP. Please try again.");
      console.error("Error sending OTP:", err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await api.post("user/verify-otp", { email, otp: otp.join("") });
      setVerified(true);
      setMessage("OTP verified successfully!");

      // Retrieve and send registration data to the backend
      const registrationData = localStorage.getItem("registrationData");
      if (registrationData) {
        await api.post("/user/register", JSON.parse(registrationData), { withCredentials: true });

        localStorage.removeItem("registrationData");
        localStorage.removeItem("otpSent");
        localStorage.removeItem("otpEndTime");

        setTimeout(() => {
          navigate("/"); // Redirect after successful registration
        }, 2000); // Navigate after 2 seconds
      }
    } catch (err) {


      if(err.response.status===401){
        setMessage("inavalid Otp")   
      }else{
        setMessage("Email verification failed. Please try again.");
        console.error("Error verifying OTP:", err);
      }
      
    }
  };

  const handleResendOtp = () => {
    if (canResend) handleSendOtp();
  };

  // Update OTP input for a 6-column layout
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to the next input field automatically
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="flex shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="w-full bg-gray-900 p-6">
          <h2 className="text-2xl font-bold mb-6">
            {verified ? "Verified!" : "Enter OTP"}
          </h2>

          {/* Display success or error message */}
          {message && (
            <p className={`mb-4 ${verified ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          {/* 6-column OTP input fields */}
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((_, index) => (
              <input
                key={index}
                className="w-10 px-3 py-2 border text-black rounded-lg focus:outline-none focus:border-blue-500 text-center"
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleOtpChange(e.target, index)}
              />
            ))}
          </div>

          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 w-full mb-4"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
          <button
            className={`w-full py-2 px-4 rounded-lg ${canResend ? "bg-blue-500 text-white" : "bg-gray-500 cursor-not-allowed"}`}
            onClick={handleResendOtp}
            disabled={!canResend}
          >
            Resend OTP {timer > 0 && `(${timer}s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otpcom;
