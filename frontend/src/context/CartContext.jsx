import React, { createContext, useReducer, useEffect, useContext } from 'react';

const CartContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem('liquor_cart')) || [],
};

const cartReducer = (state, action) => {
  let updatedCart;
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        updatedCart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      break;
    case 'REMOVE_FROM_CART':
      updatedCart = state.cart.filter(item => item.id !== action.payload.id);
      break;
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity < 1) {
        updatedCart = state.cart.filter(item => item.id !== action.payload.id);
      } else {
        updatedCart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        );
      }
      break;
    case 'CLEAR_CART':
      updatedCart = [];
      break;
    default:
      return state;
  }
  
  localStorage.setItem('liquor_cart', JSON.stringify(updatedCart));
  return { ...state, cart: updatedCart };
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
