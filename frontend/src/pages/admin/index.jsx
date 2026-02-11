import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import api from '@/lib/api';
import useAuthStore from '@/lib/store';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [elections, setElections] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elections');
  const [stats, setStats] = useState({
    totalElections: 0,
    totalUsers: 0,
    activeElections: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role === 'user') {
      router.push('/');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [electionsRes, usersRes] = await Promise.all([
        api.get('/elections'),
        user.role === 'super_admin' ? api.get('/users/admin/users') : null,
      ]);

      setElections(electionsRes.data);
      if (usersRes) {
        setUsers(usersRes.data);
      }

      setStats({
        totalElections: electionsRes.data.length,
        totalUsers: usersRes ? usersRes.data.length : 0,
        activeElections: electionsRes.data.filter((e) => e.status === 'active').length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteElection = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pemilihan ini?')) return;

    try {
      await api.delete(`/elections/${id}`);
      setElections(elections.filter((e) => e.id !== id));
      alert('Pemilihan berhasil dihapus');
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus pemilihan');
    }
  };

  const handleToggleUserStatus = async (userId) {
    try {
      await api.put(`/users/admin/${userId}/status`);
      fetchData();
    } catch (error) {
      alert('Gagal mengubah status user');
    }
  };

  if (!user || user.role === 'user') return null;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-gray-600 text-sm">Total Pemilihan</p>
              <p className="text-4xl font-bold text-blue-600">{stats.totalElections}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Pemilihan Aktif</p>
              <p className="text-4xl font-bold text-red-600">{stats.activeElections}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Total User</p>
              <p className="text-4xl font-bold text-green-600">{stats.totalUsers}</p>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('elections')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'elections'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pemilihan
            </button>
            {user.role === 'super_admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                User Management
              </button>
            )}
          </div>

          {/* Elections Tab */}
          {activeTab === 'elections' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Pemilihan</h2>
                <Link
                  href="/admin/elections/create"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FiPlus /> Buat Pemilihan
                </Link>
              </div>

              {loading ? (
                <p className="text-gray-500">Memuat pemilihan...</p>
              ) : elections.length > 0 ? (
                <div className="space-y-4">
                  {elections.map((election) => (
                    <Card key={election.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {election.title}
                        </h3>
                        <p className="text-sm text-gray-600">{election.description}</p>
                        <div className="mt-2 flex gap-4">
                          <span className="text-xs text-gray-500">
                            Status: {election.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Suara: {election.totalVotes}
                          </span>
                          <span className="text-xs text-gray-500">
                            Kandidat: {election.candidates?.length}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/admin/elections/${election.id}/edit`}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDeleteElection(election.id)}
                          className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Belum ada pemilihan</p>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && user.role === 'super_admin' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manajemen User
              </h2>

              {loading ? (
                <p className="text-gray-500">Memuat user...</p>
              ) : users.length > 0 ? (
                <div className="bg-white rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-900">
                            {u.fullName}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">{u.email}</td>
                          <td className="px-6 py-3 text-sm text-gray-600">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.role === 'super_admin'
                                  ? 'bg-red-100 text-red-700'
                                  : u.role === 'admin'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {u.role === 'super_admin'
                                ? 'Super Admin'
                                : u.role === 'admin'
                                ? 'Admin'
                                : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {u.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Belum ada user</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
