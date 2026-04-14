import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  const createProductHandler = async () => {
  if (window.confirm('Create a new product template in the database?')) {
    try {
      // 1. Call the backend to make the sample
      const { data } = await axios.post('/api/products');
      
      // 2. Teleport straight to the edit page for this new ID
      navigate(`/admin/product/${data._id}/edit`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }
};
const deleteHandler = async (id) => {
  if (window.confirm('Are you sure you want to permanently delete this piece?')) {
    try {
      // 1. Tell the backend to delete it
      await axios.delete(`/api/products/${id}`);
      
      // 2. Update the UI instantly by filtering out the deleted product from our state
      setProducts(products.filter((p) => p._id !== id));
      
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }
};

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '8rem auto 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)' }}>Product Manager</h1>
        <button onClick={createProductHandler}style={{ backgroundColor: '#d4af7a', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
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
                  <button onClick={() => navigate(`/admin/product/${product._id}/edit`)}style={{ marginRight: '0.5rem', padding: '0.25rem 0.75rem', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteHandler(product._id)} style={{ color: 'white', backgroundColor: '#dc3545', padding: '0.25rem 0.75rem', cursor: 'pointer', border: 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}