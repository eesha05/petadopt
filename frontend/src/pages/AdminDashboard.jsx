import { useState, useEffect } from 'react';
import {
  Users,
  Building,
  PawPrint,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'pets' | 'requests'

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, usersRes, petsRes, reqRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/users'),
        api.get('/pets', { params: { status: 'all' } }),
        api.get('/admin/requests'),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPets(petsRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.message || 'Failed to fetch admin panel data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.patch(`/users/${userId}/toggle-status`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
    } catch (err) {
      alert(err.message || 'Could not update user status.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert(err.message || 'Could not delete user.');
    }
  };

  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`Moderate and remove pet listing "${petName}"?`)) {
      return;
    }
    try {
      await api.delete(`/pets/${petId}`);
      setPets((prev) => prev.filter((p) => p.id !== petId));
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert(err.message || 'Could not delete pet listing.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md mb-2">
              <Shield className="w-3.5 h-3.5" /> Full Moderation Privileges
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Admin Console</h1>
            <p className="text-sm text-slate-600 mt-1">
              Supervise platform users, shelter operations, and moderation activity.
            </p>
          </div>
          <button
            onClick={fetchAdminData}
            className="text-xs bg-white border border-slate-300 font-semibold px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
            <p className="text-sm text-slate-500">Loading system metrics and user lists...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <p className="text-sm text-rose-700">{error}</p>
            <button
              onClick={fetchAdminData}
              className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats?.total_users || 0}</p>
                <span className="text-[10px] text-slate-400">
                  {stats?.total_adopters} Adopters • {stats?.total_shelters} Shelters
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Pets</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats?.total_pets || 0}</p>
                <span className="text-[10px] text-slate-400">Listed across platform</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Available</span>
                <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{stats?.available_pets || 0}</p>
                <span className="text-[10px] text-emerald-600/80">Ready for adoption</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Adopted</span>
                <p className="text-2xl font-extrabold text-slate-700 mt-0.5">{stats?.adopted_pets || 0}</p>
                <span className="text-[10px] text-slate-400">Forever homes found</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Pending Apps</span>
                <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{stats?.pending_requests || 0}</p>
                <span className="text-[10px] text-amber-600/80">Awaiting shelter action</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">Approved Apps</span>
                <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{stats?.approved_requests || 0}</p>
                <span className="text-[10px] text-indigo-600/80">Completed matches</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-6 space-x-8">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === 'overview'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview & Summary
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === 'users'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                User Accounts ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pets')}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === 'pets'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                All Pets ({pets.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === 'requests'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                All Applications ({requests.length})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-700" /> Platform User Composition
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Total Registered Adopters</span>
                      <span className="font-bold text-slate-900">{stats?.total_adopters}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Registered Shelters & Rescues</span>
                      <span className="font-bold text-slate-900">{stats?.total_shelters}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">System Administrators</span>
                      <span className="font-bold text-slate-900">1</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <PawPrint className="w-5 h-5 text-slate-700" /> Listing & Adoption Metrics
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Active Available Listings</span>
                      <span className="font-bold text-emerald-600">{stats?.available_pets}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Successful Placements (Adopted)</span>
                      <span className="font-bold text-slate-900">{stats?.adopted_pets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Adoption Requests Rejected</span>
                      <span className="font-bold text-rose-600">{stats?.rejected_requests}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Users Management */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5 text-left">User</th>
                        <th className="px-6 py-3.5 text-left">Role</th>
                        <th className="px-6 py-3.5 text-left">Phone & Address</th>
                        <th className="px-6 py-3.5 text-left">Status</th>
                        <th className="px-6 py-3.5 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'shelter'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                            <div>{u.phone || 'No phone'}</div>
                            <div className="text-slate-400">{u.address || 'No address'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                u.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {u.is_active ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            {u.id !== currentUser?.id && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded transition font-medium"
                                  title="Toggle active status"
                                >
                                  {u.is_active ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Pets Management */}
            {activeTab === 'pets' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5 text-left">Pet</th>
                        <th className="px-6 py-3.5 text-left">Species / Breed</th>
                        <th className="px-6 py-3.5 text-left">Shelter Host</th>
                        <th className="px-6 py-3.5 text-left">Status</th>
                        <th className="px-6 py-3.5 text-right">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {pets.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image_url}
                                alt={p.name}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800'; }}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{p.name}</div>
                                <div className="text-xs text-slate-500">{p.location || 'Local Shelter'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-slate-900">{p.species}</span>
                            <span className="text-xs text-slate-500 block">{p.breed}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700">
                            {p.shelter_name || `Shelter #${p.shelter_id}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                p.status === 'available'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : p.status === 'adopted'
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => handleDeletePet(p.id, p.name)}
                              className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded transition font-medium inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Listing
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: All Requests */}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5 text-left">Applicant</th>
                        <th className="px-6 py-3.5 text-left">Pet Requested</th>
                        <th className="px-6 py-3.5 text-left">Housing & City</th>
                        <th className="px-6 py-3.5 text-left">Date</th>
                        <th className="px-6 py-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {requests.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{r.full_name || r.adopter?.name}</div>
                            <div className="text-xs text-slate-500">{r.adopter?.email} • {r.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{r.pet?.name || `#${r.pet_id}`}</div>
                            <div className="text-xs text-slate-500">{r.pet?.species} • Shelter: {r.pet?.shelter_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                            <div>{r.city || 'N/A'}</div>
                            <div className="text-slate-400">{r.housing_type} ({r.own_or_rent})</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                            {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                r.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : r.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
