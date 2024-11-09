import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Registerpage from "../pages/user/Registerpage";
import Homepage from "../pages/user/Homepage";
import Loginpage from "../pages/user/Loginpage";
import Admin from "../Admin";
import CustomerPage from "../pages/admin/CustomerPage";
import ViewProducts from "../components/admin/Viewproducts";
import Category from "../pages/admin/Category";
import Addproduct from "../pages/admin/Addproduct";
import Verify from "../pages/user/Verify";
import EditProductPage from "../pages/admin/Editproduct";
import ProductDetailPage from "../pages/user/Productdetails";
import AdminLoginPage from "../pages/admin/AdminLogin";
import AdminProtectedRoute from "../components/global/Protectedadmin router";
import CustomerManagement from "../components/admin/CustomerManagement";

import Userorders from "../components/user/Userorders";
import Useroverview from "../components/user/Account view";
import AddressManagement from "../components/user/Useraddress";
import AddressForm from "../components/user/Addadress";
import UserProtectedRoute from "../utils/userprotectedrout"; // Make sure the protected route logic is correct
import Userprofile from "../components/user/Userprofile";
import Cart from "../redux/user/Cart";
import ShoppingCart from "../components/user/Cart";
import CheckoutPage from "../components/user/checkout";
import OrderManagement from "../components/admin/orders";
import EnterEmailComponent from "../components/user/enteremail";
import EnterPasswordComponent from "../components/user/newpassword";
import Addaddresspage from "../pages/user/Addaddresspage";
import AdminOrderDetails from "../components/admin/orderdeatils";
import CouponManagement from "../pages/admin/addcoupen";
import WishlistPage from "../components/user/Wishlistcomp";
import WalletPage from "../pages/user/wallet";
import SalesReport from "../pages/admin/Report";
import BrandManagement from "../pages/admin/Brandmanagement";
import AdminDashboard from "../pages/admin/Dashboardadm";
import LandingPage from "../pages/user/Landing";
import PublicRoute from "../components/global/loginprotect";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "register",
        element: <Registerpage />,
      },
      {
        path: "verify",
        element: <Verify />,
      },
      {
        path: "productdetails/:productId",
        element: <ProductDetailPage />,
      },
    ]

   

  },

  {
    path: "/home",
    element: <Homepage />,
  },{
   path:"landingpage"
   ,element:<LandingPage/>

  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Loginpage />
      </PublicRoute>
    ),
  },{
  path: "cart",
    element: (
      <UserProtectedRoute>
        <ShoppingCart/>
      </UserProtectedRoute>
    )},{
      path: "wishlist",
        element: (
          <UserProtectedRoute>
            <WishlistPage/>
          </UserProtectedRoute>
        )},
      {
        path:"forgetpassword",
        element:<EnterEmailComponent/>
      },{
        path:"reset-password/",
        element:<EnterPasswordComponent/>
      }, 
    
    
    
    {
      path: "checkout",
        element: (
          <UserProtectedRoute>
            <CheckoutPage/>
          </UserProtectedRoute>
        )},
  // Protect user profile and its children routes
  {
    path: "userprofile",
    element: (
      <UserProtectedRoute>
        <Userprofile />
      </UserProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Useroverview />,
      },
      {
        path: "orders",
        element: <Userorders />,
      },
      {
        path: "address",
        element: <AddressManagement />,
      },
      {
        path: "addaddress",
        element: <Addaddresspage />,
      }, {
        path: "wallet",
        element: <WalletPage />,
      }
    ],
  },
  

  // Admin Routes with Protected Route

  {
    path: "admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "admin",
    element: (
      <AdminProtectedRoute>
        <Admin />
      </AdminProtectedRoute>
    ),
    children: [{
       path:"",
       element:<AdminDashboard/>
    },
      {
        path: "customers",
        element: <CustomerManagement />,
      },
      {
        path: "products",
        element: <ViewProducts />,
      },{
        path: "orders",
        element: <OrderManagement />,
      },
      {
        path: "edit-product/:productId",
        element: <EditProductPage />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "addproduct",
        element: <Addproduct />,
      },{
        path: "report",
        element: <SalesReport/>,
      },
      {
        path: "addcoupon",
        element: <CouponManagement />,
      },
      {
        path:"vieworderdetails/:orderId",
        element:<AdminOrderDetails />
      },{

        path:"brandmanagement",
        element:<BrandManagement/>
      },{

        path:"dashboard",
        element:<AdminDashboard/>
      }
    ],
  },
 
]);

export default Router;
