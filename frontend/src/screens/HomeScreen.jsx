import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { useCart } from '../context/CartContext.jsx';

const CATEGORIES = [
  {
    name: "Rings",
    desc: "Timeless bands & statement pieces",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  },
  {
    name: "Necklaces",
    desc: "Delicate chains & pendants",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  },
  {
    name: "Bracelets",
    desc: "Elegant wrist adornments",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
  },
  {
    name: "Earrings",
    desc: "From studs to statement drops",
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
  },
];

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        const shuffledData = [...data].sort(() => 0.5 - Math.random());
        setProducts(shuffledData.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from backend", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="app">

      {/* ── HERO ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        marginTop: '70px',
      }}>

        {/* LEFT — IMAGE */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80"
            alt="Luxury Jewellery"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 8s ease',
              transform: 'scale(1.05)',
            }}
            onLoad={e => e.target.style.transform = 'scale(1)'}
          />
          {/* SUBTLE OVERLAY */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent 60%, var(--cream) 100%)',
          }} />

          {/* FLOATING BADGE */}
          <div style={{
            position: 'absolute',
            bottom: '3rem',
            left: '3rem',
            background: 'rgba(26,26,24,0.85)',
            backdropFilter: 'blur(12px)',
            padding: '1.2rem 1.8rem',
            color: 'white',
            border: '1px solid rgba(201,169,110,0.3)',
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>
              New Collection
            </p>
            <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.1rem', fontWeight: '300' }}>
              2026 · Handcrafted in India
            </p>
          </div>
        </div>

        {/* RIGHT — CONTENT */}
        <div style={{
          background: 'var(--cream)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(3rem, 6vw, 7rem)',
          position: 'relative',
        }}>

          {/* EST. TAG */}
          <div style={{
            position: 'absolute',
            top: '3rem',
            right: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
            Est. 2024
          </div>

          {/* EYEBROW */}
          <p style={{
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1.5rem',
          }}>
            New Collection 2026
          </p>

          {/* TITLE */}
          <h1 style={{
            fontFamily: 'var(--ff-display)',
            fontSize: 'clamp(3rem, 5vw, 5.5rem)',
            fontWeight: '300',
            lineHeight: '1.05',
            color: 'var(--charcoal)',
            marginBottom: '1rem',
          }}>
            Wear What<br />
            <span style={{ fontStyle: 'italic' }}>Whispers</span> Gold
          </h1>

          {/* GOLD DIVIDER */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ width: '50px', height: '1px', background: 'var(--gold)' }} />
            <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>✦</span>
          </div>

          {/* SUBTITLE */}
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '380px',
            marginBottom: '3rem',
            lineHeight: '1.9',
          }}>
            Handcrafted luxury jewellery for the woman who needs no introduction. Each piece tells a story worth wearing.
          </p>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <button
              className="btn btn--primary"
              onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em' }}
            >
              Shop Now
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em' }}
            >
              Explore Collections
            </button>
          </div>

          {/* STATS ROW */}
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { number: '500+', label: 'Unique Pieces' },
              { number: '10K+', label: 'Happy Customers' },
              { number: '100%', label: 'Hallmark Certified' },
            ].map((stat) => (
              <div key={stat.label}>
                <p style={{
                  fontFamily: 'var(--ff-display)',
                  fontSize: '1.8rem',
                  fontWeight: '300',
                  color: 'var(--charcoal)',
                  lineHeight: '1',
                  marginBottom: '0.3rem',
                }}>
                  {stat.number}
                </p>
                <p style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee__track">
          {[
            "Free Shipping on Orders Above ₹999", "✦",
            "Hallmark Certified Gold & Silver", "✦",
            "Handcrafted in India", "✦",
            "Easy 30-Day Returns", "✦",
            "Free Shipping on Orders Above ₹999", "✦",
            "Hallmark Certified Gold & Silver", "✦",
            "Handcrafted in India", "✦",
            "Easy 30-Day Returns", "✦",
          ].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section categories" id="collections">
        <div className="section__header">
          <p className="section__eyebrow">Browse by Category</p>
          <h2 className="section__title">Our Collections</h2>
        </div>
        <div className="categories__grid">
          {CATEGORIES.map((c) => (
            <div className="category-card" key={c.name}>
              <div className="category-card__img-wrap">
                <img src={c.img} alt={c.name} />
                <div className="category-card__overlay" />
              </div>
              <div className="category-card__body">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <a href="#" className="category-card__link">Shop →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="section featured" id="featured">
        <div className="section__header">
          <p className="section__eyebrow">Curated for You</p>
          <h2 className="section__title">Featured Pieces</h2>
        </div>
        <div className="featured__grid">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>✦</p>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Loading luxury pieces...
              </p>
            </div>
          ) : (
            products.map((p) => (
              <div
                className="product-card"
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-card__img-wrap">
                  <img src={p.image} alt={p.name} />
                  <span className="product-card__tag">New</span>
                  <button className="product-card__wishlist" aria-label="Wishlist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className="product-card__body">
                  <h4>{p.name}</h4>
                  <div className="product-card__footer">
                    <span className="product-card__price">₹{p.price?.toLocaleString('en-IN')}</span>
                    <button
                      className="btn btn--small"
                      onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* BANNER */}
      <section className="banner">
        <div className="banner__content">
          <p className="section__eyebrow" style={{ color: "#d4af7a" }}>Our Promise</p>
          <h2>Crafted with Intention.<br />Worn with Grace.</h2>
          <p>Every piece is ethically sourced, hallmark certified, and made to last a lifetime.</p>
          <button className="btn btn--primary">Our Story</button>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section newsletter">
        <div className="newsletter__inner">
          <p className="section__eyebrow">Stay in the Loop</p>
          <h2>Join the Inner Circle</h2>
          <p>Be first to know about new arrivals, exclusive offers, and jewellery care tips.</p>
          {subscribed ? (
            <p className="newsletter__thanks">✦ Thank you for subscribing!</p>
          ) : (
            <div className="newsletter__form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="btn btn--primary"
                onClick={() => email && setSubscribed(true)}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}