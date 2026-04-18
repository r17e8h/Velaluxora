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

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem' }}>Loading Order Details...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '10rem' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '8rem auto 2rem' }}>
      {userInfo && userInfo.isAdmin && (
        <Link to="/admin/orderlist" style={{ color: '#666', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
          ← Back to Admin Orders
        </Link>
      )}

      <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)', marginBottom: '2rem', fontSize: '2.5rem' }}>
        Order <span style={{ color: '#d4af7a', fontSize: '1.5rem', display: 'block', marginTop: '0.5rem' }}>#{order._id}</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid #eaeaea' }}>
            <h2 style={{ borderBottom: '2px solid #d4af7a', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Shipping Details</h2>
            <p style={{ marginBottom: '0.5rem' }}><strong>Name: </strong> {order.user.name}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Email: </strong> <a href={`mailto:${order.user.email}`} style={{ color: '#d4af7a', textDecoration: 'none' }}>{order.user.email}</a></p>
            <p><strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            
            {order.isDelivered ? (
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', fontWeight: 'bold' }}>
                ✓ Delivered on {order.deliveredAt.substring(0, 10)}
              </div>
            ) : (
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontWeight: 'bold' }}>
                ⚠ Not Delivered
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#fff', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid #eaeaea' }}>
            <h2 style={{ borderBottom: '2px solid #d4af7a', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Payment Status</h2>
            <p><strong>Method: </strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', fontWeight: 'bold' }}>
                ✓ Paid on {order.paidAt.substring(0, 10)}
              </div>
            ) : (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', fontWeight: 'bold' }}>
                ⚠ Not Paid
              </div>
            )}
          </div>
          <div style={{ backgroundColor: '#fff', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid #eaeaea' }}>
            <h2 style={{ borderBottom: '2px solid #d4af7a', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Order is empty</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'var(--charcoal)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {item.name}
                      </Link>
                    </div>
                    <div style={{ fontSize: '1.1rem' }}>
                      {item.qty || 1} x ₹{item.price} = <strong>₹{(item.qty || 1) * item.price}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        <div style={{ position: 'sticky', top: '100px', backgroundColor: '#fff', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid #eaeaea', height: 'fit-content' }}>
          <h2 style={{ borderBottom: '2px solid #d4af7a', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#555' }}>
            <span>Items:</span>
            <span>₹{order.itemsPrice || order.totalPrice}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#555' }}>
            <span>Shipping:</span>
            <span>₹{order.shippingPrice || 0}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#555' }}>
            <span>Tax:</span>
            <span>₹{order.taxPrice || 0}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', fontSize: '1.3rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span style={{ color: '#d4af7a' }}>₹{order.totalPrice}</span>
          </div>
          {userInfo && userInfo.isAdmin && !order.isDelivered && (
            <button 
              onClick={deliverHandler}
              style={{ width: '100%', marginTop: '2rem', backgroundColor: '#28a745', color: '#fff', padding: '1rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', fontSize: '1.1rem', transition: '0.3s' }}
            >
              {loadingDeliver ? 'Updating...' : 'Mark As Delivered'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}