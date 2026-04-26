import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import axios from 'axios';
import PageTransition from '../components/PageTransition';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    deliveryTime: 'Anytime',
    paymentMethod: 'UPI'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
          deliveryTime: formData.deliveryTime
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: getCartTotal() * 1.18 + 500, // naive calculation (assumes no discount here, keeping simple for demo)
        paymentMethod: formData.paymentMethod
      };

      const res = await axios.post('http://localhost:5000/api/orders', orderData);
      
      if (res.data.success) {
        setSuccess(true);
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Order placed successfully!');
        
        // Redirect after showing confetti
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <Confetti width={window.innerWidth} height={window.innerHeight} colors={['#c9a84c', '#8b0000', '#ffffff']} />
        <div className="container checkout-success">
          <h1 className="text-gold" style={{fontSize: '3rem', marginBottom: '20px'}}>Cheers! 🥃</h1>
          <h2>Your order has been placed successfully.</h2>
          <p style={{marginTop: '20px', color: 'var(--color-text)'}}>Redirecting you to the homepage...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container checkout-page">
        <h1 className="section-title text-gold text-center">Checkout</h1>
        
        <form className="checkout-form glass-panel" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="text-gold" style={{marginBottom: '20px'}}>Contact Information</h3>
            <div className="form-grid">
              <input type="text" name="name" placeholder="Full Name" required className="form-input" onChange={handleChange} />
              <input type="tel" name="phone" placeholder="Phone Number" required className="form-input" onChange={handleChange} />
              <input type="email" name="email" placeholder="Email Address" required className="form-input" onChange={handleChange} style={{gridColumn: '1/-1'}} />
            </div>
          </div>

          <div className="form-section">
            <h3 className="text-gold" style={{marginBottom: '20px'}}>Delivery Address</h3>
            <div className="form-grid">
              <input type="text" name="street" placeholder="Street Address" required className="form-input" onChange={handleChange} style={{gridColumn: '1/-1'}} />
              <input type="text" name="city" placeholder="City" required className="form-input" onChange={handleChange} />
              <input type="text" name="state" placeholder="State" required className="form-input" onChange={handleChange} />
              <input type="text" name="pincode" placeholder="Pincode" required className="form-input" onChange={handleChange} />
              <select name="deliveryTime" className="form-input" onChange={handleChange}>
                <option value="Anytime">Anytime</option>
                <option value="Morning">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="Evening">Evening (5 PM - 9 PM)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3 className="text-gold" style={{marginBottom: '20px'}}>Payment Method</h3>
            <div className="payment-methods">
              <label className="radio-label">
                <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleChange} />
                <span>UPI (GPay, PhonePe, Paytm)</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="paymentMethod" value="Card" checked={formData.paymentMethod === 'Card'} onChange={handleChange} />
                <span>Credit / Debit Card</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="form-section" style={{borderBottom: 'none'}}>
            <label className="checkbox-label" style={{marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center'}}>
              <input type="checkbox" required />
              <span style={{color: 'var(--color-text)'}}>I confirm that I am 21 years of age or older.</span>
            </label>
            
            <button type="submit" className="btn-primary" style={{width: '100%', fontSize: '1.2rem', padding: '15px'}} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default Checkout;
