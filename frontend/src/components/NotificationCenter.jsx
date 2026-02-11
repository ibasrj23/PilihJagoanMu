import React from 'react';
import { FiBell, FiX } from 'react-icons/fi';

export default function NotificationCenter({ notifications, onClose, onMarkAsRead }) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FiBell /> Notifikasi
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FiX size={24} />
        </button>
      </div>

      <div className="divide-y">
        {notifications && notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notif.isRead ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
              onClick={() => onMarkAsRead(notif.id)}
            >
              <h3 className="font-semibold text-gray-900">{notif.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notif.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Tidak ada notifikasi
          </div>
        )}
      </div>
    </div>
  );
}
