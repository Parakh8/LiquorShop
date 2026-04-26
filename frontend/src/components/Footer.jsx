import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="text-gold">Subba Reddy's</h3>
          <p>Where Every Pour Tells a Story. Premium spirits and luxury collection.</p>
        </div>
        
        <div className="footer-section">
          <h4 className="text-gold">Quick Links</h4>
          <ul>
            <li><Link to="/collection">Collection</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="text-gold">Follow Us</h4>
          <div className="social-links">
            <a href="#"><Globe /></a>
            <a href="#"><MessageCircle /></a>
            <a href="#"><Camera /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Subba Reddy's Liquor Shop. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
