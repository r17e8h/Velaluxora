import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem' }}>Loading Inventory...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '10rem' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '8rem auto 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)' }}>Product Manager</h1>
        <button style={{ backgroundColor: '#d4af7a', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
          + Create New Product
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d4af7a', backgroundColor: '#fafafa' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>NAME</th>
              <th style={{ padding: '1rem' }}>PRICE</th>
              <th style={{ padding: '1rem' }}>CATEGORY</th>
              <th style={{ padding: '1rem' }}>BRAND</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', color: '#666' }}>{product._id.substring(0, 8)}...</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>₹{product.price}</td>
                <td style={{ padding: '1rem' }}>{product.category}</td>
                <td style={{ padding: '1rem' }}>{product.brand}</td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ marginRight: '0.5rem', padding: '0.25rem 0.75rem', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#fff' }}>Edit</button>
                  <button style={{ color: 'white', backgroundColor: '#dc3545', padding: '0.25rem 0.75rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}