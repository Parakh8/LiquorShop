import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import ThreeBottle from '../components/ThreeBottle';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <PageTransition>
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <h2>Product Not Found</h2>
          <Link to="/collection" className="text-gold">Return to Collection</Link>
        </div>
      </PageTransition>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      style: { background: '#1a1a1a', color: '#c9a84c', border: '1px solid #c9a84c' }
    });
  };

  return (
    <PageTransition>
      <div className="container product-detail-page">
        <Link to="/collection" className="back-link">
          <ArrowLeft size={20} /> Back to Collection
        </Link>
        
        <div className="product-detail-grid">
          <div className="product-detail-3d glass-panel">
            {/* Interactive 3D viewer. In a real app we'd load the specific GLB model for the product */}
            <ThreeBottle />
            <p className="viewer-hint text-center text-gold" style={{fontSize: '0.8rem', marginTop: '10px'}}>
              Interactive 3D View
            </p>
          </div>
          
          <div className="product-detail-info glass-panel">
            <h1 className="detail-title text-gold">{product.name}</h1>
            <div className="detail-meta">
              <span className="detail-price">₹{product.price}</span>
              <span className="detail-rating">★ {product.rating}</span>
            </div>
            
            <p className="detail-description">{product.description}</p>
            
            <div className="detail-specs">
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{product.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ABV:</span>
                <span className="spec-value">{product.abv}%</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Volume:</span>
                <span className="spec-value">{product.volume}ml</span>
              </div>
            </div>
            
            <div className="detail-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              
              <button className="btn-primary flex-1" onClick={handleAddToCart}>
                <ShoppingCart size={20} style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
