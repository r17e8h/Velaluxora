import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function ProductScreen() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: "center", padding: "5rem" }}>Loading luxury details...</h2>;

  return (
    <div className="product-screen" style={{ padding: "100px 5%", minHeight: "80vh" }}>
      <Link to="/" className="btn btn--ghost" style={{ marginBottom: "2rem" }}>
        ← Back to Collections
      </Link>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        {/* Left Side: Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: "100%", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} 
        />
        
        {/* Right Side: Details */}
        <div>
          <p className="section__eyebrow" style={{ color: "#d4af7a" }}>{product.category}</p>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{product.name}</h1>
          <h2 style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "2rem" }}>₹{product.price}</h2>
          
          <p style={{ lineHeight: "1.8", color: "#555", marginBottom: "2rem" }}>
            {product.description}
          </p>
          
          {/* Stock Status */}
          <p style={{ marginBottom: "2rem", fontWeight: "bold", color: product.countInStock > 0 ? "green" : "red" }}>
            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button 
            className="btn btn--primary" 
            style={{ width: "100%", padding: "1.5rem" }}
            disabled={product.countInStock === 0}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}