import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import './SubscribeModal.css';

const SubscribeModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/subscribe', { email });
      if (res.data.success) {
        toast.success("Welcome to the club! Check your email for a 10% discount code.", {
          duration: 5000,
          style: { background: '#1a1a1a', color: '#c9a84c', border: '1px solid #c9a84c' }
        });
        setEmail('');
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to subscribe. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="subscribe-modal glass-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
            
            <h2 className="text-gold" style={{marginBottom: '10px'}}>Join the Elite</h2>
            <p style={{marginBottom: '30px', color: 'var(--color-text)'}}>
              Subscribe to our newsletter and get 10% off your first order, plus exclusive access to limited edition releases.
            </p>
            
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{marginBottom: '20px'}}
              />
              <button type="submit" className="btn-primary" style={{width: '100%'}} disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscribeModal;
