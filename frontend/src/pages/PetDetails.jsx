import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MapPin,
  CheckCircle2,
  Calendar,
  Shield,
  Activity,
  Home,
  Building,
  Info,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import AdoptionFormModal from '../components/AdoptionFormModal';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/pets/${id}`);
        setPet(res.data);
        setImgSrc(res.data.image_url || DEFAULT_IMAGE);

        // If logged in as adopter, check if they already have an application for this pet
        if (isAuthenticated && role === 'adopter') {
          try {
            const reqRes = await api.get('/adoption-requests/my');
            const found = reqRes.data.find((r) => r.pet_id === Number(id));
            if (found) {
              setExistingRequest(found);
            }
          } catch (err) {
            console.warn('Could not check existing adoption requests:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError(err.message || 'Pet not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, isAuthenticated, role]);

  const handleHeartClick = async () => {
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

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/pets/${id}`,
          message: 'Please sign in to your adopter account to apply for this pet.',
        },
      });
      return;
    }

    if (role !== 'adopter') {
      alert('Adoption applications can only be submitted by registered adopter accounts.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleAdoptionSuccess = () => {
    setExistingRequest({
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        <p className="text-sm text-slate-600">Loading pet details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Pet Not Found</h2>
        <p className="text-slate-600 text-sm">{error || 'The pet listing you are looking for does not exist or was removed.'}</p>
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(pet.id);
  const isAvailable = pet.status?.toLowerCase() === 'available';
  const isAdopted = pet.status?.toLowerCase() === 'adopted';

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <Link
          to="/pets"
          className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-slate-900 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to Browse Pets
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Large Image Container */}
          <div className="lg:col-span-6 relative bg-slate-900 min-h-[380px] lg:min-h-[500px]">
            <img
              src={imgSrc}
              alt={pet.name}
              onError={() => setImgSrc(DEFAULT_IMAGE)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-slate-900/80 text-white text-xs font-semibold px-3 py-1.5 rounded-md backdrop-blur-sm">
                {pet.species}
              </span>
            </div>
            <button
              type="button"
              onClick={handleHeartClick}
              disabled={wishlistLoading}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`absolute top-4 right-4 p-3 rounded-full transition shadow-md ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
          </div>

          {/* Right: Details Container */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Header Details */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{pet.name}</h1>
                    <p className="text-slate-600 font-medium text-base mt-1">
                      {pet.breed || pet.species}
                    </p>
                  </div>
                  <div>
                    {isAvailable && (
                      <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Available
                      </span>
                    )}
                    {isAdopted && (
                      <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Adopted
                      </span>
                    )}
                    {!isAvailable && !isAdopted && (
                      <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {pet.status}
                      </span>
                    )}
                  </div>
                </div>

                {pet.location && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{pet.location}</span>
                  </p>
                )}
              </div>

              {/* Quick Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Age</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {pet.age !== null && pet.age !== undefined ? `${pet.age} ${pet.age === 1 ? 'Year' : 'Years'}` : 'N/A'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gender</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{pet.gender || 'Unknown'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Size</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{pet.size || 'Medium'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Spayed/Neutered</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{pet.sterilized ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {/* About description */}
              <div className="space-y-2 mb-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-600" /> About {pet.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pet.description || 'No detailed background story provided.'}
                </p>
              </div>

              {/* Health & Medical Information */}
              <div className="space-y-2 mb-6">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" /> Health & Medical Profile
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                    <span className="text-slate-500 font-medium">General Health:</span>
                    <span className="text-slate-900 font-semibold">{pet.health_info || 'Good / Healthy'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/70 pb-1.5">
                    <span className="text-slate-500 font-medium">Vaccination Status:</span>
                    <span className="text-slate-900 font-semibold">{pet.vaccination_status || 'Up to date'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Sterilization / Neutered:</span>
                    <span className="text-slate-900 font-semibold">{pet.sterilized ? 'Completed' : 'Not Applicable / Pending'}</span>
                  </div>
                </div>
              </div>

              {/* Shelter Info */}
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Building className="w-4 h-4 text-slate-700" />
                  <span>Hosted by: {pet.shelter_name || 'Rescue Organization'}</span>
                </div>
                <p>Location: {pet.location || 'Local partner center'}</p>
                <p className="text-slate-500">Contact verified through PetAdopt moderation team.</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200">
              {isAdopted ? (
                <div className="w-full bg-slate-100 text-slate-600 text-center font-bold py-3.5 px-4 rounded-lg border border-slate-200 cursor-not-allowed">
                  This pet has already been adopted into a loving home.
                </div>
              ) : existingRequest ? (
                <div className="w-full bg-amber-50 text-amber-800 text-center font-semibold py-3 px-4 rounded-lg border border-amber-200 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Application Status: {existingRequest.status?.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    You already have an active adoption request for {pet.name}. View status in your{' '}
                    <Link to="/dashboard/adopter" className="underline font-bold">
                      Dashboard
                    </Link>.
                  </p>
                </div>
              ) : isAvailable ? (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-lg shadow-sm transition text-base flex justify-center items-center gap-2"
                >
                  Apply to Adopt {pet.name}
                </button>
              ) : (
                <div className="w-full bg-slate-100 text-slate-600 text-center font-medium py-3.5 px-4 rounded-lg border border-slate-200">
                  This pet is currently unavailable for adoption.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Form Modal */}
      <AdoptionFormModal
        pet={pet}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAdoptionSuccess}
      />
    </div>
  );
};

export default PetDetails;
