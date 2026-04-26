import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const tiltRef = useRef(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
      });
    }
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#1a1a1a',
        color: '#c9a84c',
        border: '1px solid #c9a84c'
      }
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div ref={tiltRef} className="product-card glass-panel">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-meta">
            <span className="product-price">₹{product.price}</span>
            <span className="product-rating">★ {product.rating}</span>
          </div>
          <button className="btn-primary add-to-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={16} style={{ marginRight: '8px' }} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
