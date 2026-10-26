import { Link } from 'react-router-dom';
import { PawPrint, Heart, Shield, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-white text-slate-900 p-1.5 rounded-lg">
                <PawPrint className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">PetAdopt</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting compassionate individuals and families with rescue shelters to provide loving forever homes for every animal.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/pets" className="hover:text-white transition-colors">Browse Pets</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About the Platform</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Register as Shelter</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Animal Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Explore Species</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pets?species=Dog" className="hover:text-white transition-colors">Dogs & Puppies</Link>
              </li>
              <li>
                <Link to="/pets?species=Cat" className="hover:text-white transition-colors">Cats & Kittens</Link>
              </li>
              <li>
                <Link to="/pets?species=Bird" className="hover:text-white transition-colors">Birds (Budgies, Parrots)</Link>
              </li>
              <li>
                <Link to="/pets?species=Rabbit" className="hover:text-white transition-colors">Rabbits & Small Pets</Link>
              </li>
              <li>
                <Link to="/pets?species=Turtle" className="hover:text-white transition-colors">Turtles</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Verification */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Safety & Care</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Verified non-profit shelters & registered animal welfare partners.</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Health-checked, vaccinated, and sterilized companion animals.</span>
              </div>
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <span>Responsible adoption guidance throughout your journey.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pet Adoption Portal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/about" className="hover:text-slate-400 transition">About</Link>
            <Link to="/pets" className="hover:text-slate-400 transition">All Pets</Link>
            <Link to="/login" className="hover:text-slate-400 transition">Portal Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
