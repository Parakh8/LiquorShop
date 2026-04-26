import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import Layout from './components/Layout';
import ParticleBackground from './components/ParticleBackground';
import useVisitTracker from './hooks/useVisitTracker';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Offers from './pages/Offers';
import Admin from './pages/Admin';

const App = () => {
  const location = useLocation();
  const [ageVerified, setAgeVerified] = useState(true); // Default to true for development speed, can implement modal later

  // Track visits
  useVisitTracker();

  useEffect(() => {
    const verified = sessionStorage.getItem('age_verified');
    if (!verified) {
      setAgeVerified(false);
    }
  }, []);

  const handleAgeVerify = (isVerified) => {
    if (isVerified) {
      sessionStorage.setItem('age_verified', 'true');
      setAgeVerified(true);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  if (!ageVerified) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', color: '#fff' }}>
        <h1 className="text-gold" style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '20px' }}>Are you 21+?</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="btn-primary" onClick={() => handleAgeVerify(true)}>Yes, Enter</button>
          <button className="btn-outline" onClick={() => handleAgeVerify(false)}>No, Exit</button>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <ParticleBackground />
      <Toaster position="top-right" />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </CartProvider>
  );
};

export default App;
