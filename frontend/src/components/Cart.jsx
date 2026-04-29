import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function CartItem({ item, onRemove, onQty, onClose }) {
  const [removing, setRemoving] = useState(false);
  const navigate = useNavigate();
  const handleRemove = (e) => {
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(item._id), 280);
  };
  const goToProduct = (e) => {
    e.stopPropagation();
    onClose();
    navigate(`/product/${item._id}`);
  };

  return (
    <div className={`cart-item ${removing ? "removing" : ""}`}>
      {/* Image */}
      <div className="cart-thumb" onClick={goToProduct} style={{ cursor: 'pointer' }}>
        <img src={item.image} alt={item.name} />
      </div>

      {/* Info */}
      <div className="cart-info">
        <div className="cart-row">
          <div>
            <div className="cart-name" onClick={goToProduct} style={{ cursor: 'pointer' }}>
              {item.name}
            </div>
            <div className="cart-category">{item.category}</div>
          </div>

          <button className="cart-remove" onClick={handleRemove}>
            ✕
          </button>
        </div>

        <div className="cart-row">
          <div className="qty-box">
            <button onClick={(e) => { e.stopPropagation(); onQty(item._id, -1); }}>−</button>
            <span className="qty-number">{item.qty}</span>
            <button onClick={(e) => { e.stopPropagation(); onQty(item._id, 1); }}>+</button>
          </div>
          <span className="cart-price">
            {fmt(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Cart({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems: items, removeFromCart, updateQty } = useCart();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  if (!isOpen) return null;

  const handleQty = (id, delta) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;
    updateQty(id, item.qty + delta);
  };

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "VELA10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoApplied(false);
      setPromoError(true);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = (subtotal > 0 && subtotal < 999) ? 99 : 0;
  const total = subtotal - discount + shipping;
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-drawer">
        <div className="cart-header">
          <div>
            <p className="cart-mini-title">Your Selection</p>
            <h2 className="cart-title">
              Shopping Cart
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </h2>
          </div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <h3>Your cart awaits</h3>
              <p>Discover our handcrafted pieces and find something worth wearing every day.</p>
              <button className="btn btn--primary" onClick={onClose}>Explore Collections</button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onRemove={removeFromCart}
                onQty={handleQty}
                onClose={onClose}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="promo-box">
              <input
                type="text"
                placeholder='Promo code — try "VELA10"'
                value={promo}
                onChange={(e) => { setPromo(e.target.value); setPromoError(false); }}
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
              />
              <button onClick={applyPromo}>Apply</button>
            </div>

            {promoApplied && <p style={{ color: "var(--gold-dark)", fontSize: ".75rem", marginBottom: '0.5rem' }}>✦ VELA10 applied — 10% off</p>}
            {promoError && <p style={{ color: "#c0392b", fontSize: ".75rem", marginBottom: '0.5rem' }}>Invalid code</p>}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>

            {promoApplied && (
              <div className="summary-row" style={{ color: 'var(--gold-dark)' }}>
                <span>Discount</span>
                <span>-{fmt(discount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : fmt(shipping)}</span>
            </div>

            <div className="cart-total">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>

            <button
              className="btn btn--primary"
              style={{ width: "100%", marginBottom: ".75rem" }}
              onClick={() => {
                onClose();
                navigate("/shipping");
              }}
            >
              Proceed to Checkout
            </button>
            <button className="btn btn--ghost" style={{ width: "100%" }} onClick={onClose}>
              Continue Shopping
            </button>

            <div className="cart-trust">
              Secure checkout · SSL encrypted · Hallmark certified
            </div>
          </div>
        )}
      </div>
    </>
  );
}