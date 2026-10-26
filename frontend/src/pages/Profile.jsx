import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    organization_name: user?.organization_name || '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      setSubmitting(true);
      await updateProfile(formData);
      setSuccessMsg('Your profile has been updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your contact details and account settings.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          {/* User Role Card */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{user?.name}</h3>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <span className="bg-slate-900 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-800">
              Role: {user?.role}
            </span>
          </div>

          {/* Feedback banners */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="555-0123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="City, Address"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {user?.role === 'shelter' && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Shelter Organization Details
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Organization Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Update shelter mission or details..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
