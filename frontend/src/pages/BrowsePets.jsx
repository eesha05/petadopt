import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import PetCard from '../components/PetCard';

const SPECIES_OPTIONS = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Turtle'];
const SIZE_OPTIONS = ['All', 'Small', 'Medium', 'Large'];
const GENDER_OPTIONS = ['All', 'Male', 'Female'];
const AGE_OPTIONS = [
  { label: 'All Ages', value: '' },
  { label: 'Baby / Young (≤ 1 yr)', value: 'baby' },
  { label: 'Young Adult (2 - 3 yrs)', value: 'young' },
  { label: 'Adult (4 - 6 yrs)', value: 'adult' },
  { label: 'Senior (7+ yrs)', value: 'senior' },
];

const BrowsePets = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from query params if present (e.g., from footer links)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [species, setSpecies] = useState(searchParams.get('species') || 'All');
  const [breed, setBreed] = useState(searchParams.get('breed') || '');
  const [size, setSize] = useState('All');
  const [gender, setGender] = useState('All');
  const [ageGroup, setAgeGroup] = useState('');
  const [availability, setAvailability] = useState('available');
  const [sortBy, setSortBy] = useState('newest');

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (species !== 'All') params.species = species;
      if (breed.trim()) params.breed = breed.trim();
      if (size !== 'All') params.size = size;
      if (gender !== 'All') params.gender = gender;
      if (ageGroup) params.age_group = ageGroup;
      if (availability) params.status = availability;
      if (sortBy) params.sort_by = sortBy;

      const res = await api.get('/pets', { params });
      setPets(res.data);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.message || 'Failed to load pets. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [search, species, breed, size, gender, ageGroup, availability, sortBy]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleClearFilters = () => {
    setSearch('');
    setSpecies('All');
    setBreed('');
    setSize('All');
    setGender('All');
    setAgeGroup('');
    setAvailability('available');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    search ||
    species !== 'All' ||
    breed ||
    size !== 'All' ||
    gender !== 'All' ||
    ageGroup ||
    availability !== 'available' ||
    sortBy !== 'newest';

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse Adoptable Pets
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Discover dogs, cats, birds, rabbits, hamsters, turtles, and more waiting for their forever homes.
          </p>
        </div>

        {/* Search & Species Quick Pills */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by pet name, breed, location, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              >
                <option value="newest">Sort: Newest Listed</option>
                <option value="oldest">Sort: Oldest Listed</option>
                <option value="age_asc">Age: Youngest First</option>
                <option value="age_desc">Age: Oldest First</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Species Pills */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Species</div>
            <div className="flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSpecies(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                    species.toLowerCase() === item.toLowerCase()
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item === 'All' ? 'All Species' : item}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Filters Drawer */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {/* Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'Any Size' : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g === 'All' ? 'Any Gender' : g}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
              >
                <option value="available">Available Only</option>
                <option value="all">All (Including Adopted)</option>
              </select>
            </div>
          </div>

          {/* Active filter reset bar */}
          {hasActiveFilters && (
            <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
              <span>Active filters applied</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-900 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-semibold text-slate-700">
            {loading ? 'Searching pets...' : `Showing ${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}`}
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
            <p className="text-sm text-slate-500">Fetching adoptable animals...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3 max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">Failed to Load Pets</h3>
            <p className="text-sm text-rose-700">{error}</p>
            <button
              type="button"
              onClick={fetchPets}
              className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              Try Again
            </button>
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No pets match your criteria</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We couldn't find any adoptable pets matching your current filters. Try searching for a different breed or species.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePets;
