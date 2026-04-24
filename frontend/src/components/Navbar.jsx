import React,{ useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import "../App.css";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Collections", path: "/collections" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await axios.get(`/api/products?search=${query}`);
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="navbar__inner">

          {/* LEFT — LOGO */}
          <Link to="/" className="navbar__logo">VELA<span>LUXORA</span></Link>

          <div className="navbar__search" style={{ flex: 1, maxWidth: '380px', margin: '0 2rem', position: 'relative' }}>
            <form onSubmit={(e) => e.preventDefault()} style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              padding: '0.45rem 1rem',
              gap: '0.5rem',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--text-muted)" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontFamily: 'var(--ff-body)',
                  fontSize: '0.8rem',
                  color: 'var(--text)',
                  width: '100%',
                  letterSpacing: '0.05em',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1 }}
                >
                  ×
                </button>
              )}
            </form>

            {/* DROPDOWN RESULTS */}
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0, right: 0,
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderTop: 'none',
                zIndex: 999,
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              }}>
                {searchResults.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border)',
                      textDecoration: 'none',
                      color: 'var(--text)',
                      transition: 'background var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf7f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ fontSize: '0.85rem', fontFamily: 'var(--ff-body)', marginBottom: '2px' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--gold-dark)', fontWeight: '500' }}>
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* NO RESULTS */}
            {searchQuery && searchResults.length === 0 && !searching && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0, right: 0,
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderTop: 'none',
                padding: '1rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                zIndex: 999,
              }}>
                No results for "{searchQuery}"
              </div>
            )}
          </div>

          {/* RIGHT — NAV LINKS + ICONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

            {/* NAV LINKS & MOBILE SEARCH */}
            <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
              <li className="mobile-search" style={{ width: '100%', padding: '0 1rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                <form onSubmit={(e) => e.preventDefault()} style={{
                  display: 'flex', alignItems: 'center', border: '1px solid var(--charcoal)',
                  padding: '0.6rem 1rem', gap: '0.5rem', background: 'var(--white)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search jewellery..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '16px' }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                      style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--text-muted)' }}>×</button>
                  )}
                </form>

                {/* MOBILE DROPDOWN RESULTS */}
                {searchResults.length > 0 && (
                  <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderTop: 'none', maxHeight: '250px', overflowY: 'auto' }}>
                    {searchResults.map((product) => (
                      <Link
                        to={`/product/${product._id}`}
                        key={product._id}
                        onClick={() => { setSearchQuery(""); setSearchResults([]); setMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}
                      >
                        <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        <div>
                          <p style={{ fontSize: '0.85rem', margin: 0 }}>{product.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', margin: 0 }}>₹{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* REGULAR NAV LINKS */}
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} onClick={() => setMenuOpen(false)}>{l.label}</Link>
                </li>
              ))}
            </ul>

            {/* ICONS */}
            <div className="navbar__actions">

              {/* LOGIN / USER */}
              {userInfo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/profile" style={{ fontSize: '0.78rem', color: 'var(--gold)',
                    fontFamily: 'var(--ff-body)', letterSpacing: '0.05em' }} className="hide-on-mobile">
                    Hi, {userInfo.name}
                  </Link>
                  <button className="icon-btn" onClick={handleLogout} title="Logout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="icon-btn" title="Login">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
              )}
              {/* THE SECRET ADMIN MENU */}
              {userInfo && userInfo.isAdmin && (
                <div className="navbar__admin" style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '2px solid #d4af7a', paddingLeft: '1rem', marginLeft: '1rem' }}>
                  <span style={{ color: '#d4af7a', fontFamily: 'var(--ff-display)', fontSize: '1.2rem' }}> VIP </span>
    
                  <Link to="/admin/productlist" style={{ color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 'bold' }}>
                    Products
                  </Link>
    
                  <Link to="/admin/orderlist" style={{ color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 'bold' }}>
                    Orders
                  </Link>
    
                  <Link to="/admin/userlist" style={{ color: 'var(--charcoal)', textDecoration: 'none', fontWeight: 'bold' }}>
                    Users
                  </Link>
                </div>
              )}

              {/* CART */}
              <button className="icon-btn" aria-label="Cart" onClick={() => setCartOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </button>

              {/* HAMBURGER */}
              <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                <span /><span /><span />
              </button>

            </div>
          </div>

        </div>
      </nav>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}