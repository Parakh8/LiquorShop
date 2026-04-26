import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Collection.css';

const Collection = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <PageTransition>
      <div className="container collection-page">
        <h1 className="section-title text-gold text-center">Our Collection</h1>
        
        <div className="filter-bar">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          className="product-grid"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredProducts.map(product => (
            <motion.div 
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Collection;
