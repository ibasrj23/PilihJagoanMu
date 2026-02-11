import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import api from "@/lib/api";
import useAuthStore from "@/lib/store";
import { FiEdit2, FiUpload } from "react-icons/fi";

export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await api.put("/auth/profile", formData);
      setUser(response.data.user);
      setMessage("Profil berhasil diperbarui");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("photo", file);

    try {
      const response = await api.post("/auth/profile/photo", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data.user);
      setMessage("Foto profil berhasil diupload");
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal mengupload foto");
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>

          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg ${
                message.includes("berhasil")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <Card>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={
                      user.profilePhoto
                        ? user.profilePhoto.startsWith("http")
                          ? user.profilePhoto
                          : `http://localhost:5000${user.profilePhoto}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.fullName,
                          )}&background=random`
                    }
                    alt={user.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.fullName,
                      )}&background=random`;
                    }}
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <FiUpload />
                    <input
                      type="file"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Klik untuk ganti foto
                </p>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.role === "super_admin"
                        ? "Super Admin"
                        : user.role === "admin"
                          ? "Admin"
                          : "Pengguna"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.isActive ? (
                        <span className="text-green-600">✓ Aktif</span>
                      ) : (
                        <span className="text-red-600">✗ Nonaktif</span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FiEdit2 /> {isEditing ? "Batal" : "Edit Profil"}
                </button>
              </div>
            </div>
          </Card>

          {/* Edit Form */}
          {isEditing && (
            <Card className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Edit Profil
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isLoading ? "Sedang menyimpan..." : "Simpan Perubahan"}
                </button>
              </form>
            </Card>
          )}

          {/* Voting History */}
          {user.role === "user" && (
            <Card className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Riwayat Voting
              </h2>
              <p className="text-gray-600">
                Voting Anda disimpan dengan aman dan bersifat pribadi
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
