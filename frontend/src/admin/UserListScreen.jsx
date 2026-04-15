import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserListScreen() {
  const navigate = useNavigate();
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

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem' }}>Loading Users...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '10rem' }}>{error}</h2>;
  const deleteHandler = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        setUsers(users.filter((u) => u._id !== id)); 
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '8rem auto 2rem' }}>
      <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)', marginBottom: '2rem' }}>User Manager</h1>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d4af7a', backgroundColor: '#fafafa' }}>
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
                <td style={{ padding: '1rem', color: '#666' }}>{user._id.substring(0, 8)}...</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}><a href={`mailto:${user.email}`} style={{ color: '#d4af7a', textDecoration: 'none' }}>{user.email}</a></td>
                <td style={{ padding: '1rem' }}>
                  {user.isAdmin ? <span style={{ color: 'green', fontWeight: 'bold' }}>👑 VIP</span> : '❌'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => navigate(`/admin/user/${user._id}/edit`)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.75rem', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '4px' }}>Edit</button>
                  <button onClick={() => deleteHandler(user._id)} style={{ color: 'white', backgroundColor: '#dc3545', padding: '0.25rem 0.75rem', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}