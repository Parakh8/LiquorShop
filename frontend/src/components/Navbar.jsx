import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import SubscribeModal from './SubscribeModal';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collection' },
    { name: 'Offers', path: '/offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="text-gold">Subba Reddy's</span> Liquor Shop
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open glass-panel' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <button className="btn-outline" onClick={() => setSubscribeOpen(true)} style={{padding: '8px 15px', fontSize: '0.8rem'}}>
            Subscribe
          </button>
          <Link to="/cart" className="nav-cart-btn">
            <ShoppingCart size={20} />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} color="var(--color-gold)" /> : <Menu size={28} color="var(--color-gold)" />}
        </button>
      </div>
      <SubscribeModal isOpen={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </nav>
  );
};

export default Navbar;
