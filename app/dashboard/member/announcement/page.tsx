"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, Calendar, Eye, Share2, Bookmark, Newspaper } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import MemberLayout from "@/components/memberLayout"
import { ArticleModal } from "@/components/member/article-modal"

interface AnnouncementArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image?: string
  publishedAt: string
  views: number
  author: string
}

interface ApiAnnouncementArticle {
  id: number
  title: string
  description: string
  category: string
  content: string
  image_url: string | null
  status: string
  priority: string
  published_at: string | null
  created_at: string
  updated_at: string
  author: { name: string } | null
}

export default function NewsPage() {
  const [news, setNews] = useState<AnnouncementArticle[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementArticle[]>([])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<AnnouncementArticle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const transformArticle = (article: ApiAnnouncementArticle, category: string): AnnouncementArticle => {
    const apiUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:8000"
    return {
      id: `${category}-${article.id}`,
      title: article.title,
      excerpt: article.description || article.content?.substring(0, 150) + "...",
      content: article.content,
      category: article.category,
      image: article.image_url ? `${article.image_url}` : undefined,
      publishedAt: article.published_at
        ? new Date(article.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : article.created_at
          ? new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : undefined,
      views: Math.floor(Math.random() * 1000),
      author: article.author?.name || "Admin",
    }
  }
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all categories in parallel
        const [announcementsRes] = await Promise.all([fetch("/api/announcements")])

        const [announcementsData] = await Promise.all([announcementsRes.json()])

        // Extract articles from paginated data

        const transformedAnnouncements = (Array.isArray(announcementsData?.data?.data) ? announcementsData.data.data : []).map(
          (article: ApiAnnouncementArticle) => transformArticle(article, "announcements"),
        )

        setAnnouncements(transformedAnnouncements)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const allArticles = [...announcements]

  const categories = useMemo(() => {
    const catSet = new Set<string>()
    allArticles.forEach((a) => catSet.add(a.category))
    const dynamicCategories = Array.from(catSet).map((cat) => ({
      value: cat,
      label: `${cat.charAt(0).toUpperCase() + cat.slice(1)} (${allArticles.filter((a) => a.category === cat).length})`,
    }))
    return [{ value: "all", label: `All (${allArticles.length})` }, ...dynamicCategories]
  }, [allArticles])

  const filteredNews = selectedCategory === "all" ? allArticles : allArticles.filter((a) => a.category === selectedCategory)

  return (
    <MemberLayout>
      <div className="h-screen overflow-auto bg-gray-50">
        {/* Header */}
        <header className="bg-linear-to-r from-amber-600 to-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">City Announcements</h1>
                <p className="text-white/90 text-xs sm:text-sm mt-0.5">Latest announcements from Perpetual Village City</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Newspaper className="w-5 h-5" />
              <span className="font-medium">{filteredNews.length} Articles</span>
            </div>
          </div>
        </header>

        {/* Category Filter */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-[60px] sm:top-[68px] z-10 shadow-sm">
          <div className="max-w-7xl mx-auto overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category.value
                      ? "bg-linear-to-r from-amber-600 to-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading news...</p>
                </div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-linear-to-br from-emerald-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No news articles</h3>
                <p className="text-gray-600 text-center max-w-sm">Check back later for updates from the city.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredNews.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => {
                      setSelectedArticle(article)
                      setModalOpen(true)
                    }}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                  >
                    {article.image && (
                      <div className="relative aspect-video bg-linear-to-br from-emerald-100 to-orange-100 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-linear-to-r from-amber-600 to-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.publishedAt}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">{article.excerpt}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <span className="font-medium text-gray-700 truncate max-w-[120px]">By {article.author}</span>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {article.views}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              // Share functionality
                            }}
                            className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              // Bookmark functionality
                            }}
                            className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ArticleModal article={selectedArticle} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          </div>
        </main>
      </div>
    </MemberLayout>
  )
}
