import React from "react";
import { FiBell, FiX } from "react-icons/fi";

export default function NotificationCenter({
  notifications,
  onClose,
  onMarkAsRead,
}) {
  return (
    <>
      {/* Overlay: Layar transparan gelap di belakang panel notif */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Panel Notifikasi */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4 z-10">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
            <FiBell className="text-blue-600" /> Notifikasi
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* List Notifikasi */}
        <div className="flex-1 divide-y divide-gray-100">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-all ${
                  !notif.isRead
                    ? "bg-blue-50/50 border-l-4 border-blue-600"
                    : ""
                }`}
                onClick={() => onMarkAsRead(notif.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className={`text-sm font-semibold ${!notif.isRead ? "text-blue-900" : "text-gray-900"}`}
                  >
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-[10px] font-medium text-gray-400 mt-2 uppercase tracking-wider">
                  {new Date(notif.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiBell size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Tidak ada notifikasi</p>
              <p className="text-xs text-gray-400 mt-1">
                Semua pemberitahuan akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
