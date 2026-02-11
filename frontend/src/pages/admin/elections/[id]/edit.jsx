import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import api from '@/lib/api';
import useAuthStore from '@/lib/store';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function EditElection() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthStore();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    position: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role === 'user') {
      router.push('/');
      return;
    }

    if (id) {
      fetchData();
    }
  }, [id, user]);

  const fetchData = async () => {
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        api.get(`/elections/${id}`),
        api.get('/candidates', { params: { electionId: id } }),
      ]);

      setElection(electionRes.data);
      setCandidates(candidatesRes.data);
      setFormData({
        title: electionRes.data.title,
        description: electionRes.data.description,
        status: electionRes.data.status,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put(`/elections/${id}`, formData);
      alert('Pemilihan berhasil diperbarui');
      setEditMode(false);
      fetchData();
    } catch (error) {
      alert('Gagal memperbarui pemilihan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataObj = new FormData();
    formDataObj.append('name', candidateForm.name);
    formDataObj.append('position', candidateForm.position);
    formDataObj.append('description', candidateForm.description);
    formDataObj.append('electionId', id);

    try {
      await api.post('/candidates', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Kandidat berhasil ditambahkan');
      setCandidateForm({ name: '', position: '', description: '' });
      setShowAddCandidate(false);
      fetchData();
    } catch (error) {
      alert('Gagal menambah kandidat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!confirm('Hapus kandidat ini?')) return;

    try {
      await api.delete(`/candidates/${candidateId}`);
      alert('Kandidat berhasil dihapus');
      fetchData();
    } catch (error) {
      alert('Gagal menghapus kandidat');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    </>
  );

  if (!election) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Pemilihan tidak ditemukan</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <FiArrowLeft /> Kembali ke Admin
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Edit Pemilihan: {election.title}
          </h1>

          {/* Election Info Section */}
          <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informasi Pemilihan</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FiEdit2 /> {editMode ? 'Batal' : 'Edit'}
              </button>
            </div>

            {!editMode ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Judul</p>
                  <p className="text-lg font-semibold text-gray-900">{election.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deskripsi</p>
                  <p className="text-gray-700">{election.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-gray-900">{election.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Suara</p>
                    <p className="text-lg font-semibold text-blue-600">{election.totalVotes}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isLoading ? 'Sedang menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            )}
          </Card>

          {/* Candidates Section */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kandidat ({candidates.length})</h2>
              <button
                onClick={() => setShowAddCandidate(!showAddCandidate)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <FiPlus /> Tambah Kandidat
              </button>
            </div>

            {showAddCandidate && (
              <form onSubmit={handleAddCandidate} className="bg-blue-50 p-6 rounded-lg mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kandidat
                  </label>
                  <input
                    type="text"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Masukkan nama kandidat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posisi
                  </label>
                  <input
                    type="text"
                    value={candidateForm.position}
                    onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Contoh: Calon Bupati"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={candidateForm.description}
                    onChange={(e) => setCandidateForm({ ...candidateForm, description: e.target.value })}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Deskripsi singkat kandidat"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400"
                >
                  {isLoading ? 'Sedang menambah...' : 'Tambah Kandidat'}
                </button>
              </form>
            )}

            {candidates.length > 0 ? (
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                      <p className="text-xs text-blue-600 mt-1">Suara: {candidate.voteCount}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/candidates/${candidate.id}/edit`)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">Belum ada kandidat</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
