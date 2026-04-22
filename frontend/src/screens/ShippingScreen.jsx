import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../App.css';

export default function ShippingScreen() {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', minHeight: '80vh' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        
        <p className="section__eyebrow" style={{ textAlign: 'center', color: '#d4af7a', marginBottom: '1rem' }}>
          Step 1 of 3
        </p>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--charcoal)', marginBottom: '2rem' }}>
          Shipping Details
        </h1>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}>Address</label>
            <input 
              type="text" 
              placeholder="123 Luxury Lane" 
              value={address} 
              required 
              onChange={(e) => setAddress(e.target.value)} 
              style={{ padding: '12px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}>City</label>
            <input 
              type="text" 
              placeholder="Delhi" 
              value={city} 
              required 
              onChange={(e) => setCity(e.target.value)} 
              style={{ padding: '12px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}>Postal Code</label>
            <input 
              type="text" 
              placeholder="110046" 
              value={postalCode} 
              required 
              onChange={(e) => setPostalCode(e.target.value)} 
              style={{ padding: '12px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}>Country</label>
            <input 
              type="text" 
              placeholder="India" 
              value={country} 
              required 
              onChange={(e) => setCountry(e.target.value)} 
              style={{ padding: '12px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)' }}
            />
          </div>

          <button type="submit" className="btn btn--primary" style={{ marginTop: '1rem', padding: '15px' }}>
            Continue to Payment
          </button>

        </form>
      </div>
    </div>
  );
}