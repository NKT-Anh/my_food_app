import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    { id: '1', foodName: 'Bánh Mì Chay', foodPrice: 15000, quantity: 1 },
    { id: '2', foodName: 'Trà Sữa Trân Châu', foodPrice: 30000, quantity: 2 },
  ]);

  const addToCart = (item) => {
    const exists = cartItems.find(i => i.id === item.id);
    if (exists) {
      setCartItems(cartItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
