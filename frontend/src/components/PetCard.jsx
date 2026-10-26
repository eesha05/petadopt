import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Tag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800";

const PetCard = ({ pet }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(pet.image_url || DEFAULT_PLACEHOLDER);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isSaved = isInWishlist(pet.id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please sign in to save pets to your wishlist.' } });
      return;
    }

    if (role !== 'adopter') {
      alert('Only adopter accounts can save pets to a wishlist.');
      return;
    }

    try {
      setWishlistLoading(true);
      await toggleWishlist(pet.id);
    } catch (err) {
      alert(err.message || 'Could not update wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (pet.status?.toLowerCase()) {
      case 'available':
        return <span className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-0.5 rounded">Available</span>;
      case 'adopted':
        return <span className="bg-slate-700 text-white text-xs font-semibold px-2.5 py-0.5 rounded">Adopted</span>;
      case 'pending':
        return <span className="bg-amber-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded">Adoption Pending</span>;
      default:
        return <span className="bg-gray-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded">{pet.status || 'Unavailable'}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      {/* Image container */}
      <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={pet.name}
          onError={() => setImgSrc(DEFAULT_PLACEHOLDER)}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>

        {/* Species Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-slate-900/80 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
            {pet.species}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          disabled={wishlistLoading}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors shadow-sm ${
            isSaved
              ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${isSaved ? 'fill-rose-600 text-rose-600 scale-105' : ''}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-xl font-bold text-slate-900 truncate">{pet.name}</h3>
            <span className="text-sm font-semibold text-slate-700 ml-2 whitespace-nowrap">
              {pet.age !== null && pet.age !== undefined ? `${pet.age} ${pet.age === 1 ? 'yr' : 'yrs'}` : 'Age N/A'}
            </span>
          </div>

          <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-500 inline flex-shrink-0" />
            <span className="truncate">{pet.breed || pet.species}</span>
            {pet.gender && <span className="text-slate-400">• {pet.gender}</span>}
            {pet.size && <span className="text-slate-400">• {pet.size}</span>}
          </p>

          {pet.location && (
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{pet.location}</span>
            </p>
          )}

          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {pet.description || 'No description provided.'}
          </p>
        </div>

        <Link
          to={`/pets/${pet.id}`}
          className="w-full text-center bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-slate-800 transition-colors block text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
