"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '@/components/memberLayout';
import { motion } from "framer-motion";
import AnnouncementsSection from '@/components/member-dashboard/member-announcement';
import NewsSection from '@/components/member-dashboard/member-news';
import { useAuth } from "@/hooks/useAuth"

interface JuanTapProfile {
  id: number;
  profile_url: string | null;
  qr_code: string | null;
  status: "active" | "inactive";
  subscription: "free" | "basic" | "premium";
}

interface User {
  id: number;
  name: string;
  email: string;
  juantap_profile: JuanTapProfile | null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(endpoint, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  const text = await res.text()

  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error("Invalid server response")
  }

  if (!res.ok) {
    console.error("API Error:", data)
    throw new Error(data.message || "Request failed")
  }

  return data
}


const userAPI = {
  me: () => fetchWithAuth("/api/user/me"),
};

const juantapAPI = {
  create: (data: any) =>
    fetchWithAuth("/api/juantap", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data: any) =>
    fetchWithAuth("/api/juantap", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

const BUSINESS_PARTNERS = [
  { name: "Perpetual Help System DALTA", logo: "/partners/perpetual.png" },
  { name: "Barangay Council", logo: "/partners/barangay.png" },
  { name: "Local Business Association", logo: "/partners/lba.png" },
  { name: "Community Health Center", logo: "/partners/health.png" },
  { name: "Youth Development Office", logo: "/partners/youth.png" },
  { name: "Public Safety Office", logo: "/partners/safety.png" },
];

export default function MemberDashboard() {
  const router = useRouter();
  const {user, loading: authLoading} = useAuth(true)
  const [setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    profile_url: "",
    qr_code: "",
    status: "inactive" as "active" | "inactive",
    subscription: "free" as "free" | "basic" | "premium",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await userAPI.me();
      setUser(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const hasJuanTapProfile = Boolean(user?.juantap_profile);
  const juantapProfile = user?.juantap_profile;

  const openModal = () => {
    if (juantapProfile) {
      setFormData({
        profile_url: juantapProfile.profile_url || "",
        qr_code: juantapProfile.qr_code || "",
        status: juantapProfile.status,
        subscription: juantapProfile.subscription,
      });
      setQrPreview(juantapProfile.qr_code || null);
    } else {
      setFormData({
        profile_url: "",
        qr_code: "",
        status: "inactive",
        subscription: "free",
      });
      setQrPreview(null);
    }
    setShowModal(true);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, qr_code: base64 }));
      setQrPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      hasJuanTapProfile
        ? await juantapAPI.update(formData)
        : await juantapAPI.create(formData);

      await fetchUser();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </MemberLayout>
    );
  }

  return (
    <div className="lg:py-10">
      <MemberLayout>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-orange-500 bg-clip-text text-transparent">
              Welcome, {user?.name || 'Member'}!
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Perpetual Help College Dashboard</p>
        </div>

        {/* Announcements & News Section */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <AnnouncementsSection />
          <NewsSection />
        </div>

        {/* JuanTap Profile & Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JuanTap Profile Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                JT
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800">
                  JuanTap Profile
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  Digital identity & smart profile
                </p>
              </div>
            </div>

            {hasJuanTapProfile ? (
              <>
                {/* Compact Status Display */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex-1 ${juantapProfile?.status === 'active' ? 'bg-green-50' : 'bg-orange-50'} rounded-lg p-2 text-center`}>
                    <p className={`text-xs font-semibold ${juantapProfile?.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                      {juantapProfile?.status === 'active' ? '✓ Active' : '○ Inactive'}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs font-semibold text-gray-700 capitalize">
                      {juantapProfile?.subscription}
                    </p>
                  </div>
                </div>

                {/* Compact QR & URL Display */}
                {(juantapProfile?.profile_url || juantapProfile?.qr_code) && (
                  <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
                    {juantapProfile?.qr_code && (
                      <img
                        src={juantapProfile.qr_code}
                        alt="QR Code"
                        className="w-12 h-12 border border-gray-200 rounded flex-shrink-0"
                      />
                    )}
                    {juantapProfile?.profile_url && (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Profile URL</p>
                        <a
                          href={juantapProfile.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-600 hover:underline truncate block"
                        >
                          {juantapProfile.profile_url}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={openModal}
                  className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                >
                  {(juantapProfile?.profile_url || juantapProfile?.qr_code) ? 'Update' : 'Add Details'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => window.open('https://www.juantap.info/', '_blank')}
                  className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium mb-2"
                >
                  Avail JuanTap Subscription
                </button>

                <button
                  onClick={openModal}
                  className="w-full px-3 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition text-sm font-medium"
                >
                  Add Existing Profile
                </button>
              </>
            )}
          </div>

          {/* Gallery Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Gallery
              </h2>
              <button className="text-sm text-emerald-600 hover:underline">
                View all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    Image {item}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JUANTAP MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {hasJuanTapProfile ? "Update JuanTap Profile" : "Add Existing JuanTap Profile"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {formError}
                  </div>
                )}

                {/* Profile URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JuanTap Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.profile_url}
                    onChange={(e) =>
                      setFormData({ ...formData, profile_url: e.target.value })
                    }
                    placeholder="https://juantap.info/your-profile"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* QR Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload QR Code
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    className="block w-full text-sm"
                  />

                  {qrPreview && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={qrPreview}
                        alt="QR Preview"
                        className="w-32 h-32 rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
                  >
                    {formLoading ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </MemberLayout>
    </div>
  );
}
