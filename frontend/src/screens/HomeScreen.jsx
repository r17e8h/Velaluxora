import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

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
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: '0'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          animation: 'zoomOut 10s ease infinite alternate'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(26,24,20,0.3) 0%, rgba(26,24,20,0.8) 100%)',
          zIndex: 2
        }} />

        <div style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          color: '#fff',
          padding: '0 5%',
          maxWidth: '800px',
          marginTop: '70px'
        }}> 
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            New Collection 2026
          </p>
          <h1 style={{
            fontFamily: 'var(--ff-display)',
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', /* Scales perfectly from phones to 4k monitors */
            fontWeight: '300',
            lineHeight: '1.05',
            marginBottom: '1.5rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            Wear What<br />
            <span style={{ fontStyle: 'italic', color: 'var(--cream)' }}>Whispers</span> Gold
          </h1>
          <p style={{
            fontFamily: 'var(--ff-body)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: '300',
            maxWidth: '480px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Handcrafted luxury jewelry for the woman who needs no introduction. Each piece tells a story worth wearing.
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap' 
          }}>
            <button
              className="btn btn--primary"
              onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
              style={{ 
                padding: '1.2rem 3rem', 
                fontSize: '0.75rem', 
                letterSpacing: '0.2em',
                background: 'var(--gold)',
                color: '#fff',
                border: 'none'
              }}
            >
              SHOP THE COLLECTION
            </button>
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
            <div
              className="category-card"
              key={c.name}
              onClick={() => navigate(`/collections?category=${c.name}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-card__img-wrap">
                <img src={c.img} alt={c.name} />
                <div className="category-card__overlay" />
              </div>
              <div className="category-card__body">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <span className="category-card__link">Shop →</span>
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
              <ProductCard key={p._id} product={p} />
            ))
          )}
        </div>
      </section>

      {/* BANNER */}
      <section className="banner">
        <div className="banner__content">
          <p className="section__eyebrow" style={{ color: "#d4af7a" }}>Our Promise</p>
          <h2>Crafted with Intention.<br />Worn with Grace.</h2>
          <p>Every piece is ethically sourced and made to last a lifetime.</p>
          <button className="btn btn--primary" onClick={() => navigate('/about')}>
            Our Story
          </button>
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