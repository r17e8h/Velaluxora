import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function OrderScreen() {
  const { id: orderId } = useParams();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDeliver, setLoadingDeliver] = useState(false);
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const deliverHandler = async () => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        setLoadingDeliver(true);
        const { data } = await axios.put(`/api/orders/${orderId}/deliver`);
        setOrder(data); 
        setLoadingDeliver(false);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
        setLoadingDeliver(false);
      }
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem', fontFamily: 'var(--ff-display)' }}>Loading Order Details...</h2>;
  if (error) return <h2 style={{ color: '#c62828', textAlign: 'center', marginTop: '10rem', fontFamily: 'var(--ff-body)' }}>{error}</h2>;

  return (
    <div className="checkout-screen" style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="checkout-screen__main">
        {userInfo && userInfo.isAdmin && (
          <Link to="/admin/orderlist" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            ← Back to Admin Orders
          </Link>
        )}
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--charcoal)', marginBottom: '0.2rem' }}>Order</h1>
        <p style={{ color: 'var(--gold-dark)', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>#{order._id}</p>
        <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', color: 'var(--charcoal)' }}>
            Shipping Details
          </h2>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}><strong style={{ color: 'var(--charcoal)' }}>Name:</strong> <span style={{ color: 'var(--text-muted)' }}>{order.user.name}</span></p>
          <p style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            <strong style={{ color: 'var(--charcoal)' }}>Email:</strong> <a href={`mailto:${order.user.email}`} style={{ color: 'var(--gold-dark)', textDecoration: 'none' }}>{order.user.email}</a>
          </p>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--charcoal)' }}>Address:</strong> <span style={{ color: 'var(--text-muted)' }}>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</span>
          </p>
          <div style={{ 
            background: order.isDelivered ? '#e8f5e9' : '#fce4e4', 
            color: order.isDelivered ? '#2e7d32' : '#c62828', 
            padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.05em' 
          }}>
            {order.isDelivered ? `✓ Delivered on ${order.deliveredAt.substring(0, 10)}` : '▲ Not Delivered'}
          </div>
        </div>
        <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', color: 'var(--charcoal)' }}>
            Payment Status
          </h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}><strong style={{ color: 'var(--charcoal)' }}>Method:</strong> <span style={{ color: 'var(--text-muted)' }}>{order.paymentMethod}</span></p>
          
          <div style={{ 
            background: order.isPaid ? '#e8f5e9' : '#fce4e4', 
            color: order.isPaid ? '#2e7d32' : '#c62828', 
            padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.05em' 
          }}>
            {order.isPaid ? `✓ Paid on ${order.paidAt.substring(0, 10)}` : '▲ Not Paid'}
          </div>
        </div>
        <div style={{ background: 'white', padding: '2rem', border: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', color: 'var(--charcoal)' }}>
            Order Items
          </h2>
          {order.orderItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Order is empty</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {order.orderItems.map((item, index) => (
                <div key={index} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item__details">
                    <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'var(--charcoal)', fontWeight: '500', fontFamily: 'var(--ff-body)', fontSize: '0.95rem' }}>
                      {item.name}
                    </Link>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {item.qty || 1} x ₹{item.price?.toLocaleString('en-IN')} = <strong style={{ color: 'var(--charcoal)' }}>₹{((item.qty || 1) * item.price)?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <div className="checkout-screen__summary">
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', color: 'var(--charcoal)' }}>
          Order Summary
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <span>Items:</span>
          <span>₹{(order.itemsPrice || order.totalPrice)?.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <span>Shipping:</span>
          <span>₹{(order.shippingPrice || 0)?.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text)', fontSize: '0.95rem' }}>
          <span>Tax:</span>
          <span>₹{(order.taxPrice || 0)?.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '1.3rem', fontWeight: '500', fontFamily: 'var(--ff-body)' }}>
          <span style={{ color: 'var(--charcoal)' }}>Total:</span>
          <span style={{ color: 'var(--gold-dark)' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
        </div>
        {userInfo && userInfo.isAdmin && !order.isDelivered && (
          <button 
            onClick={deliverHandler}
            style={{ width: '100%', marginTop: '2rem', backgroundColor: 'var(--charcoal)', color: '#fff', padding: '1rem', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', fontSize: '0.8rem', textTransform: 'uppercase', transition: 'var(--transition)' }}
            onMouseEnter={e => e.target.style.backgroundColor = 'var(--gold)'}
            onMouseLeave={e => e.target.style.backgroundColor = 'var(--charcoal)'}
            disabled={loadingDeliver}
          >
            {loadingDeliver ? 'UPDATING...' : 'MARK AS DELIVERED'}
          </button>
        )}
      </div>
    </div>
  );
}