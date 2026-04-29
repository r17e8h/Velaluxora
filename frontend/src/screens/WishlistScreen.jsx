import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* BREADCRUMB & HEADER */}
      <div style={{ padding: '120px 5% 0', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', transition: 'color var(--transition)' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Home</span>
          <span>›</span>
          <span style={{ color: 'var(--text)' }}>Wishlist</span>
        </div>

        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '300', color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
            Your Wishlist
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5%' }}>
        
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', background: 'white', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', color: 'var(--border)', marginBottom: '1.5rem' }}>♡</div>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', fontWeight: '300', color: 'var(--charcoal)', marginBottom: '1rem' }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
              Discover pieces you love and save them here for later.
            </p>
            <button className="btn btn--primary" onClick={() => navigate('/collections')}
              style={{ padding: '0.9rem 2.5rem', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
              EXPLORE COLLECTIONS
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '2rem' 
          }}>
            {wishlist.map((p) => (
              <div 
                key={p._id} 
                onClick={() => navigate(`/product/${p._id}`)} 
                style={{ 
                  cursor: 'pointer', 
                  background: 'white', 
                  border: '1px solid var(--border)', 
                  padding: '1.2rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                
                {/* REMOVE BUTTON*/}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    toggleWishlist(p); 
                  }}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
                    background: 'white', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: '#f44336'
                  }}
                  aria-label="Remove from Wishlist"
                  title="Remove from Wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f44336" stroke="#f44336" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                {/* IMAGE */}
                <div style={{ position: 'relative', background: '#f5f0ea', aspectRatio: '1/1', marginBottom: '1.2rem', overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                {/* DETAILS */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      {p.category}
                    </p>
                    <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', fontWeight: '400', color: 'var(--charcoal)', marginBottom: '0.5rem', lineHeight: '1.2' }}>
                      {p.name}
                    </h4>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--gold-dark)', fontWeight: '500' }}>
                      ₹{p.price?.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      View Piece ›
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}