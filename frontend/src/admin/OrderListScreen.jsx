import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrderListScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem' }}>Loading Financials...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '10rem' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '8rem auto 2rem' }}>
      <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)', marginBottom: '2rem' }}>Order Manager</h1>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d4af7a', backgroundColor: '#fafafa' }}>
              <th style={{ padding: '1rem' }}>ORDER ID</th>
              <th style={{ padding: '1rem' }}>USER</th>
              <th style={{ padding: '1rem' }}>DATE</th>
              <th style={{ padding: '1rem' }}>TOTAL</th>
              <th style={{ padding: '1rem' }}>PAID</th>
              <th style={{ padding: '1rem' }}>DELIVERED</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', color: '#666' }}>{order._id.substring(0, 8)}...</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{order.user && order.user.name}</td>
                <td style={{ padding: '1rem' }}>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                <td style={{ padding: '1rem' }}>₹{order.totalPrice}</td>
                <td style={{ padding: '1rem' }}>{order.isPaid ? '✅ Yes' : '❌ No'}</td>
                <td style={{ padding: '1rem' }}>{order.isDelivered ? '✅ Yes' : '🚚 Pending'}</td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ padding: '0.25rem 0.75rem', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '4px' }}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}