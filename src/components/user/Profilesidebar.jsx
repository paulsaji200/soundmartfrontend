
import { Link } from "react-router-dom";
import { logout } from "../../redux/user/auth";
import { useDispatch } from "react-redux";
import api from "../../utils/axios";
const Profilesidebar = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await api.post("user/logout", {}, { withCredentials: true }); 
      dispatch(logout()); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  return (
    <div className=" p-6 bg-gray-800 text-gray-200 shadow-lg min-h-screen">
      <div className="text-center mb-6">
        
        <h2 className="text-xl font-semibold text-green-400">Hello User</h2>
      </div>

      <nav>
        <ul className="space-y-4">
          <li>
            <Link 
              to="/userprofile" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              Account Overview
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/orders" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              My Orders
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/address" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              Manage Addresses
            </Link>
          </li>
          <li>
            <Link 
              to="/wishlist" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              My Wishlist
            </Link>
          </li>
          <li>
            <Link 
              to="/userprofile/wallet" 
              className="block p-4 bg-gray-700 text-green-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            >
              Wallet
            </Link>
          </li>
          <li>
            <Link 
               onClick={handleLogout}
              className="block p-4 bg-gray-700 text-blue-300 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-500 whitespace-normal"
            
           >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Profilesidebar;
