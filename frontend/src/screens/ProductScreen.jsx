import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext.jsx';
import axios from "axios";
import "../App.css";
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const StarRating = ({ value, onChange, interactive = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            fontSize: '1.2rem',
            color: star <= (hovered || value) ? 'var(--gold)' : 'var(--border)',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.2s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ProductScreen() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
      // Fetch related products by category
      const { data: all } = await axios.get(`/api/products?search=${data.category}`);
      setRelatedProducts(all.filter((p) => p._id !== id).slice(0, 4));
    } catch (error) {
      console.error("Error fetching product", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProduct();
    })();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addToCart(product, false); // false = Silent mode! No popup.
    navigate('/shipping');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) return setReviewError('Please select a star rating');
    if (!comment.trim()) return setReviewError('Please write a comment');
    setSubmitting(true);
    setReviewError('');
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, {
        withCredentials: true,
      });
      setReviewSuccess('Your review has been submitted!');
      setRating(0);
      setComment('');
      fetchProduct(); // Refresh to show new review
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>✦</div>
        <p style={{ fontFamily: 'var(--ff-body)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* BREADCRUMB */}
      <div style={{ padding: '100px 5% 0', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Collections</span>
          <span>›</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="product-screen">

        {/* LEFT — IMAGE */}
        <div className="product-screen__image">
          <div style={{ position: 'relative', overflow: 'hidden', background: '#f5f0ea', aspectRatio: '1/1' }}>
            <img src={product.image} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--gold)', color: 'white', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.3rem 0.8rem' }}>
              New Arrival
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { icon: '◈', label: 'Free Shipping' },
              { icon: '↺', label: '30-Day Returns' }
            ].map((b) => (
              <div key={b.label} style={{ textAlign: 'center', padding: '1rem', border: '1px solid var(--border)', background: 'white' }}>
                <div style={{ color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{b.icon}</div>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="product-screen__details">
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>{product.category}</p>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: '300', color: 'var(--charcoal)', lineHeight: '1.15', marginBottom: '1rem' }}>{product.name}</h1>

          {/* RATING SUMMARY */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <StarRating value={Math.round(product.rating || 0)} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {product.rating ? product.rating.toFixed(1) : '0'} ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <div style={{ width: '50px', height: '1px', background: 'var(--gold)', marginBottom: '1.5rem' }} />

          {/* PRICE */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--ff-body)', fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '400' }}>₹</span>
            <span style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', fontWeight: '300', color: 'var(--charcoal)', letterSpacing: '-0.02em' }}>{product.price?.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: '0.5rem' }}>Incl. of all taxes</span>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.9', marginBottom: '2rem', maxWidth: '480px' }}>{product.description}</p>

          {/* STOCK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.countInStock > 0 ? '#4caf50' : '#f44336' }} />
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: product.countInStock > 0 ? '#4caf50' : '#f44336' }}>
              {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* QUANTITY */}
          {product.countInStock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Qty</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', background: 'white' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: '38px', height: '38px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                  onMouseEnter={e => e.target.style.background = '#f5f0ea'}
                  onMouseLeave={e => e.target.style.background = 'none'}>−</button>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '0.9rem' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                  style={{ width: '38px', height: '38px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                  onMouseEnter={e => e.target.style.background = '#f5f0ea'}
                  onMouseLeave={e => e.target.style.background = 'none'}>+</button>
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', height: '3.2rem' }}>
            <button className="btn btn--primary" onClick={handleAddToCart} disabled={product.countInStock === 0}
              style={{ flex: 1, padding: '0', fontSize: '0.75rem', letterSpacing: '0.15em', background: added ? 'var(--gold-dark)' : 'var(--gold)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {added ? '✦ ADDED' : 'ADD TO CART'}
            </button>
            <button className="btn btn--ghost" onClick={handleBuyNow} disabled={product.countInStock === 0}style={{ flex: 1, padding: '0', fontSize: '0.75rem', letterSpacing: '0.15em', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              BUY NOW
            </button>
            {/* WISHLIST HEART BUTTON*/}
            <button 
              className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '3.2rem', height: '100%', background: 'transparent', 
                border: '1px solid var(--charcoal)', cursor: 'pointer',
                color: isInWishlist(product._id) ? '#f44336' : 'var(--charcoal)',
                transition: 'var(--transition)', flexShrink: 0
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" 
                   fill={isInWishlist(product._id) ? "#f44336" : "none"} 
                   stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

          </div>

          {/* PRODUCT DETAILS */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', fontWeight: '400', color: 'var(--charcoal)', marginBottom: '1rem' }}>Product Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Category', value: product.category },
                { label: 'Availability', value: product.countInStock > 0 ? 'In Stock' : 'Out of Stock' },
                { label: 'Craftsmanship', value: 'Handcrafted in India' },
                { label: 'Certification', value: 'Hallmark Certified' },
              ].map((detail) => (
                <div key={detail.label} style={{ display: 'flex', gap: '1rem', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: '110px' }}>{detail.label}</span>
                  <span style={{ color: 'var(--charcoal)' }}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5% 4rem' }}>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.8rem' }}>Customer Feedback</p>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '300', color: 'var(--charcoal)', marginBottom: '3rem' }}>Reviews & Ratings</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>

            {/* LEFT — EXISTING REVIEWS */}
            <div style={{ flex: '1 1 400px' }}>
              {product.reviews && product.reviews.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--border)', background: 'white' }}>
                  <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>✦</div>
                  <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', color: 'var(--charcoal)', marginBottom: '0.5rem' }}>No reviews yet</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Be the first to share your experience</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {product.reviews?.map((review) => (
                    <div key={review._id} style={{ padding: '1.5rem', background: 'white', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--ff-body)', fontWeight: '500', fontSize: '0.9rem', color: 'var(--charcoal)', marginBottom: '0.3rem' }}>{review.name}</p>
                          <StarRating value={review.rating} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.7', marginTop: '0.75rem' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — WRITE A REVIEW */}
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ padding: '2rem', background: 'white', border: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: '300', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>Write a Review</h3>

                {!userInfo ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Please sign in to leave a review</p>
                    <button className="btn btn--primary" onClick={() => navigate('/login')} style={{ padding: '0.75rem 2rem', fontSize: '0.72rem', letterSpacing: '0.15em' }}>
                      SIGN IN
                    </button>
                  </div>
                ) : reviewSuccess ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>✦</div>
                    <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', color: 'var(--charcoal)' }}>{reviewSuccess}</p>
                  </div>
                ) : (
                  <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reviewError && (
                      <div style={{ padding: '0.75rem 1rem', background: '#fff0f0', borderLeft: '3px solid #f44336', fontSize: '0.82rem', color: '#cc0000' }}>
                        {reviewError}
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>Your Rating</label>
                      <StarRating value={rating} onChange={setRating} interactive={true} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>Your Review</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience with this piece..."
                        style={{ width: '100%', padding: '0.85rem', border: '1px solid var(--border)', fontFamily: 'var(--ff-body)', fontSize: '0.85rem', color: 'var(--text)', resize: 'vertical', outline: 'none', background: 'var(--cream)' }}
                      />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={submitting}
                      style={{ padding: '0.9rem', fontSize: '0.72rem', letterSpacing: '0.2em' }}>
                      {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5% 6rem' }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.8rem' }}>You May Also Like</p>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '300', color: 'var(--charcoal)', marginBottom: '3rem' }}>Related Pieces</h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}