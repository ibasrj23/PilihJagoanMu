import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-card hover:shadow-hover transition-shadow p-6 ${className}`}
    >
      {children}
    </div>
  );
}
