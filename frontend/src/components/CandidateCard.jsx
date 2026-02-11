import React from 'react';
import Card from './Card';

export default function CandidateCard({ candidate, onVote, hasVoted, isLoading }) {
  return (
    <Card className="text-center">
      {candidate.photo && (
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-blue-100"
        />
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
      <p className="text-sm text-blue-600 font-semibold mb-2">{candidate.position}</p>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{candidate.description}</p>

      {candidate.vissionMission && (
        <div className="mb-4 max-h-24 overflow-y-auto bg-blue-50 p-3 rounded text-sm text-gray-700">
          <strong>Visi & Misi:</strong>
          <p>{candidate.vissionMission}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{candidate.voteCount || 0}</p>
          <p className="text-xs text-gray-600">Suara</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">
            {candidate.percentage || '0.00'}%
          </p>
          <p className="text-xs text-gray-600">Persentase</p>
        </div>
      </div>

      <button
        onClick={onVote}
        disabled={hasVoted || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
          hasVoted
            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
            : isLoading
            ? 'bg-blue-400 text-white cursor-wait'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }`}
      >
        {isLoading ? 'Sedang memproses...' : hasVoted ? 'Sudah Dipilih' : 'Pilih'}
      </button>
    </Card>
  );
}
