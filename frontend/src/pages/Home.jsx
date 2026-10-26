import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileText, Heart, ShieldCheck, Home as HomeIcon } from 'lucide-react';
import api from '../services/api';
import PetCard from '../components/PetCard';

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/pets', { params: { status: 'available' } });
        // Take first 3-4 pets
        setFeaturedPets(res.data.slice(0, 4));
      } catch (err) {
        console.warn('Could not fetch featured pets:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-slate-700">
                <ShieldCheck className="w-4 h-4" /> Trusted Pet Adoption Network
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Give a Loving Animal a <span className="text-emerald-400">Forever Home</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                Browse healthy, vaccinated pets from verified rescue shelters. From loyal dogs and quiet cats to gentle birds, rabbits, and turtles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/pets"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-8 rounded-lg shadow-sm transition flex justify-center items-center gap-2 text-base"
                >
                  Browse Available Pets <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-3.5 px-7 rounded-lg border border-slate-700 transition text-center text-base"
                >
                  Create Free Account
                </Link>
              </div>

              {/* Quick Stat Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-slate-400">Health-Checked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">7+</div>
                  <div className="text-xs text-slate-400">Species Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Verified</div>
                  <div className="text-xs text-slate-400">Shelter Network</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=1200"
                  alt="Companion animals"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="font-bold text-lg">Every companion deserves a family.</p>
                    <p className="text-xs text-slate-300">Find your ideal pet match in just a few clicks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available for Adoption</h2>
              <p className="text-slate-600 text-sm mt-1">Recently listed pets looking for their permanent match</p>
            </div>
            <Link
              to="/pets"
              className="mt-4 sm:mt-0 text-slate-900 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 group"
            >
              Explore all pets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
              No pets currently listed. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How the Adoption Process Works</h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              We make pet adoption transparent, structured, and safe for both adopters and shelter rescuers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Search & Filter</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter by species, breed, age group, size, and location to find an animal that fits your home and lifestyle.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Submit Application</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Complete a comprehensive adoption request detailing your residence, past experience, and care availability.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <HomeIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Shelter Review & Welcome</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The shelter reviews your application, approves the match, and helps you welcome your new companion home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to meet your next companion?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Hundreds of animals are waiting for a caring owner. Start your adoption journey today or list your shelter's animals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/pets"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3 rounded-lg transition text-sm"
            >
              Browse Pets
            </Link>
            <Link
              to="/about"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-7 py-3 rounded-lg border border-slate-700 transition text-sm"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
