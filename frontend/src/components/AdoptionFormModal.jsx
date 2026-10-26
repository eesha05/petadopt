import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdoptionFormModal = ({ pet, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    phone: user?.phone || '',
    city: '',
    address: user?.address || '',
    housing_type: 'independent house',
    own_or_rent: 'own',
    pets_permitted: true,
    experience: '',
    other_pets: '',
    daily_availability: '4-6 hours',
    reason: '',
    agreed_to_terms: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !pet) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.full_name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!formData.city.trim() || !formData.address.trim()) {
      setError('Please provide your city and complete residential address.');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please describe your motivation for wanting to adopt this pet.');
      return;
    }
    if (!formData.agreed_to_terms) {
      setError('You must confirm that you understand the lifelong responsibilities of pet ownership.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/adoption-requests', {
        pet_id: pet.id,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        housing_type: formData.housing_type,
        own_or_rent: formData.own_or_rent,
        pets_permitted: Boolean(formData.pets_permitted),
        experience: formData.experience.trim() || 'First-time pet parent',
        other_pets: formData.other_pets.trim() || 'None',
        daily_availability: formData.daily_availability,
        reason: formData.reason.trim(),
        agreed_to_terms: true,
        message: formData.reason.trim(),
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit adoption request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Pet Adoption Application</h2>
            <p className="text-sm text-slate-500">Applying to adopt <span className="font-semibold text-slate-800">{pet.name}</span> ({pet.breed || pet.species})</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                Your adoption application for <span className="font-semibold">{pet.name}</span> has been successfully sent to the shelter.
                You can track its status under your Adopter Dashboard.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Pet Summary Card */}
              <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-300"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{pet.name}</h4>
                  <p className="text-xs text-slate-600">{pet.species} • {pet.breed} • {pet.age} years old</p>
                  <p className="text-xs text-slate-500">Location: {pet.location || 'Local Shelter'}</p>
                </div>
              </div>

              {/* Applicant Info Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
                  1. Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="555-0123"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Cityville"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, Apt 4B"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Housing & Living Conditions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
                  2. Living Environment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Housing Type</label>
                    <select
                      name="housing_type"
                      value={formData.housing_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="independent house">Independent House</option>
                      <option value="condo">Condo / Townhouse</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Do you own or rent?</label>
                    <select
                      name="own_or_rent"
                      value={formData.own_or_rent}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    >
                      <option value="own">Own</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pets_permitted"
                      name="pets_permitted"
                      checked={formData.pets_permitted}
                      onChange={handleChange}
                      className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                    />
                    <label htmlFor="pets_permitted" className="text-sm text-slate-700">
                      Pets are permitted at this residence (by landlord or community bylaws)
                    </label>
                  </div>
                </div>
              </div>

              {/* Experience and Availability */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
                  3. Care & Compatibility
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daily availability to care for and interact with the animal
                  </label>
                  <select
                    name="daily_availability"
                    value={formData.daily_availability}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="1-2 hours">1-2 hours / day</option>
                    <option value="2-4 hours">2-4 hours / day</option>
                    <option value="4-6 hours">4-6 hours / day</option>
                    <option value="6+ hours">6+ hours / day (Work from home or family present)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prior experience caring for pets
                  </label>
                  <textarea
                    name="experience"
                    rows={2}
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. Grew up with dogs, raised a cat for 12 years..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Other pets currently living in your household
                  </label>
                  <input
                    type="text"
                    name="other_pets"
                    value={formData.other_pets}
                    onChange={handleChange}
                    placeholder="e.g. 1 senior Golden Retriever, none, etc."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Why do you want to adopt {pet.name}? *
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder={`Tell the shelter about your home, routine, and why you feel you and ${pet.name} are a great match...`}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Confirmation */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="agreed_to_terms"
                    name="agreed_to_terms"
                    required
                    checked={formData.agreed_to_terms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  />
                  <label htmlFor="agreed_to_terms" className="text-xs text-slate-600 leading-normal">
                    I confirm that the information provided is accurate, and I understand that adopting a pet is a long-term commitment of time, affection, nutrition, and veterinary care.
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2 rounded-lg text-sm transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Submitting Application...' : 'Submit Adoption Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionFormModal;
