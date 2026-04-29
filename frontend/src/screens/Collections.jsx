import { useState, useEffect } from "react";
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import ProductCard from '../components/ProductCard';
import "../App.css";

const CATEGORIES = ["All", "Rings", "Necklaces", "Bracelets", "Earrings"];

const SORT_OPTIONS = [
  { label: "Newest",          value: "newest"     },
  { label: "Price: Low–High", value: "price_asc"  },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Top Rated",       value: "rating"     },
];

function SkeletonCard() {
  return (
    <div className="product-card skeleton-card" style={{ padding: '1rem', border: '1px solid var(--border)', background: 'white' }}>
      <div className="product-card__img-wrap skeleton-box" style={{ background: '#eee', aspectRatio: '1/1', marginBottom: '1rem' }} />
      <div className="skeleton-line" style={{ width: "70%", height: "14px", background: "#eee", marginBottom: "0.5rem" }} />
      <div className="skeleton-line" style={{ width: "40%", height: "14px", background: "#eee" }} />
    </div>
  );
}

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sortBy, setSortBy]       = useState("newest");
  const [search, setSearch]       = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const { data } = await axios.get(`/api/products${query}`);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  const filtered = products.filter((p) =>
    activeCategory === "All"
      ? true
      : p.category?.toLowerCase() === activeCategory.toLowerCase()
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating")     return b.rating - a.rating;
    return 0;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="collections-page">
      <div className="collections-hero">
        <div className="collections-hero__bg" />
        <div className="collections-hero__content">
          <p className="section__eyebrow">Handcrafted in India</p>
          <h1 className="collections-hero__title">Our Collections</h1>
          <p className="collections-hero__sub">Every piece tells a story worth wearing.</p>
          <form className="collections-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search rings, necklaces, gold…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="collections-controls">
        <div className="collections-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? "cat-pill--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="collections-sort">
          <span className="collections-count">
            {loading ? "—" : `${sorted.length} piece${sorted.length !== 1 ? "s" : ""}`}
          </span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="collections-grid-wrap">
        {error ? (
          <div className="collections-error">
            <p>⚠ Could not reach the server.</p>
            <p className="collections-error__detail">{error}</p>
          </div>
        ) : (
          <div className="product-grid" style={{ padding: '2rem 5%' }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : sorted.length === 0
              ? (
                <div className="collections-empty" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 0' }}>
                  <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    No pieces found{search ? ` for "${search}"` : ""}.
                  </p>
                  {search && (
                    <button className="btn btn--ghost"
                      onClick={() => { setSearch(""); setSearchInput(""); }}>
                      Clear Search
                    </button>
                  )}
                </div>
              )
              : sorted.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>
        )}
      </div>

    </div>
  );
}