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
    <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 5% 4rem', minHeight: '80vh', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        
        <p className="section__eyebrow" style={{ textAlign: 'center', color: 'var(--gold)', marginBottom: '0.8rem' }}>
          Step 1 of 3
        </p>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', textAlign: 'center', color: 'var(--charcoal)', marginBottom: '2.5rem' }}>
          Shipping Details
        </h1>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Address</label>
            <input 
              type="text" 
              placeholder="123 Luxury Lane" 
              value={address} 
              required 
              onChange={(e) => setAddress(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>City</label>
            <input 
              type="text" 
              placeholder="Delhi" 
              value={city} 
              required 
              onChange={(e) => setCity(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Postal Code</label>
            <input 
              type="text" 
              placeholder="110092" 
              value={postalCode} 
              required 
              onChange={(e) => setPostalCode(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--ff-body)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Country</label>
            <input 
              type="text" 
              placeholder="India" 
              value={country} 
              required 
              onChange={(e) => setCountry(e.target.value)} 
              style={{ width: '100%', padding: '12px 15px', border: '1px solid var(--border)', outline: 'none', fontFamily: 'var(--ff-body)', fontSize: '0.9rem', color: 'var(--charcoal)' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <button type="submit" className="btn btn--primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
            Continue to Payment
          </button>

        </form>
      </div>
    </div>
  );
}