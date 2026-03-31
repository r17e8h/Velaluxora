import { useState, useEffect } from "react";
import "./App.css";

const NAV_LINKS = ["Home", "Collections", "About", "Contact"];

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

const FEATURED = [
  {
    name: "Aurora Ring",
    price: "₹4,299",
    tag: "Bestseller",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80",
  },
  {
    name: "Celeste Pendant",
    price: "₹6,199",
    tag: "New",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
  },
  {
    name: "Soleil Bracelet",
    price: "₹3,499",
    tag: "New",
    img: "https://images.unsplash.com/photo-1573408301185-9519f94ae9b2?w=400&q=80",
  },
  {
    name: "Luna Earrings",
    price: "₹2,899",
    tag: "Limited",
    img: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=80",
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app">
      {/* NAV */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          <div className="navbar__logo">VÉLA<span>LUXORA</span></div>
          <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
            {NAV_LINKS.map((l) => (
              <li key={l}><a href="#" onClick={() => setMenuOpen(false)}>{l}</a></li>
            ))}
          </ul>
          <div className="navbar__actions">
            <button className="icon-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <button className="icon-btn" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

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
          {FEATURED.map((p) => (
            <div className="product-card" key={p.name}>
              <div className="product-card__img-wrap">
                <img src={p.img} alt={p.name} />
                <span className="product-card__tag">{p.tag}</span>
                <button className="product-card__wishlist" aria-label="Wishlist">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div className="product-card__body">
                <h4>{p.name}</h4>
                <div className="product-card__footer">
                  <span className="product-card__price">{p.price}</span>
                  <button className="btn btn--small">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
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

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="navbar__logo">VÉLA<span>LUXORA</span></div>
            <p>Luxury jewellery handcrafted in India. Each piece tells a story worth wearing.</p>
          </div>
          <div className="footer__links">
            <div>
              <h5>Shop</h5>
              <ul>{["Rings", "Necklaces", "Bracelets", "Earrings"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
            <div>
              <h5>Help</h5>
              <ul>{["FAQ", "Shipping", "Returns", "Track Order"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>{["About Us", "Blog", "Careers", "Contact"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2026 Vélaluxora. All rights reserved.</p>
          <div className="footer__social">
            {["Instagram", "Pinterest", "Facebook"].map(s => <a key={s} href="#">{s}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}