import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Changed to HashRouter
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
import AdminProtectedRoute from "../components/global/Protectedadminrouter";
import CustomerManagement from "../components/admin/CustomerManagement";

import Userorders from "../components/user/Userorders";
import Useroverview from "../components/user/Accountview";
import AddressManagement from "../components/user/Useraddress";
import AddressForm from "../components/user/Addaddress";
import UserProtectedRoute from "../utils/userprotectedrout";
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

const Router = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="register" element={<Registerpage />} />
          <Route path="verify" element={<Verify />} />
          <Route path="productdetails/:productId" element={<ProductDetailPage />} />
        </Route>

        <Route path="/home" element={<Homepage />} />
        <Route path="landingpage" element={<LandingPage />} />

        <Route path="/login" element={<PublicRoute><Loginpage /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route path="cart" element={<UserProtectedRoute><ShoppingCart /></UserProtectedRoute>} />
        <Route path="wishlist" element={<UserProtectedRoute><WishlistPage /></UserProtectedRoute>} />
        <Route path="forgetpassword" element={<EnterEmailComponent />} />
        <Route path="reset-password" element={<EnterPasswordComponent />} />
        <Route path="checkout" element={<UserProtectedRoute><CheckoutPage /></UserProtectedRoute>} />

        {/* User Profile Routes */}
        <Route path="userprofile" element={<UserProtectedRoute><Userprofile /></UserProtectedRoute>}>
          <Route path="" element={<Useroverview />} />
          <Route path="orders" element={<Userorders />} />
          <Route path="address" element={<AddressManagement />} />
          <Route path="addaddress" element={<Addaddresspage />} />
          <Route path="wallet" element={<WalletPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>}>
          <Route path="" element={<AdminDashboard />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="products" element={<ViewProducts />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="edit-product/:productId" element={<EditProductPage />} />
          <Route path="category" element={<Category />} />
          <Route path="addproduct" element={<Addproduct />} />
          <Route path="report" element={<SalesReport />} />
          <Route path="addcoupon" element={<CouponManagement />} />
          <Route path="vieworderdetails/:orderId" element={<AdminOrderDetails />} />
          <Route path="brandmanagement" element={<BrandManagement />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Admin Login */}
        <Route path="admin/login" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
};

export default Router;
