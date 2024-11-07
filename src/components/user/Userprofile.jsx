import Profilesidebar from './Profilesidebar';
import { Outlet } from 'react-router-dom';
import Nav from '../global/Nav';
const UserProfile = () => {
  return (
  
        <div className="flex flex-col h-screen">
        {/* Top navigation */}
        <Nav />
  
        {/* Sidebar and Outlet in a flex row */}
        <div className="p-20 flex flex-1">
          {/* Sidebar */}
          <div className="w-1/5 bg-gray-200">
            <Profilesidebar />
          </div>
  
          {/* Outlet / Main Content */}
          <div className="flex-1 bg-white overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
