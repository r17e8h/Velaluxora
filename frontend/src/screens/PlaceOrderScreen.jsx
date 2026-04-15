import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import axios from 'axios';
import '../App.css';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod } = useCart();
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0));
  const shippingPrice = addDecimals(itemsPrice > 999 ? 0 : 100);
  const taxPrice = addDecimals(Number((0.18 * itemsPrice).toFixed(2)));
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);
  const placeOrderHandler = async () => {
    try {
      const formattedOrderItems = cartItems.map((item) => ({
        ...item,
        product: item._id || item.product, 
      }));
      const { data } = await axios.post('/api/orders', {
        orderItems: formattedOrderItems, // <-- Sending the newly formatted items
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.response?.data?.message || "Something went wrong with the database connection!");
    }
  };

  return (
    <div style={{ padding: '100px 5%', minHeight: '80vh', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
      <div>
        <p className="section__eyebrow" style={{ color: '#d4af7a', marginBottom: '1rem' }}>Step 3 of 3</p>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', color: 'var(--charcoal)', marginBottom: '2rem' }}>Review Order</h1>
        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Shipping To:</h2>
          <p style={{ color: '#555', lineHeight: '1.6' }}>
            {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
        </div>
        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Payment Method:</h2>
          <p style={{ color: '#555' }}>{paymentMethod}</p>
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order Items:</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', borderRadius: '4px' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'var(--charcoal)', fontWeight: 'bold' }}>{item.name}</Link>
                </div>
                <div>
                  1 x ₹{item.price} = <strong>₹{item.price}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <div style={{ border: '1px solid var(--border)', padding: '2rem', borderRadius: '8px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Items:</span>
            <span>₹{itemsPrice}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Shipping:</span>
            <span>₹{shippingPrice}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Tax (18% GST):</span>
            <span>₹{taxPrice}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span style={{ color: '#d4af7a' }}>₹{totalPrice}</span>
          </div>

          <button 
            className="btn btn--primary" 
            style={{ width: '100%', marginTop: '2rem', padding: '15px' }}
            disabled={cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}