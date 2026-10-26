import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlistIds = useCallback(async () => {
    if (!isAuthenticated || role !== 'adopter') {
      setWishlistIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/wishlist/ids');
      setWishlistIds(new Set(res.data));
    } catch (err) {
      console.warn('Could not fetch wishlist IDs:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    fetchWishlistIds();
  }, [fetchWishlistIds]);

  const isInWishlist = (petId) => {
    return wishlistIds.has(Number(petId));
  };

  const toggleWishlist = async (petId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in as an adopter to save pets to your wishlist.');
    }
    if (role !== 'adopter') {
      throw new Error('Only adopters can maintain a pet wishlist.');
    }

    const id = Number(petId);
    const currentlyIn = wishlistIds.has(id);

    // Optimistic update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (currentlyIn) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    try {
      if (currentlyIn) {
        await api.delete(`/wishlist/${id}`);
      } else {
        await api.post(`/wishlist/${id}`);
      }
    } catch (err) {
      // Rollback on failure
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (currentlyIn) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      throw err;
    }
  };

  const value = {
    wishlistIds,
    isInWishlist,
    toggleWishlist,
    fetchWishlistIds,
    wishlistCount: wishlistIds.size,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
