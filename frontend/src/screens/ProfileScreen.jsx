import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchMyOrders = async () => {
        try {
          const { data } = await axios.get('/api/orders/mine');
          setOrders(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };
      fetchMyOrders();
    }
  }, [navigate, userInfo]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '8rem auto 2rem', minHeight: '60vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '1rem' }}>My Account</h2>
          <div style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#d4af7a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {userInfo?.name.charAt(0).toUpperCase()}
            </div>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{userInfo?.name}</p>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>{userInfo?.email}</p>
            <button onClick={() => {
              localStorage.removeItem('userInfo');
              navigate('/');
              window.location.reload();
            }} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#fff', border: '1px solid #dc3545', color: '#dc3545', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
              Log Out
            </button>
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '1rem' }}>Order History</h2>
          {loading ? (
            <p>Loading your vault...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem', backgroundColor: '#fafafa', border: '1px solid #eaeaea', textAlign: 'center', borderRadius: '8px' }}>
              <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#d4af7a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Start Shopping</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d4af7a', backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '1rem' }}>ORDER ID</th>
                    <th style={{ padding: '1rem' }}>DATE</th>
                    <th style={{ padding: '1rem' }}>TOTAL</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                    <th style={{ padding: '1rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', color: '#666' }}>{order._id.substring(0, 8)}...</td>
                      <td style={{ padding: '1rem' }}>{order.createdAt.substring(0, 10)}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.totalPrice}</td>
                      <td style={{ padding: '1rem' }}>
                        {order.isDelivered ? (
                          <span style={{ color: '#155724', backgroundColor: '#d4edda', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Delivered</span>
                        ) : (
                          <span style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Processing</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button onClick={() => navigate(`/order/${order._id}`)} style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' }}>
                          Track Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}