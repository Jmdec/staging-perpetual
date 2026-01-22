"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    Calendar,
    Loader2,
    X,
    AlertTriangle,
    Sparkles,
    ChevronRight,
} from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    date: string;
    category: "Update" | "Event" | "Alert" | "Development" | "Notice" | "Health";
    description: string;
    content: string;
    is_active: boolean;
    priority: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export default function AnnouncementSection() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] =
        useState<Announcement | null>(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching announcements...");

            const response = await fetch(`/api/announcements?per_page=6`);

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({ message: "Failed to fetch announcements" }));
                console.error("API error:", errorData);
                throw new Error(errorData.message || "Failed to load announcements");
            }

            const data = await response.json();
            console.log("API response:", data);

            if (data.success && data.data) {
                const announcementsArray = data.data.data || data.data || [];
                console.log("Announcements:", announcementsArray);
                setAnnouncements(announcementsArray);
            } else {
                throw new Error(data.message || "Failed to load announcements");
            }
        } catch (err) {
            console.error("Error fetching announcements:", err);
            const errorMessage =
                err instanceof Error ? err.message : "Failed to load announcements";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (!email || !email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }

        setSubscribing(true);

        try {
            const subscribeResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const subscribeData = await subscribeResponse.json();

            if (!subscribeData.success) {
                alert(
                    subscribeData.message || "Failed to subscribe. Please try again.",
                );
                setSubscribing(false);
                return;
            }

            const emailResponse = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: email,
                    type: "verification",
                    data: {
                        email: email,
                        verifyUrl: `${window.location.origin}/verify-subscription?token=${subscribeData.data.token}`,
                    },
                }),
            });

            const emailData = await emailResponse.json();

            if (emailData.success) {
                setEmail("");
                alert(
                    "Successfully subscribed! Please check your email to verify your subscription.",
                );
            } else {
                alert(
                    "Subscribed, but failed to send verification email. Please contact support.",
                );
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Failed to subscribe. Please try again later.");
        } finally {
            setSubscribing(false);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            Alert: "from-red-500 to-red-600",
            Event: "from-orange-500 to-orange-600",
            Update: "from-green-500 to-green-600",
            Development: "from-pink-500 to-pink-600",
            Health: "from-emerald-500 to-emerald-600",
            Notice: "from-blue-500 to-blue-600",
        };
        return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600";
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            Alert: "⚠️",
            Event: "📅",
            Update: "🔄",
            Development: "🚀",
            Health: "❤️",
            Notice: "📢",
        };
        return icons[category as keyof typeof icons] || "📌";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            {/* Announcement Section */}
            <section className="bg-gradient-to-br from-gray-50 to-gray-100 border rounded-xl border-gray-200 shadow-xl p-6 col-span-1">
                <div>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-red-600 via-orange-600 to-green-600 rounded-full mb-3 shadow-lg"
                        >
                            <Bell className="w-7 h-7 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Announcements
                        </h2>
                        <p className="text-gray-600">
                            Stay updated with the latest news and events
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="w-12 h-12 border-4 border-transparent border-t-orange-600 rounded-full mx-auto mb-4"
                                />
                                <p className="text-gray-700 font-medium">
                                    Loading announcements...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 bg-white rounded-xl shadow-lg"
                        >
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Unable to Load Announcements
                            </h3>
                            <p className="text-red-600 mb-6">{error}</p>
                            <button
                                onClick={fetchAnnouncements}
                                className="px-6 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-green-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {/* Announcements List */}
                    {!loading && !error && announcements.length > 0 && (
                        <>
                            <div className="space-y-3 mb-8">
                                {announcements.map((announcement, i) => (
                                    <motion.div
                                        key={announcement.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.01, x: 4 }}
                                        onClick={() => setSelectedAnnouncement(announcement)}
                                        className="group bg-white rounded-lg p-5 shadow hover:shadow-xl transition-all cursor-pointer border border-gray-200 hover:border-orange-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Category Icon */}
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(announcement.category)} flex items-center justify-center text-xl shadow-md`}>
                                                {getCategoryIcon(announcement.category)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(announcement.category)}`}>
                                                        {announcement.category}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(announcement.date)}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                                                    {announcement.title}
                                                </h3>

                                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                                    {announcement.description}
                                                </p>

                                                <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                                                    <span>Read More</span>
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        
                        </>
                    )}

                    {/* Empty State */}
                    {!loading && !error && announcements.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-xl shadow-lg"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <Bell className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                No Announcements Yet
                            </h3>
                            <p className="text-gray-600">
                                Check back later for updates
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Modal */}
                {selectedAnnouncement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedAnnouncement(null)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(selectedAnnouncement.category)} flex items-center justify-center text-lg shadow`}>
                                        {getCategoryIcon(selectedAnnouncement.category)}
                                    </div>
                                    <div>
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(selectedAnnouncement.category)} mb-1`}>
                                            {selectedAnnouncement.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(selectedAnnouncement.date)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAnnouncement(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {selectedAnnouncement.title}
                                </h2>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedAnnouncement.content || selectedAnnouncement.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </section>
        </>
    );
}