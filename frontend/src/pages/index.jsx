import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import api from '@/lib/api';
import useAuthStore from '@/lib/store';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchElections();
    }
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

  const activeElections = elections.filter((e) => e.status === 'active');
  const upcomingElections = elections.filter((e) => e.status === 'pending');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pilih Jagoan Mu
            </h1>
            <p className="text-lg text-blue-100">
              Platform pemilihan suara yang transparan, aman, dan real-time
            </p>
            {!user && (
              <div className="mt-8 flex gap-4">
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {user ? (
            <>
              {/* Welcome Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Selamat datang, {user.fullName}! 👋
                </h2>
                <p className="text-gray-600">
                  Mari ikuti pemilihan dan tunjukkan suara Anda
                </p>
              </div>

              {/* Active Elections */}
              {activeElections.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Pemilihan Aktif 🔴
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeElections.map((election) => (
                      <Link key={election.id} href={`/elections/${election.id}`}>
                        <Card className="cursor-pointer transform hover:scale-105 transition-transform">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {election.title}
                            </h3>
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              AKTIF
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {election.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            📊 Total Suara: {election.totalVotes}
                          </p>
                          <p className="text-sm text-blue-600 font-semibold mt-2">
                            Lihat detail →
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Elections */}
              {upcomingElections.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Pemilihan Mendatang ⏳
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingElections.map((election) => (
                      <Link key={election.id} href={`/elections/${election.id}`}>
                        <Card className="cursor-pointer opacity-75">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {election.title}
                            </h3>
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              SEGERA
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {election.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            📅 Mulai: {new Date(election.startDate).toLocaleDateString('id-ID')}
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center mt-12">
                <Link
                  href="/elections"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
                >
                  Lihat Semua Pemilihan
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-8">
                Silakan login atau daftar untuk mulai voting
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Daftar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
