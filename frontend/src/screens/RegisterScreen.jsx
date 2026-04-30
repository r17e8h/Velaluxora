import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../App.css';

export default function RegisterScreen() {
  const [step, setStep] = useState(1); // 1 = details, 2 = otp
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { userInfo, setCredentials } = useAuth();

  useEffect(() => { if (userInfo) navigate('/'); }, [userInfo, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your full name');
    if (phone.length < 10) return setError('Please enter a valid 10-digit mobile number');
    setLoading(true);
    // TODO: await axios.post('/api/users/send-otp', { phone: '+91' + phone });
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep(2);
    setResendTimer(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.join('').length < 6) return setError('Please enter the complete 6-digit OTP');
    setLoading(true);
    // TODO: const { data } = await axios.post('/api/users/register-otp', { name, phone: '+91' + phone, otp: otp.join('') });
    // TODO: setCredentials(data); navigate('/');
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setError('Backend not connected yet — OTP flow ready to wire up ✓');
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(30);
    otpRefs.current[0]?.focus();
    // TODO: axios.post('/api/users/send-otp', { phone: '+91' + phone });
  };

  return (
    <>
      <style>{`
        .reg-mobile-hero { display: none; }
        .reg-wrapper {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 100vh; margin-top: 70px;
        }
        .reg-image-panel { position: relative; overflow: hidden; background: var(--charcoal); }
        .reg-image-panel img { width: 100%; height: 100%; object-fit: cover; opacity: 0.55; }
        .reg-image-overlay {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 3rem;
          background: linear-gradient(to top, rgba(26,26,24,0.88) 0%, rgba(26,26,24,0.15) 60%);
        }
        .reg-quote-line { width: 40px; height: 1px; background: var(--gold); margin-bottom: 1.5rem; }
        .reg-quote-main { font-family: var(--ff-display); font-size: clamp(1.5rem,2.5vw,2.2rem); font-weight: 300; color: white; line-height: 1.3; margin-bottom: 1rem; }
        .reg-quote-sub { font-size: 0.78rem; color: rgba(255,255,255,0.5); letter-spacing: 0.15em; text-transform: uppercase; }

        .reg-form-panel {
          display: flex; flex-direction: column; justify-content: center;
          align-items: center; padding: clamp(2rem,6vw,5rem);
          background: var(--cream); overflow-y: auto;
        }
        .reg-form-inner { max-width: 400px; width: 100%; }
        .reg-eyebrow { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.8rem; }
        .reg-title { font-family: var(--ff-display); font-size: clamp(2rem,3vw,2.8rem); font-weight: 300; color: var(--charcoal); margin-bottom: 0.5rem; line-height: 1.1; }
        .reg-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem; }
        .reg-subtitle a { color: var(--gold); text-decoration: none; border-bottom: 1px solid var(--gold-light); }
        .reg-subtitle strong { color: var(--charcoal); }
        .reg-divider { width: 40px; height: 1px; background: var(--gold); margin-bottom: 2rem; }
        .reg-error { padding: 0.85rem 1rem; background: #fff0f0; border-left: 3px solid #f44336; font-size: 0.82rem; color: #cc0000; margin-bottom: 1.5rem; }
        .reg-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .reg-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .reg-label { font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); }
        .reg-hint { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.3rem; }
        .reg-input { padding: 0.9rem 1rem; border: 1px solid var(--border); background: white; font-family: var(--ff-body); font-size: max(16px, 0.88rem); color: var(--text); outline: none; transition: border-color 0.3s; width: 100%; box-sizing: border-box; }
        .reg-input:focus { border-color: var(--gold); }

        /* Step bar */
        .reg-step-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .reg-step-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); transition: background 0.3s; }
        .reg-step-dot.active { background: var(--gold); }
        .reg-step-line { flex: 1; height: 1px; transition: background 0.4s; }

        /* Phone input */
        .reg-phone-wrap { display: flex; border: 1px solid var(--border); background: white; transition: border-color 0.3s; }
        .reg-phone-wrap:focus-within { border-color: var(--gold); }
        .reg-phone-prefix { padding: 0.9rem 1rem; background: #f5f0ea; font-family: var(--ff-body); font-size: 0.88rem; color: var(--text-muted); border-right: 1px solid var(--border); white-space: nowrap; display: flex; align-items: center; }
        .reg-phone-input { flex: 1; padding: 0.9rem 1rem; border: none; outline: none; font-family: var(--ff-body); font-size: max(16px, 0.88rem); color: var(--text); background: transparent; letter-spacing: 0.08em; }

        /* OTP boxes */
        .reg-otp-boxes { display: flex; gap: 0.6rem; }
        .reg-otp-box { flex: 1; aspect-ratio: 1; max-width: 56px; border: 1px solid var(--border); background: white; font-family: var(--ff-display); font-size: 1.4rem; color: var(--charcoal); text-align: center; outline: none; transition: border-color 0.2s, background 0.2s; caret-color: var(--gold); }
        .reg-otp-box:focus { border-color: var(--gold); background: #fffdf9; }
        .reg-otp-box.filled { border-color: var(--gold-dark); }

        .reg-back-btn { background: none; border: none; cursor: pointer; font-family: var(--ff-body); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; padding: 0; margin-bottom: 1.5rem; transition: color 0.2s; }
        .reg-back-btn:hover { color: var(--gold); }
        .reg-resend-row { text-align: center; font-size: 0.8rem; color: var(--text-muted); }
        .reg-resend-btn { background: none; border: none; cursor: pointer; font-family: var(--ff-body); font-size: 0.8rem; color: var(--gold); padding: 0; }
        .reg-resend-btn:disabled { color: var(--text-muted); cursor: default; }
        .reg-footer-note { margin-top: 2rem; font-size: 0.75rem; color: var(--text-muted); text-align: center; line-height: 1.6; }
        .reg-footer-note span { color: var(--gold); cursor: pointer; }

        /* Summary card shown on step 2 */
        .reg-summary {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.85rem 1rem; background: white;
          border: 1px solid var(--border); margin-bottom: 0.5rem;
        }
        .reg-summary-icon { color: var(--gold); font-size: 1.1rem; }
        .reg-summary-text { font-size: 0.82rem; color: var(--charcoal); }
        .reg-summary-sub { font-size: 0.75rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .reg-wrapper { grid-template-columns: 1fr; margin-top: 0; padding-top: 64px; min-height: 100svh; }
          .reg-image-panel { display: none; }
          .reg-form-panel { justify-content: flex-start; padding: 0; min-height: calc(100svh - 64px); }
          .reg-mobile-hero { display: flex; position: relative; width: 100%; height: 200px; overflow: hidden; flex-shrink: 0; }
          .reg-mobile-hero img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
          .reg-mobile-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,26,24,0.9) 0%, rgba(26,26,24,0.3) 70%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; }
          .reg-mobile-hero-overlay p:first-child { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.4rem; }
          .reg-mobile-hero-overlay p:last-child { font-family: var(--ff-display); font-size: 1.7rem; font-weight: 300; color: white; line-height: 1.1; }
          .reg-form-inner { padding: 2rem 1.5rem 3rem; max-width: 100%; }
          .reg-otp-box { font-size: 1.2rem; }
        }
        @media (max-width: 480px) {
          .reg-form-inner { padding: 1.75rem 1.25rem 3rem; }
          .reg-mobile-hero { height: 175px; }
          .reg-otp-boxes { gap: 0.4rem; }
        }
      `}</style>

      <div className="reg-wrapper">

        {/* LEFT IMAGE — desktop only */}
        <div className="reg-image-panel">
          <img src="https://images.unsplash.com/photo-1573408301185-9519f94ae9b2?w=900&q=80" alt="Jewellery" />
          <div className="reg-image-overlay">
            <div className="reg-quote-line" />
            <p className="reg-quote-main">"Begin Your<br />Golden Journey."</p>
            <p className="reg-quote-sub">Handcrafted Luxury Jewellery</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="reg-form-panel">

          {/* Mobile hero */}
          <div className="reg-mobile-hero">
            <img src="https://images.unsplash.com/photo-1573408301185-9519f94ae9b2?w=900&q=80" alt="Jewellery" />
            <div className="reg-mobile-hero-overlay">
              <p>Join Us</p>
              <p>"Begin Your Golden Journey."</p>
            </div>
          </div>

          <div className="reg-form-inner">

            {/* Step bar */}
            <div className="reg-step-bar">
              <div className={`reg-step-dot ${step >= 1 ? 'active' : ''}`} />
              <div className="reg-step-line" style={{ background: step === 2 ? 'var(--gold)' : 'var(--border)' }} />
              <div className={`reg-step-dot ${step === 2 ? 'active' : ''}`} />
            </div>

            <p className="reg-eyebrow">{step === 1 ? 'New Here' : 'Verify OTP'}</p>
            <h1 className="reg-title">{step === 1 ? 'Create Account' : 'Enter Code'}</h1>

            {step === 1
              ? <p className="reg-subtitle">Already have an account? <Link to="/login">Sign in</Link></p>
              : <p className="reg-subtitle">Code sent to <strong>+91 {phone}</strong></p>
            }

            <div className="reg-divider" />
            {error && <div className="reg-error">⚠ {error}</div>}

            {/* STEP 1 — Details */}
            {step === 1 && (
              <form className="reg-form" onSubmit={handleSendOtp}>
                <div className="reg-field">
                  <label className="reg-label">Full Name</label>
                  <input className="reg-input" type="text" placeholder="Priya Sharma"
                    value={name} required onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Mobile Number</label>
                  <div className="reg-phone-wrap">
                    <span className="reg-phone-prefix">🇮🇳 +91</span>
                    <input className="reg-phone-input" type="tel" inputMode="numeric"
                      maxLength={10} placeholder="98765 43210"
                      value={phone} required
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                  <span className="reg-hint">We'll send a 6-digit OTP to verify your number</span>
                </div>
                <button type="submit" className="btn btn--primary"
                  disabled={loading}
                  style={{ padding: '1rem', fontSize: '0.72rem', letterSpacing: '0.25em', width: '100%', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              </form>
            )}

            {/* STEP 2 — OTP */}
            {step === 2 && (
              <form className="reg-form" onSubmit={handleVerifyOtp}>
                <button type="button" className="reg-back-btn"
                  onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); }}>
                  ← Edit details
                </button>

                {/* Summary of entered details */}
                <div className="reg-summary">
                  <span className="reg-summary-icon">✦</span>
                  <div>
                    <div className="reg-summary-text">{name}</div>
                    <div className="reg-summary-sub">+91 {phone}</div>
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-label">6-Digit OTP</label>
                  <div className="reg-otp-boxes" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input key={idx} ref={el => otpRefs.current[idx] = el}
                        className={`reg-otp-box ${digit ? 'filled' : ''}`}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      />
                    ))}
                  </div>
                </div>

                <div className="reg-resend-row">
                  {resendTimer > 0
                    ? <span>Resend OTP in <strong>{resendTimer}s</strong></span>
                    : <span>Didn't receive it? <button type="button" className="reg-resend-btn" onClick={handleResend}>Resend OTP</button></span>
                  }
                </div>

                <button type="submit" className="btn btn--primary"
                  disabled={loading || otp.join('').length < 6}
                  style={{ padding: '1rem', fontSize: '0.72rem', letterSpacing: '0.25em', width: '100%', opacity: (loading || otp.join('').length < 6) ? 0.7 : 1 }}>
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </form>
            )}

            <p className="reg-footer-note">
              By creating an account, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
