import { Link } from 'react-router-dom';
import { PawPrint, Heart, Shield, Users, CheckCircle, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
        
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Connecting Rescues with Loving Homes
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            The Pet Adoption Portal is a centralized full-stack platform designed to simplify, modernize, and safeguard the adoption process for animals in need.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-600" /> Why Adoption Matters
          </h2>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            Millions of healthy, affectionate companion animals enter animal shelters and rescue foster networks each year. Without a coordinated platform, shelters struggle to find qualified applicants, while potential adopters face fragmented information, scams, or unverified breeders.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            By choosing to adopt rather than buy, adopters save innocent lives, actively discourage commercial breeding mills, and open up vital shelter space for other animals in emergency need.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Adopters */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">For Adopters</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Search and filter across dogs, cats, birds, rabbits, hamsters, and turtles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Transparent medical records, vaccination profiles, and sterilization data.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Structured digital application form with real-time status tracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Personalized wishlist to save shortlisted animals across devices.</span>
              </li>
            </ul>
          </div>

          {/* For Shelters */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-lg flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">For Shelters & Rescuers</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Manage listings, photos, medical histories, and availability in real time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Review detailed applicant questionnaires (housing, past pet experience, care hours).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>One-click approval and rejection with automatic pet status updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Protected role-based dashboard ensuring listing integrity.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-white text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore available companions?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Browse our catalog of verified shelter pets or create an account to start your adoption process today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/pets"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              Browse Pets <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg text-sm border border-slate-700 transition"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
