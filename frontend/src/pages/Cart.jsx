import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const { cart, dispatch, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SUBBA10') {
      setDiscount(0.1);
      toast.success('Coupon applied! 10% discount added.');
    } else {
      toast.error('Invalid coupon code');
      setDiscount(0);
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const handleRemoveItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    toast.success('Item removed from cart');
  };

  const subtotal = getCartTotal();
  const gst = subtotal * 0.18;
  const delivery = subtotal > 0 ? 500 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal + gst + delivery - discountAmount;

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="container empty-cart">
          <ShoppingBag size={64} className="text-gold" style={{marginBottom: '20px'}} />
          <h1 className="section-title">Your Cart is Empty</h1>
          <p style={{marginBottom: '30px'}}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/collection" className="btn-primary">Browse Collection</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container cart-page">
        <h1 className="section-title text-gold">Shopping Cart</h1>
        
        <div className="cart-grid">
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item glass-panel">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="text-gold">₹{item.price}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector" style={{height: '35px'}}>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary glass-panel">
            <h2 style={{marginBottom: '20px', fontFamily: 'var(--font-heading)'}}>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>₹{delivery.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row text-gold">
                <span>Discount (10%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="text-gold">₹{total.toFixed(2)}</span>
            </div>
            
            <div className="coupon-section">
              <input 
                type="text" 
                placeholder="Coupon Code (Try SUBBA10)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="form-input"
              />
              <button className="btn-outline" onClick={handleApplyCoupon} style={{padding: '10px', fontSize: '0.9rem', width: '100%', marginTop: '10px'}}>
                Apply Coupon
              </button>
            </div>
            
            <button 
              className="btn-primary" 
              style={{width: '100%', marginTop: '20px'}}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
