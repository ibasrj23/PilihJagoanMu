import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import api from '@/lib/api';
import Link from 'next/link';

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      setElections(response.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredElections = elections.filter((e) => {
    if (filter === 'active') return e.status === 'active';
    if (filter === 'pending') return e.status === 'pending';
    if (filter === 'completed') return e.status === 'completed';
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Semua Pemilihan</h1>
          <p className="text-gray-600 mb-8">
            Ikuti pemilihan dan tunjukkan suara Anda
          </p>

          {/* Filter */}
          <div className="mb-8 flex gap-2 flex-wrap">
            {['all', 'active', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'all'
                  ? 'Semua'
                  : status === 'active'
                  ? 'Aktif'
                  : status === 'pending'
                  ? 'Mendatang'
                  : 'Selesai'}
              </button>
            ))}
          </div>

          {/* Elections Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">Memuat pemilihan...</p>
            </div>
          ) : filteredElections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredElections.map((election) => (
                <Link key={election.id} href={`/elections/${election.id}`}>
                  <Card className="cursor-pointer h-full transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">
                        {election.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                          election.status === 'active'
                            ? 'bg-red-100 text-red-700'
                            : election.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {election.status === 'active'
                          ? 'AKTIF'
                          : election.status === 'pending'
                          ? 'SEGERA'
                          : 'SELESAI'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {election.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>📊 Suara: {election.totalVotes}</p>
                      <p>👥 Peserta: {election.totalParticipants}</p>
                      <p>🎯 Kandidat: {election.candidates.length}</p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-blue-600 font-semibold">Lihat detail →</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Tidak ada pemilihan untuk status ini
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
