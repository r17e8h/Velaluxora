import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const isFavourite = wishlist.find((item) => item._id === product._id);

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-card__img-wrap">
        <img src={product.image} alt={product.name} />
        <span className="product-card__tag">New</span> 
      </div>

      <div className="product-card__body">
        <h4>{product.name}</h4>
        
        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price?.toLocaleString('en-IN')}</span>
          
          <div className="product-card__actions">
            <button
              className="btn btn--small"
              onClick={(e) => { 
                e.stopPropagation(); 
                addToCart(product); 
              }}
            >
              Add to Cart
            </button>

            <button 
              className={`product-card__wishlist-btn ${isFavourite ? 'active' : ''}`}
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleWishlist(product); 
              }}
              aria-label="Wishlist"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}