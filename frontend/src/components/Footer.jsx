import { Link } from "react-router-dom";
import "../App.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/" className="navbar__logo" style={{ textDecoration: 'none' }}>
            VÉLA<span>LUXORA</span>
          </Link>
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
  );
}