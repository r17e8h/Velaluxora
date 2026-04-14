import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import '../App.css';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { userInfo, setCredentials } = useAuth();

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      setCredentials(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Hide navbar overlap by pushing content down */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', marginTop: '70px' }}>

        {/* LEFT — IMAGE PANEL */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--charcoal)' }}>
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80"
            alt="Jewellery"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '3rem',
            background: 'linear-gradient(to top, rgba(26,26,24,0.85) 0%, rgba(26,26,24,0.2) 60%)',
          }}>
            {/* BOTTOM QUOTE */}
            <div /> {/* spacer */}
            <div>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '1.5rem' }} />
              <p style={{
                fontFamily: 'var(--ff-display)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                fontWeight: '300',
                color: 'white',
                lineHeight: '1.3',
                marginBottom: '1rem'
              }}>
                "Wear What<br />Whispers Gold."
              </p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Handcrafted Luxury Jewellery
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — FORM PANEL */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(2rem, 6vw, 5rem)',
          background: 'var(--cream)',
          overflowY: 'auto',
        }}>
          <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>

            {/* EYEBROW */}
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.8rem' }}>
              Welcome Back
            </p>

            {/* TITLE */}
            <h1 style={{
              fontFamily: 'var(--ff-display)',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              fontWeight: '300',
              color: 'var(--charcoal)',
              marginBottom: '0.5rem',
              lineHeight: '1.1'
            }}>
              Sign In
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold-light)' }}>
                Create one
              </Link>
            </p>

            {/* DIVIDER */}
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '2.5rem' }} />

            {/* ERROR */}
            {error && (
              <div style={{
                padding: '0.85rem 1rem',
                background: '#fff0f0',
                borderLeft: '3px solid #f44336',
                fontSize: '0.82rem',
                color: '#cc0000',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                ⚠ {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* EMAIL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '0.9rem 1rem',
                    border: '1px solid var(--border)',
                    background: 'white',
                    fontFamily: 'var(--ff-body)',
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    outline: 'none',
                    transition: 'border 0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* PASSWORD */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Password
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold)', cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 3rem 0.9rem 1rem',
                      border: '1px solid var(--border)',
                      background: 'white',
                      fontFamily: 'var(--ff-body)',
                      fontSize: '0.88rem',
                      color: 'var(--text)',
                      outline: 'none',
                      transition: 'border 0.3s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      fontSize: '0.72rem', letterSpacing: '0.08em', fontFamily: 'var(--ff-body)',
                    }}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary"
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.25em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  width: '100%',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

            </form>

            {/* FOOTER NOTE */}
            <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
              By signing in, you agree to our{' '}
              <span style={{ color: 'var(--gold)', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--gold)', cursor: 'pointer' }}>Privacy Policy</span>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}