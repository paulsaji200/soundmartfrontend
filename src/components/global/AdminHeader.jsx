
import { FaBell, FaUser, FaHeadset } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';

const AdminNavbar = () => {
  return (
    <div className="bg-pink-700 text-white flex justify-between items-center px-4 py-2 sm:px-6 sm:py-3 shadow-md">
      {/* Left side - Logo */}
      <div className="text-xl font-bold">
        <span>Epicmart</span>
      </div>

      {/* Right side - Support, Notification, Profile */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Support */}
        <div className="flex items-center space-x-1 md:space-x-2 cursor-pointer">
          <FaHeadset className="text-lg md:text-xl" />
          <span className="hidden md:inline">Support</span>
        </div>

        {/* Notification */}
        <div className="relative">
          <FaBell className="text-lg md:text-xl cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-1 md:space-x-2 cursor-pointer">
          <FaUser className="text-lg md:text-xl" />
          <RiArrowDropDownLine className="text-lg md:text-xl" />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
