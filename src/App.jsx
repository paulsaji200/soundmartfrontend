import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./components/global/Nav";
import Footer from "./components/global/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
   
      <>
        <Nav />
        <div className="pt-20">
         
          <Outlet />
        </div>
        <Footer/>
      </>
 
  );
};

export default App;
