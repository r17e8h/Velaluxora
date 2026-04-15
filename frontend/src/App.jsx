import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx';
import ShippingScreen from './screens/ShippingScreen.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from './screens/RegisterScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; 
import AdminRoute from './components/AdminRoute.jsx';
import ProductListScreen from './admin/ProductListScreen.jsx';
import OrderListScreen from './admin/OrderListScreen.jsx';
import UserListScreen from './admin/UserListScreen.jsx';
import ProductEditScreen from './admin/ProductEditScreen.jsx';
import UserEditScreen from './admin/UserEditScreen.jsx';
import OrderScreen from './admin/OrderScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/shipping" element={
              <PrivateRoute><ShippingScreen /></PrivateRoute>
            } />
            <Route path="/payment" element={
              <PrivateRoute><PaymentScreen /></PrivateRoute>
            } />
            <Route path="/placeorder" element={
              <PrivateRoute><PlaceOrderScreen /></PrivateRoute>
            } />
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/productlist" element={<ProductListScreen />} />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              <Route path="/admin/order/:id" element={<OrderScreen />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}