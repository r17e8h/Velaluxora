import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../App.css";
import { useNavigate } from 'react-router-dom';

/* ── Keyframes ── */
const KEYFRAMES = `
  @keyframes cart-fadeIn  { from { opacity: 0 }                  to { opacity: 1 } }
  @keyframes cart-slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
`;

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ────────────────────────
   Single cart item row
──────────────────────── */
function CartItem({ item, onRemove, onQty }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item._id), 280);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "88px 1fr",
        gap: "1.2rem",
        padding: "1.4rem 0",
        borderBottom: "1px solid var(--border)",
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
      }}
    >
      {/* Image */}
      <div style={{ width: 88, height: 108, background: "#f5f0ea", overflow: "hidden" }}>
        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Name + remove */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "var(--ff-display)", fontSize: "1.05rem", fontWeight: 400, color: "var(--charcoal)", lineHeight: 1.2, marginBottom: "0.25rem" }}>
              {item.name}
            </div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-dark)" }}>
              {item.category}
            </div>
          </div>
          <button
            onClick={handleRemove}
            aria-label="Remove"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2, display: "flex", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Qty + price */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)" }}>
            {["−", item.qty, "+"].map((val, i) => {
              const isNum = i === 1;
              return isNum ? (
                <span key="num" style={{ width: 32, textAlign: "center", fontSize: "0.85rem", fontFamily: "var(--ff-body)", color: "var(--charcoal)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", lineHeight: "30px", display: "block", userSelect: "none" }}>
                  {val}
                </span>
              ) : (
                <button
                  key={val}
                  onClick={() => onQty(item._id, i === 0 ? -1 : 1)}
                  style={{ background: "none", border: "none", cursor: "pointer", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "var(--text)", fontFamily: "var(--ff-body)", transition: "background 0.2s, color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--charcoal)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text)"; }}
                >
                  {val}
                </button>
              );
            })}
          </div>
          <span style={{ fontFamily: "var(--ff-body)", fontSize: "0.92rem", fontWeight: 500, color: "var(--gold-dark)" }}>
            {fmt(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────
   Cart (default export)
   Props:
     isOpen  — boolean
     onClose — () => void
──────────────────────── */
export default function Cart({ isOpen, onClose }) {
  const { cartItems: items, removeFromCart, updateQty } = useCart();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleQty = (id, delta) => {
    const item = items.find((i) => i._id === id);
    if (item) {
      updateQty(id, item.qty + delta);
    }
  };

  const handlePromo = () => {
    if (promo.trim().toUpperCase() === "VELA10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 0 && subtotal < 999 ? 99 : 0;
  const total = subtotal - discount + shipping;
  const totalItems = items.reduce((a, i) => a + i.qty, 0);

  if (!isOpen) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(26,24,20,0.42)",
          backdropFilter: "blur(4px)",
          zIndex: 300,
          animation: "cart-fadeIn 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(460px, 100vw)",
          background: "var(--cream)",
          zIndex: 301,
          display: "flex",
          flexDirection: "column",
          animation: "cart-slideIn 0.38s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* ── Header ── */}
        <div style={{ padding: "1.8rem 2rem 1.4rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: "var(--ff-body)", fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.3rem" }}>
              Your Selection
            </p>
            <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "1.7rem", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1, display: "flex", alignItems: "center", gap: "0.6rem" }}>
              Shopping Cart
              {totalItems > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--gold)", color: "#fff", borderRadius: "50%", width: 22, height: 22, fontSize: "0.65rem", fontFamily: "var(--ff-body)", fontWeight: 500 }}>
                  {totalItems}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="icon-btn"
            style={{ border: "1px solid var(--border)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--charcoal)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--charcoal)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 2rem" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5rem 1rem", gap: "1.2rem", height: "100%" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="0.8" style={{ opacity: 0.35 }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p style={{ fontFamily: "var(--ff-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.4rem" }}>
                Your cart awaits
              </p>
              <p style={{ fontFamily: "var(--ff-body)", fontSize: "0.83rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Discover our handcrafted pieces and find<br />something worth wearing every day.
              </p>
              <button className="btn btn--primary" style={{ marginTop: "0.5rem" }} onClick={onClose}>
                Explore Collections
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={item._id} item={item} onRemove={handleRemove} onQty={handleQty} />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div style={{ padding: "1.4rem 2rem 2rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>

            {/* Promo code */}
            <div style={{ display: "flex", border: "1px solid var(--border)", marginBottom: "0.6rem" }}>
              <input
                type="text"
                placeholder='Promo code — try "VELA10"'
                value={promo}
                onChange={(e) => { setPromo(e.target.value); setPromoError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                style={{ flex: 1, padding: "0.65rem 1rem", border: "none", background: "var(--white)", fontFamily: "var(--ff-body)", fontSize: "0.82rem", outline: "none", color: "var(--text)" }}
              />
              <button
                onClick={handlePromo}
                style={{ padding: "0.65rem 1.1rem", background: "var(--charcoal)", color: "#fff", border: "none", fontFamily: "var(--ff-body)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.25s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--charcoal)")}
              >
                Apply
              </button>
            </div>
            {promoApplied && <p style={{ fontSize: "0.7rem", color: "var(--gold-dark)", marginBottom: "0.7rem", fontFamily: "var(--ff-body)" }}>✦ VELA10 applied — 10% off your order</p>}
            {promoError   && <p style={{ fontSize: "0.7rem", color: "#c0392b",       marginBottom: "0.7rem", fontFamily: "var(--ff-body)" }}>Invalid code. Please try again.</p>}

            {/* Summary */}
            {[
              { label: "Subtotal", value: fmt(subtotal), color: "var(--text-muted)" },
              ...(promoApplied ? [{ label: "Discount (10%)", value: `−${fmt(discount)}`, color: "var(--gold-dark)" }] : []),
              { label: "Shipping", value: shipping === 0 ? "Free" : fmt(shipping), color: shipping === 0 ? "var(--gold-dark)" : "var(--text-muted)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.28rem 0", fontSize: "0.82rem", fontFamily: "var(--ff-body)", color }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}

            {shipping > 0 && (
              <p style={{ fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: "0.2rem", fontFamily: "var(--ff-body)" }}>
                Add {fmt(999 - subtotal)} more for free shipping
              </p>
            )}

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0 1.4rem", borderTop: "1px solid var(--border)", marginTop: "0.7rem" }}>
              <span style={{ fontFamily: "var(--ff-display)", fontSize: "1.1rem", fontWeight: 400, color: "var(--charcoal)" }}>Total</span>
              <span style={{ fontFamily: "var(--ff-display)", fontSize: "1.3rem", fontWeight: 300, color: "var(--charcoal)" }}>{fmt(total)}</span>
            </div>

            <button className="btn btn--primary" style={{ width: "100%", marginBottom: "0.75rem" }} onClick={() => {
              onClose();
              navigate('/shipping');
            }}>
              Proceed to Checkout
            </button>
            <button className="btn btn--ghost" style={{ width: "100%" }} onClick={onClose}>
              Continue Shopping
            </button>

            {/* Trust line */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "1.2rem", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--ff-body)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure checkout · SSL encrypted · Hallmark certified
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/*
  USAGE (in Navbar.jsx or wherever you place your cart trigger):

  import { useState } from "react";
  import Cart from "./Cart";

  const [cartOpen, setCartOpen] = useState(false);

  // Cart icon button:
  <button onClick={() => setCartOpen(true)}>🛍</button>

  // Render the drawer:
  <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
*/
