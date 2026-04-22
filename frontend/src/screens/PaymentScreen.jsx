import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../App.css';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCart();
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const [paymentChoice, setPaymentChoice] = useState(paymentMethod || 'Stripe');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentChoice);
    navigate('/placeorder');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px', minHeight: '80vh' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <p className="section__eyebrow" style={{ textAlign: 'center', color: '#d4af7a', marginBottom: '1rem' }}>
          Step 2 of 3
        </p>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--charcoal)', marginBottom: '2rem' }}>
          Payment Method
        </h1>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '20px', border: paymentChoice === 'Stripe' ? '2px solid var(--charcoal)' : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.3s' }}>
            <input 
              type="radio" 
              value="Stripe" 
              checked={paymentChoice === 'Stripe'} 
              onChange={(e) => setPaymentChoice(e.target.value)} 
              style={{ accentColor: 'var(--charcoal)', transform: 'scale(1.2)' }}
            />
            <span style={{ fontFamily: 'var(--ff-body)', fontSize: '1.1rem', color: 'var(--charcoal)' }}>Credit Card (Stripe)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '20px', border: paymentChoice === 'PayPal' ? '2px solid var(--charcoal)' : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.3s' }}>
            <input 
              type="radio" 
              value="PayPal" 
              checked={paymentChoice === 'PayPal'} 
              onChange={(e) => setPaymentChoice(e.target.value)} 
              style={{ accentColor: 'var(--charcoal)', transform: 'scale(1.2)' }}
            />
            <span style={{ fontFamily: 'var(--ff-body)', fontSize: '1.1rem', color: 'var(--charcoal)' }}>PayPal</span>
          </label>

          <button type="submit" className="btn btn--primary" style={{ marginTop: '1rem', padding: '15px' }}>
            Continue to Order Review
          </button>

        </form>
      </div>
    </div>
  );
}