import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800";

const WishlistPage = () => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/wishlist');
      setWishlistItems(res.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Could not load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [wishlistIds.size]);

  const handleRemove = async (petId) => {
    try {
      await toggleWishlist(petId);
      setWishlistItems((prev) => prev.filter((item) => item.pet_id !== petId));
    } catch (err) {
      alert(err.message || 'Could not remove pet from wishlist.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Heart className="w-8 h-8 text-rose-600 fill-rose-600" /> My Saved Pets
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Pets you have shortlisted for adoption. Saved across your account.
            </p>
          </div>
          <Link
            to="/pets"
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Browse More Pets
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
            <p className="text-sm text-slate-500">Loading your saved pets...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-md mx-auto space-y-3">
            <p className="text-sm text-rose-700">{error}</p>
            <button
              onClick={fetchWishlist}
              className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const pet = item.pet;
              if (!pet) return null;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={pet.image_url || DEFAULT_IMAGE}
                      alt={pet.name}
                      onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded">
                        {pet.species}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(pet.id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 p-2 bg-white/90 text-rose-600 hover:bg-rose-50 rounded-full transition shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{pet.name}</h3>
                        <span className="text-xs font-semibold text-slate-600">
                          {pet.age !== null ? `${pet.age} yrs` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        {pet.breed || pet.species} • {pet.gender || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                        {pet.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <Link
                        to={`/pets/${pet.id}`}
                        className="w-full text-center bg-slate-900 text-white font-semibold py-2 px-3 rounded-lg text-xs hover:bg-slate-800 transition block"
                      >
                        View Pet Details & Apply
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(pet.id)}
                        className="w-full text-center text-slate-500 hover:text-rose-600 text-xs py-1 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              You haven't saved any pets to your favorites yet. Explore our listings and tap the heart icon on any pet card to save them here.
            </p>
            <Link
              to="/pets"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-800 transition"
            >
              Browse Available Pets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
