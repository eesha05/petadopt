import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Loader2,
  X,
  FileText,
  User,
  Home,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800";

const SPECIES_LIST = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Turtle', 'Other'];

const ShelterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pets'); // 'pets' | 'requests'

  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null); // null = Add, object = Edit
  const [selectedRequest, setSelectedRequest] = useState(null); // for viewing full applicant details modal

  // Pet form state
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    location: user?.address || '',
    description: '',
    health_info: 'Healthy',
    vaccination_status: 'Up to date',
    sterilized: false,
    image_url: '',
    status: 'available',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [petsRes, reqRes] = await Promise.all([
        api.get('/pets/my'),
        api.get('/adoption-requests/shelter'),
      ]);
      setPets(petsRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error('Error fetching shelter dashboard data:', err);
      setError(err.message || 'Failed to load shelter data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPet(null);
    setPetForm({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      size: 'Medium',
      location: user?.address || '',
      description: '',
      health_info: 'Healthy',
      vaccination_status: 'Up to date',
      sterilized: false,
      image_url: '',
      status: 'available',
    });
    setFormError(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (pet) => {
    setEditingPet(pet);
    setPetForm({
      name: pet.name || '',
      species: pet.species || 'Dog',
      breed: pet.breed || '',
      age: pet.age !== null && pet.age !== undefined ? pet.age : '',
      gender: pet.gender || 'Male',
      size: pet.size || 'Medium',
      location: pet.location || '',
      description: pet.description || '',
      health_info: pet.health_info || '',
      vaccination_status: pet.vaccination_status || '',
      sterilized: Boolean(pet.sterilized),
      image_url: pet.image_url || '',
      status: pet.status || 'available',
    });
    setFormError(null);
    setIsAddEditOpen(true);
  };

  const handlePetFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePetFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!petForm.name.trim()) {
      setFormError('Pet name is required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        name: petForm.name.trim(),
        species: petForm.species,
        breed: petForm.breed.trim() || null,
        age: petForm.age !== '' ? Number(petForm.age) : null,
        gender: petForm.gender,
        size: petForm.size,
        location: petForm.location.trim() || null,
        description: petForm.description.trim() || null,
        health_info: petForm.health_info.trim() || null,
        vaccination_status: petForm.vaccination_status.trim() || null,
        sterilized: Boolean(petForm.sterilized),
        image_url: petForm.image_url.trim() || DEFAULT_IMAGE,
        status: petForm.status,
      };

      if (editingPet) {
        await api.put(`/pets/${editingPet.id}`, payload);
      } else {
        await api.post('/pets', payload);
      }

      setIsAddEditOpen(false);
      await fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to save pet listing.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the listing for "${petName}"?`)) {
      return;
    }
    try {
      await api.delete(`/pets/${petId}`);
      setPets((prev) => prev.filter((p) => p.id !== petId));
    } catch (err) {
      alert(err.message || 'Could not delete pet.');
    }
  };

  const handleStatusChange = async (petId, newStatus) => {
    try {
      const res = await api.patch(`/pets/${petId}/status?status=${newStatus}`);
      setPets((prev) => prev.map((p) => (p.id === petId ? res.data : p)));
    } catch (err) {
      alert(err.message || 'Could not update status.');
    }
  };

  const handleApproveRequest = async (requestId) => {
    if (!window.confirm('Approve this adoption application? The pet will be marked as Adopted and other pending applications will be rejected.')) {
      return;
    }
    try {
      await api.patch(`/adoption-requests/${requestId}/approve`);
      await fetchData();
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (err) {
      alert(err.message || 'Could not approve request.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to decline this application?')) {
      return;
    }
    try {
      await api.patch(`/adoption-requests/${requestId}/reject`);
      await fetchData();
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (err) {
      alert(err.message || 'Could not reject request.');
    }
  };

  // Stats calculation
  const totalPets = pets.length;
  const availablePets = pets.filter((p) => p.status === 'available').length;
  const adoptedPets = pets.filter((p) => p.status === 'adopted').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const approvedRequests = requests.filter((r) => r.status === 'approved').length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shelter Operations Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">
              {user?.organization_name || 'Rescue Organization'} • Manage your companion listings and adoption applications.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> Add New Pet Listing
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Listed</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalPets}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Available</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{availablePets}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Adopted</span>
            <p className="text-2xl font-extrabold text-slate-700 mt-0.5">{adoptedPets}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Pending Apps</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{pendingRequests}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">Approved</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{approvedRequests}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('pets')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'pets'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Pet Listings ({pets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Adoption Applications ({requests.length})
            {pendingRequests > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingRequests} new
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Pets Table */}
        {activeTab === 'pets' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 text-left">Pet</th>
                    <th className="px-6 py-3.5 text-left">Species & Breed</th>
                    <th className="px-6 py-3.5 text-left">Age & Gender</th>
                    <th className="px-6 py-3.5 text-left">Current Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pets.length > 0 ? (
                    pets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={pet.image_url || DEFAULT_IMAGE}
                              alt={pet.name}
                              onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{pet.name}</div>
                              <div className="text-xs text-slate-500">{pet.location || 'Shelter'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-slate-900">{pet.species}</span>
                          <span className="text-xs text-slate-500 block">{pet.breed || 'Mixed'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs">
                          {pet.age !== null ? `${pet.age} yrs` : 'N/A'} • {pet.gender || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={pet.status}
                            onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                              pet.status === 'available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : pet.status === 'adopted'
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="adopted">Adopted</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(pet)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
                            title="Edit Pet"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePet(pet.id, pet.name)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition"
                            title="Delete Pet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                        You have not listed any pets yet. Click "Add New Pet Listing" above to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Requests Table */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 text-left">Applicant</th>
                    <th className="px-6 py-3.5 text-left">Pet Requested</th>
                    <th className="px-6 py-3.5 text-left">Submitted Date</th>
                    <th className="px-6 py-3.5 text-left">Status</th>
                    <th className="px-6 py-3.5 text-right">Review & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{req.full_name || req.adopter?.name}</div>
                          <div className="text-xs text-slate-500">{req.adopter?.email} • {req.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{req.pet?.name || `#${req.pet_id}`}</div>
                          <div className="text-xs text-slate-500">{req.pet?.species} ({req.pet?.breed || 'Mixed'})</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Approved
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Declined
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-md text-xs transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Application
                          </button>
                          {req.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveRequest(req.id)}
                                className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md text-xs transition"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(req.id)}
                                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-3 py-1.5 rounded-md text-xs transition"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No adoption applications received yet for your listed animals.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Pet Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPet ? `Edit Pet Listing: ${editingPet.name}` : 'Create New Pet Listing'}
              </h3>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePetFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-sm border border-rose-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={petForm.name}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Species *
                  </label>
                  <select
                    name="species"
                    value={petForm.species}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {SPECIES_LIST.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="e.g. Golden Retriever, Budgie..."
                    value={petForm.breed}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    name="age"
                    placeholder="e.g. 2"
                    value={petForm.age}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={petForm.gender}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Size
                  </label>
                  <select
                    name="size"
                    value={petForm.size}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    placeholder="https://images.unsplash.com/..."
                    value={petForm.image_url}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={petForm.location}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Description & Temperament
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={petForm.description}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Health Details
                  </label>
                  <input
                    type="text"
                    name="health_info"
                    value={petForm.health_info}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Vaccination Status
                  </label>
                  <input
                    type="text"
                    name="vaccination_status"
                    value={petForm.vaccination_status}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="sterilized"
                    name="sterilized"
                    checked={petForm.sterilized}
                    onChange={handlePetFormChange}
                    className="h-4 w-4 text-slate-900 rounded border-slate-300"
                  />
                  <label htmlFor="sterilized" className="text-sm text-slate-700 font-medium">
                    Spayed / Neutered
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Listing Status
                  </label>
                  <select
                    name="status"
                    value={petForm.status}
                    onChange={handlePetFormChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-slate-900 text-white font-semibold px-6 py-2 rounded-lg text-sm hover:bg-slate-800 transition flex items-center gap-2"
                >
                  {formSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {formSubmitting ? 'Saving...' : 'Save Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Application Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Adoption Application Review</h3>
                <p className="text-xs text-slate-500">Applicant: {selectedRequest.full_name || selectedRequest.adopter?.name}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              {/* Pet Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <img
                  src={selectedRequest.pet?.image_url || DEFAULT_IMAGE}
                  alt={selectedRequest.pet?.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{selectedRequest.pet?.name}</h4>
                  <p className="text-xs text-slate-600">{selectedRequest.pet?.species} • {selectedRequest.pet?.breed}</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Applicant Contact</h5>
                <p><span className="text-slate-500">Name:</span> {selectedRequest.full_name}</p>
                <p><span className="text-slate-500">Email:</span> {selectedRequest.adopter?.email}</p>
                <p><span className="text-slate-500">Phone:</span> {selectedRequest.phone || 'N/A'}</p>
                <p><span className="text-slate-500">Address:</span> {selectedRequest.address}, {selectedRequest.city}</p>
              </div>

              {/* Environment */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Home & Living Conditions</h5>
                <p><span className="text-slate-500">Housing Type:</span> {selectedRequest.housing_type}</p>
                <p><span className="text-slate-500">Ownership:</span> {selectedRequest.own_or_rent}</p>
                <p><span className="text-slate-500">Pets Permitted:</span> {selectedRequest.pets_permitted ? 'Yes' : 'No'}</p>
                <p><span className="text-slate-500">Daily Care Availability:</span> {selectedRequest.daily_availability || 'Flexible'}</p>
              </div>

              {/* Care History */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Experience & Household Pets</h5>
                <p><span className="text-slate-500">Prior Animal Experience:</span> {selectedRequest.experience || 'None noted'}</p>
                <p><span className="text-slate-500">Other Pets at Home:</span> {selectedRequest.other_pets || 'None'}</p>
              </div>

              {/* Motivation */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Reason for Adopting</h5>
                <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-800 text-xs leading-relaxed">
                  {selectedRequest.reason || selectedRequest.message || 'No additional reason provided.'}
                </p>
              </div>

              {/* Action buttons inside modal */}
              {selectedRequest.status === 'pending' ? (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
                  >
                    Decline Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-2 rounded-lg transition"
                  >
                    Approve & Finalize Adoption
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded text-center">
                  This application has already been marked as {selectedRequest.status.toUpperCase()}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterDashboard;
