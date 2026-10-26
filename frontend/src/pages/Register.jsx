import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, Building, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('adopter');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    organization_name: '',
    description: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (role === 'shelter' && !formData.organization_name.trim()) {
      setError('Please provide your shelter or rescue organization name.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        organization_name: role === 'shelter' ? formData.organization_name.trim() : null,
        description: role === 'shelter' ? formData.description.trim() : null,
      };

      const user = await register(payload);
      if (user.role === 'shelter') {
        navigate('/dashboard/shelter', { replace: true });
      } else {
        navigate('/dashboard/adopter', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-sm text-slate-500">Join the PetAdopt community as an adopter or animal rescue shelter.</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('adopter')}
            className={`py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
              role === 'adopter' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Pet Adopter</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('shelter')}
            className={`py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
              role === 'shelter' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Shelter / Rescuer</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Common fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {role === 'shelter' ? 'Representative Contact Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="555-0199"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Address / City
              </label>
              <input
                type="text"
                name="address"
                placeholder="City, State"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Shelter Specific Fields */}
          {role === 'shelter' && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Shelter Organization Details
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Organization / Shelter Name *
                </label>
                <input
                  type="text"
                  name="organization_name"
                  required
                  placeholder="e.g. City Paws Animal Sanctuary"
                  value={formData.organization_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  About the Shelter / Mission
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Describe your rescue mission, types of animals handled, etc."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-4"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Creating Account...' : `Register as ${role === 'shelter' ? 'Shelter' : 'Adopter'}`}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-slate-900 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
