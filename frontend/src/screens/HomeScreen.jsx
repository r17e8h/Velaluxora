import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data.slice(0, 4)); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from backend", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app">
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <p className="hero__eyebrow">New Collection 2026</p>
          <h1 className="hero__title">Wear What<br />Whispers Gold</h1>
          <p className="hero__sub">Handcrafted luxury jewellery for the woman who needs no introduction.</p>
          <div className="hero__cta">
            <button className="btn btn--primary">Shop Now</button>
            <button className="btn btn--ghost">Explore Collections</button>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee__track">
          {["Free Shipping on Orders Above ₹999", "✦", "Hallmark Certified Gold & Silver", "✦", "Handcrafted in India", "✦", "Easy 30-Day Returns", "✦", "Free Shipping on Orders Above ₹999", "✦", "Hallmark Certified Gold & Silver", "✦", "Handcrafted in India", "✦", "Easy 30-Day Returns", "✦"].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section categories">
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
      <section className="section featured">
        <div className="section__header">
          <p className="section__eyebrow">Curated for You</p>
          <h2 className="section__title">Featured Pieces</h2>
        </div>
        <div className="featured__grid">
          {loading ? (
            <h2>Loading luxury pieces...</h2>
          ) : (
            products.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="product-card__img-wrap">
                  <img src={p.image} alt={p.name} />
                  <span className="product-card__tag">New</span> 
                  <button className="product-card__wishlist" aria-label="Wishlist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="product-card__body">
                  <h4>{p.name}</h4>
                  <div className="product-card__footer">
                    <span className="product-card__price">₹{p.price}</span>
                    <button className="btn btn--small">Add to Cart</button>
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
          <p className="section__eyebrow" style={{color:"#d4af7a"}}>Our Promise</p>
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
              <button className="btn btn--primary" onClick={() => email && setSubscribed(true)}>
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}