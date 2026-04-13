import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users');
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Users...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)', marginBottom: '2rem' }}>User Manager</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #d4af7a' }}>
            <th style={{ padding: '1rem' }}>ID</th>
            <th style={{ padding: '1rem' }}>NAME</th>
            <th style={{ padding: '1rem' }}>EMAIL</th>
            <th style={{ padding: '1rem' }}>ADMIN</th>
            <th style={{ padding: '1rem' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{user._id.substring(0, 8)}...</td>
              <td style={{ padding: '1rem' }}>{user.name}</td>
              <td style={{ padding: '1rem' }}>{user.email}</td>
              <td style={{ padding: '1rem' }}>
                {user.isAdmin ? <span style={{ color: 'green', fontWeight: 'bold' }}>👑 VIP</span> : '❌ No'}
              </td>
              <td style={{ padding: '1rem' }}>
                <button style={{ marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                <button style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}