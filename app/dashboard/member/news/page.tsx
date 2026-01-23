"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Calendar, Eye, Share2, Bookmark, Newspaper } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import MemberLayout from "@/components/memberLayout"
import { ArticleModal } from "@/components/member/article-modal"

/* ================= TYPES ================= */

interface NewsArticle {
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

interface ApiNewsArticle {
  id: number
  title: string
  description?: string
  content: string
  image_url?: string | null
  published_at?: string | null
  created_at: string
}

/* ================= HELPERS ================= */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const normalizeApiList = (res: any): ApiNewsArticle[] =>
  res?.data?.data ?? res?.data ?? res ?? []

const getImageUrl = (path?: string | null) => {
  if (!path) return undefined
  if (path.startsWith("http")) return path
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`
}

const transformArticle = (article: ApiNewsArticle): NewsArticle => ({
  id: `news-${article.id}`,
  title: article.title,
  excerpt: article.description || article.content.slice(0, 150) + "...",
  content: article.content,
  category: "news",
  image: getImageUrl(article.image_url),
  publishedAt: new Date(
    article.published_at || article.created_at
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  views: Math.floor(Math.random() * 1000),
  author: "Admin",
})

/* ================= COMPONENT ================= */

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/news/published?per_page=50")
        const json = await res.json()

        setNews(normalizeApiList(json).map(transformArticle))
      } catch (err) {
        console.error("Error fetching news:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  /* ================= RENDER ================= */

  return (
    <MemberLayout>
      <div className="h-screen overflow-auto bg-gray-50">
        {/* HEADER */}
        <header className="bg-linear-to-r from-orange-600 to-orange-500 text-white px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:bg-white/10 p-1 rounded-lg">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">
                  Perpetual Help College News
                </h1>
                <p className="text-white/90 text-sm">
                  Latest updates from Perpetual Help College
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Newspaper className="w-5 h-5" />
              <span className="font-medium">{news.length} Articles</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">Loading news…</div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No news articles available
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map(article => (
                <div
                  key={article.id}
                  onClick={() => {
                    setSelectedArticle(article)
                    setModalOpen(true)
                  }}
                  className="group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-lg cursor-pointer"
                >
                  {article.image && (
                    <div className="relative aspect-video">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {article.publishedAt}
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                      <span>By {article.author}</span>
                      <div className="flex gap-3">
                        <Eye className="w-4 h-4" />
                        <Share2 className="w-4 h-4" />
                        <Bookmark className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ArticleModal
            article={selectedArticle}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </main>
      </div>
    </MemberLayout>
  )
}
