import { FaTachometerAlt, FaUsers, FaBoxOpen, FaFileAlt, FaTags, FaChartBar, FaList, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 flex flex-col">
      {/* Sidebar Menu */}
      <div className="flex-grow">
        <nav className="mt-6">
          <ul className="flex flex-col space-y-4 text-left px-4">
            <li className="text-sm font-medium">
              <NavLink
                to="/admin"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}
              >
                <FaTachometerAlt className="mr-2" /> Dashboard
              </NavLink>
            </li>
            <li className="text-sm font-medium">
              <NavLink
                to="/admin/customers"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}
              >
                <FaUsers className="mr-2" /> Customers
              </NavLink>
            </li>
            <li className="text-sm font-medium">
              <NavLink
                to="/admin/products"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}
              >
                <FaBoxOpen className="mr-2" /> Products
              </NavLink>
            </li>

            {/* Other fields without links */}
            <li className="text-sm font-medium">
            <NavLink
                to="/admin/orders"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}
              >
                <FaBoxOpen className="mr-2" /> Orders
              </NavLink>
            </li>
            <li className="text-sm font-medium">
              <div className="flex items-center w-full py-2 px-4 rounded-full bg-pink-200">
                <FaTags className="mr-2" /> Banner Management
              </div>
            </li>
            <li className="text-sm font-medium">
<NavLink
                to="/admin/addcoupon"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}>
<FaStar className="mr-2" /> Coupon Management
</NavLink>
                
             
            </li>
            <li className="text-sm font-medium">
            <NavLink
                to="/admin/report"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}>
                <FaChartBar className="mr-2" /> Sales Report
             </NavLink>
            </li>
            <li className="text-sm font-medium">
              <NavLink
                to="/admin/category"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}
              >
                <FaList className="mr-2" /> Category
              </NavLink>
            </li>
            <NavLink
                to="/admin/brandmanagement"
                className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}>
                BrandManagement
             </NavLink>
          </ul>
        </nav>
      </div>

      {/* Settings and Logout */}
      <div className="mt-auto px-4 py-4">
        <ul className="flex flex-col space-y-4 text-left">
          <li className="text-sm font-medium">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => `flex items-center w-full py-2 px-4 rounded-full ${isActive ? 'bg-black text-white' : 'bg-pink-200 hover:bg-pink-300'}`}
            >
              <FaCog className="mr-2" /> Settings
            </NavLink>
          </li>
          <li className="text-sm font-medium">
            <button className="flex items-center w-full py-2 px-4 rounded-full bg-pink-200 hover:bg-pink-300">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
