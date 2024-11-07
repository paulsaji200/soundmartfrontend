import { useSelector, useDispatch } from "react-redux";
import { Children, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { setUser } from "../redux/user/auth";
import api from "./axios";

const UserProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await api.get("user/verifyuser", {
          withCredentials: true,
        });
        dispatch(setUser(response.data.user));
        console.log("User authenticated");
      } catch (error) {
        console.error("Token validation failed", error);
        dispatch(setUser(null));
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    
    return <Navigate to="/login" />;
  }

  return children;
};

export default UserProtectedRoute;
