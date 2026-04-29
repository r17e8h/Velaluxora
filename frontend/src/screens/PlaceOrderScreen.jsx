import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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
    <div className="checkout-screen" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="checkout-screen__main">
        <p className="section__eyebrow" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Step 3 of 3</p>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--charcoal)', marginBottom: '2rem' }}>
          Review Order
        </h1>
        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--charcoal)' }}>Shipping To:</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
        </div>
        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--charcoal)' }}>Payment Method:</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{paymentMethod}</p>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--charcoal)' }}>Order Items:</h2>
          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cartItems.map((item, index) => (
                <div key={index} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item__details">
                    <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'var(--charcoal)', fontWeight: '500', fontFamily: 'var(--ff-body)', fontSize: '1rem' }}>
                      {item.name}
                    </Link>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                      1 x ₹{item.price?.toLocaleString('en-IN')} = <strong style={{ color: 'var(--charcoal)', fontWeight: '600' }}>₹{item.price?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="checkout-screen__summary">
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', color: 'var(--charcoal)' }}>
          Order Summary
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <span>Items:</span>
          <span>₹{itemsPrice?.toLocaleString('en-IN')}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <span>Shipping:</span>
          <span>₹{shippingPrice === 0 ? '0.00' : shippingPrice?.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <span>Tax (18% GST):</span>
          <span>₹{taxPrice?.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '1.3rem', fontWeight: '500', fontFamily: 'var(--ff-body)' }}>
          <span style={{ color: 'var(--charcoal)' }}>Total:</span>
          <span style={{ color: 'var(--gold-dark)' }}>₹{totalPrice?.toLocaleString('en-IN')}</span>
        </div>

        <button 
          className="btn btn--primary" 
          style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '0.8rem', letterSpacing: '0.2em' }}
          disabled={cartItems.length === 0}
          onClick={placeOrderHandler}
        >
          PLACE ORDER
        </button>
      </div>
      
    </div>
  );
}