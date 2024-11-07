import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from './components/global/AdminHeader'
import Sidebar from './components/global/Adminsidebar'
import Nav from './components/global/Nav'
import TopNavbar from './components/global/AdminHeader'
import AdminNav from './components/global/AdminHeader'
import AdminNavbar from './components/global/AdminHeader'


const Admin = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top navigation */}
      <AdminNavbar />

      {/* Sidebar and Outlet in a flex row */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-200">
          <Sidebar />
        </div>

        {/* Outlet / Main Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;

