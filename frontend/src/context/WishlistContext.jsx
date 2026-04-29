import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlistItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id);

    if (exists) {
      toast('Removed from Wishlist', { icon: '🤍' });
      setWishlist((prev) => prev.filter((item) => item._id !== product._id));
    } else {
      toast.success('Added to Wishlist!', { icon: '❤️' });
      setWishlist((prev) => [...prev, product]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};