import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loginpage from "../../pages/user/Loginpage";

const PublicRoute = () => {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/userprofile" />;
  }

  return <Loginpage />;
};

export default PublicRoute;
