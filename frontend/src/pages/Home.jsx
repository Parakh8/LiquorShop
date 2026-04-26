import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThreeBottle from '../components/ThreeBottle';
import PageTransition from '../components/PageTransition';
import './Home.css';

const Home = () => {
  return (
    <PageTransition>
      <div className="home">
        <section className="hero-section">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title"
            >
              <span className="text-gold">Subba Reddy's</span> <br/>
              Liquor Shop
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="hero-subtitle typewriter"
            >
              Where Every Pour Tells a Story
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="hero-ctas"
            >
              <Link to="/collection" className="btn-primary">Explore Collection</Link>
              <button className="btn-outline">Subscribe for Offers</button>
            </motion.div>
          </div>
          
          <div className="hero-3d-container">
            <ThreeBottle />
          </div>
        </section>
        
        {/* Featured Section placeholder */}
        <section className="featured-section container">
          <h2 className="section-title text-gold text-center">Featured Spirits</h2>
          <div className="featured-grid">
            {/* Will be populated with ProductCards in full implementation */}
            <p className="text-center" style={{gridColumn: '1/-1', padding: '50px 0'}}>
              Visit the <Link to="/collection" className="text-gold">Collection</Link> page to see our full inventory.
            </p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
