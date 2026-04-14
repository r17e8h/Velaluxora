import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductEditScreen() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${productId}`, {
        name, price, image, brand, category, countInStock, description,
      });
      navigate('/admin/productlist');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setLoadingUpload(true);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.image);
      setLoadingUpload(false);
    } catch (err) {
      alert('Error uploading image');
      setLoadingUpload(false);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '10rem' }}>Loading Product Data...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '10rem' }}>{error}</h2>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '8rem auto 2rem' }}>
      <Link to="/admin/productlist" style={{ color: '#666', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Go Back
      </Link>

      <div style={{ backgroundColor: '#fff', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <h1 style={{ fontFamily: 'var(--ff-display)', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>Edit Product</h1>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          {/* THE IMAGE UPLOAD ZONE */}
          <div style={{ padding: '1rem', border: '1px dashed #d4af7a', backgroundColor: '#fafafa' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Image Path</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', marginBottom: '1rem' }} />
            
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload New Image file</label>
            <input type="file" onChange={uploadFileHandler} />
            {loadingUpload && <p style={{ color: '#d4af7a' }}>Uploading...</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Brand</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Count In Stock</label>
            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', minHeight: '100px' }} />
          </div>

          <button type="submit" style={{ backgroundColor: '#d4af7a', color: '#fff', padding: '1rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem', fontSize: '1.1rem' }}>
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}