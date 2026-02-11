import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import CandidateCard from '@/components/CandidateCard';
import VoteChart from '@/components/VoteChart';
import api from '@/lib/api';
import useAuthStore from '@/lib/store';
import { getSocket, joinElection, onVoteUpdate } from '@/lib/socket';

export default function ElectionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthStore();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [userVoteInfo, setUserVoteInfo] = useState({ hasVoted: false });

  useEffect(() => {
    if (id) {
      fetchElectionData();
    }
  }, [id]);

  useEffect(() => {
    if (id && user) {
      const socket = getSocket();
      if (socket) {
        joinElection(id);
        onVoteUpdate((data) => {
          if (data.electionId === id) {
            fetchStats();
          }
        });
      }
    }
  }, [id, user]);

  const fetchElectionData = async () => {
    try {
      const [electionRes, candidatesRes, statsRes, voteCheckRes] = await Promise.all([
        api.get(`/elections/${id}`),
        api.get('/candidates', { params: { electionId: id } }),
        api.get(`/elections/${id}/stats`),
        user ? api.get('/votes/has-voted', { params: { electionId: id } }) : null,
      ]);

      setElection(electionRes.data);
      setCandidates(candidatesRes.data);
      setStats(statsRes.data);
      if (voteCheckRes) {
        setUserVoteInfo(voteCheckRes.data);
      }
    } catch (error) {
      console.error('Error fetching election:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get(`/elections/${id}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleVote = useCallback(async (candidateId) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setVotingId(candidateId);

    try {
      await api.post('/votes/', { electionId: id, candidateId });
      setUserVoteInfo({ hasVoted: true });
      await fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal melakukan voting');
    } finally {
      setVotingId(null);
    }
  }, [id, user, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  if (!election) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">Pemilihan tidak ditemukan</p>
        </div>
      </>
    );
  }

  const chartData = candidates.map((c) => ({
    name: c.name,
    voteCount: c.voteCount,
    percentage: stats && stats.totalVotes > 0
      ? ((c.voteCount / stats.totalVotes) * 100).toFixed(2)
      : 0,
  }));

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">{election.title}</h1>
            <p className="text-blue-100">{election.description}</p>
            <div className="mt-4 flex gap-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                election.status === 'active'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}>
                {election.status === 'active' ? 'AKTIF' : 'SEGERA'}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-700 text-sm font-semibold">
                Tipe: {election.type}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Left Side - Stats */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📊 Statistik
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Suara</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.totalVotes || 0}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Total Peserta</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.totalParticipants || 0}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Total Kandidat</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {candidates.length}
                    </p>
                  </div>
                </div>
              </Card>

              {user && (
                <Card className={userVoteInfo.hasVoted ? 'bg-green-50' : 'bg-blue-50'}>
                  <p className={`text-sm font-semibold ${
                    userVoteInfo.hasVoted
                      ? 'text-green-700'
                      : 'text-blue-700'
                  }`}>
                    {userVoteInfo.hasVoted
                      ? '✓ Anda sudah melakukan voting'
                      : '⚠️ Anda belum melakukan voting'}
                  </p>
                </Card>
              )}
            </div>

            {/* Right Side - Chart */}
            <div className="lg:col-span-2">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📈 Grafik Suara
                </h3>
                <VoteChart data={chartData} type="bar" />
              </Card>
            </div>
          </div>

          {/* Candidates Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🏆 Kandidat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={{
                    ...candidate,
                    percentage: stats && stats.totalVotes > 0
                      ? ((candidate.voteCount / stats.totalVotes) * 100).toFixed(2)
                      : 0,
                  }}
                  onVote={() => handleVote(candidate.id)}
                  hasVoted={userVoteInfo.hasVoted}
                  isLoading={votingId === candidate.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
