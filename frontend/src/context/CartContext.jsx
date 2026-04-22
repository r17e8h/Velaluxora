import { createContext, useState, useContext } from 'react';

// 1. Create the Context directly here (REPLACES the old import)
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item._id === product._id);
      if (itemExists) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const updateQty = (id, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, newQty) } : item
      )
    );
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQty, 
        shippingAddress, 
        saveShippingAddress, 
        paymentMethod,
        savePaymentMethod
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 2. Export the hook
export const useCart = () => {
  return useContext(CartContext);
};