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
import PrivateRoute from './components/PrivateRoute.jsx'; // ← add this

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

            {/* Protected Routes */}
            <Route path="/shipping" element={
              <PrivateRoute><ShippingScreen /></PrivateRoute>
            } />
            <Route path="/payment" element={
              <PrivateRoute><PaymentScreen /></PrivateRoute>
            } />
            <Route path="/placeorder" element={
              <PrivateRoute><PlaceOrderScreen /></PrivateRoute>
            } />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}