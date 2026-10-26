import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Heart, Search, ArrowRight, Loader2, Calendar } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800";

const AdopterDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/adoption-requests/my');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching adopter applications:', err);
      setError(err.message || 'Could not load your adoption requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Adopter Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">
              Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>. Track your adoption applications here.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/wishlist"
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-slate-100 transition shadow-sm"
            >
              <Heart className="w-4 h-4 text-rose-500" /> My Wishlist
            </Link>
            <Link
              to="/pets"
              className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              <Search className="w-4 h-4" /> Browse Pets
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{applications.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Review
            </p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Rejected
            </p>
            <p className="text-3xl font-extrabold text-rose-600 mt-1">{rejectedCount}</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Submitted Adoption Applications</h2>
            <button
              onClick={fetchApplications}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
              <p className="text-sm text-slate-500">Retrieving your requests...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-700 text-sm">
              {error}
            </div>
          ) : applications.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {applications.map((app) => {
                const pet = app.pet;
                const formattedDate = app.created_at
                  ? new Date(app.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Recent';

                return (
                  <div
                    key={app.id}
                    className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-50/60 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={pet?.image_url || DEFAULT_IMAGE}
                        alt={pet?.name || 'Pet'}
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{pet?.name || `Pet #${app.pet_id}`}</h3>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {pet?.species || 'Animal'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {pet?.breed ? `${pet.breed} • ` : ''}Shelter: {pet?.shelter_name || 'Rescue Shelter'}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Applied on {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      {/* Status indicator */}
                      <div>
                        {app.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Clock className="w-4 h-4 text-amber-600" /> Pending Shelter Review
                          </span>
                        )}
                        {app.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <XCircle className="w-4 h-4 text-rose-600" /> Not Approved
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <Link
                        to={`/pets/${app.pet_id}`}
                        className="text-xs font-semibold text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition"
                      >
                        View Pet
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Adoption Applications Yet</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                When you submit an adoption request for any pet, its live review status will appear here.
              </p>
              <Link
                to="/pets"
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-800 transition"
              >
                Browse Available Pets <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdopterDashboard;
