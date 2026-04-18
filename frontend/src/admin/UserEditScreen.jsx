import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserEditScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${userId}`);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${userId}`, { name, email, isAdmin });
      navigate('/admin/userlist');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem' }}>Loading User...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '8rem auto 2rem' }}>
      <Link to="/admin/userlist" style={{ color: '#666', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Go Back
      </Link>

      <div style={{ backgroundColor: '#fff', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>Edit User Role</h1>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '1rem', backgroundColor: '#fafafa', border: '1px solid #eee' }}>
            <input 
              type="checkbox" 
              checked={isAdmin} 
              onChange={(e) => setIsAdmin(e.target.checked)} 
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label style={{ fontWeight: 'bold', color: 'var(--charcoal)', cursor: 'pointer' }} onClick={() => setIsAdmin(!isAdmin)}>
              Promote to VIP Admin
            </label>
          </div>

          <button type="submit" style={{ backgroundColor: '#d4af7a', color: '#fff', padding: '1rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.1rem' }}>
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}