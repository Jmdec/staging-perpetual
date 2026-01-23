"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Vlog {
  id?: number
  title: string
  category: string
  description?: string
  content: string
  date: string
  is_active: boolean
  video?: File | string
  poster?: File | string
}

interface Props {
  isOpen: boolean
  mode: "create" | "edit"
  initialData?: Vlog
  onClose: () => void
  onSubmitSuccess: () => void
}

const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB

export default function AdminVlogsModal({ isOpen, mode, initialData, onClose, onSubmitSuccess }: Props) {
  const { toast } = useToast()

  const defaultForm: Vlog = {
    title: "",
    category: "",
    description: "",
    content: "",
    date: "",
    is_active: true,
  }

  const [form, setForm] = useState<Vlog>(defaultForm)
  const [video, setVideo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [poster, setPoster] = useState<File | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setForm({
          ...initialData,
          is_active: initialData.is_active === "1" || initialData.is_active === true,
        })
      } else {
        setForm(defaultForm)
      }
      setVideo(null)
      setProgress(0)
    }
  }, [isOpen, mode, initialData])

  if (!isOpen) return null

  // Chunked upload function
  const uploadChunks = async (file: File, form: Vlog, mode: "create" | "edit", id?: number) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const blobChunk = file.slice(start, end)

      const formData = new FormData()
      formData.append("chunk", blobChunk, file.name)
      formData.append("chunk_index", String(chunkIndex))
      formData.append("total_chunks", String(totalChunks))
      formData.append("filename", file.name)

      // Only include metadata on first chunk
      if (chunkIndex === 0) {
        formData.append("title", form.title)
        formData.append("category", form.category)
        formData.append("date", form.date)
        formData.append("content", form.content)
        formData.append("is_active", form.is_active ? "1" : "0")
        if (form.description) formData.append("description", form.description)
        if (poster) {
          formData.append("poster", poster)
        }
      }

      const url = mode === "create" ? `/api/admin/vlogs` : `/api/admin/vlogs/${id}`
      const method = mode === "create" ? "POST" : "PUT"

      const xsrfCookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("XSRF-TOKEN="))
        ?.split("=")[1]

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfCookie ? decodeURIComponent(xsrfCookie) : "",
        },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Upload failed")
      }

      setProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100))
    }
  }

  const updateMetadataOnly = async (form: Vlog, id: number) => {
    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("category", form.category)
    formData.append("date", form.date)
    formData.append("content", form.content)
    formData.append("is_active", form.is_active ? "1" : "0")
    if (form.description) formData.append("description", form.description)
    if (poster) {
      formData.append("poster", poster)
    }
    const xsrfCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("XSRF-TOKEN="))
      ?.split("=")[1]

    const res = await fetch(`/api/admin/vlogs/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrfCookie ? decodeURIComponent(xsrfCookie) : "",
      },
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Update failed")
    }
  }

  // Handle Submit
  const handleSubmit = async () => {
    if (mode === "create" && !video) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No video selected",
      })
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      if (mode === "create") {
        await uploadChunks(video as File, form, "create")
      } else if (mode === "edit" && initialData?.id) {
        if (video) {
          await uploadChunks(video, form, "edit", initialData.id)
        } else {
          await updateMetadataOnly(form, initialData.id)
        }
      }

      toast({
        title: "Success",
        description: `Vlog ${mode === "create" ? "created" : "updated"} successfully`,
      })

      onSubmitSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Save failed",
        description: err.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const getVideoUrl = (videoUrl?: string) => {
    if (!videoUrl) return ""
    if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
      return videoUrl
    }
    if (videoUrl.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_IMAGE_URL}${videoUrl}`
    }
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${videoUrl}`
  }
  console.log("Initial video:", initialData)
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-white rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl 
                  p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]"
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X />
        </button>

        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">{mode === "create" ? "Add Vlog" : "Edit Vlog"}</h2>

        {/* Form fields */}
        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            placeholder="Content (required)"
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          {/* Poster upload */}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setPoster(e.target.files?.[0] || null)}
            className="text-sm sm:text-base"
          />
          {mode === "edit" && initialData?.poster && !poster && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Current poster:</p>
              <img src={getVideoUrl(initialData.poster)} alt="Poster" className="w-full max-h-48 rounded-lg border object-cover" />
            </div>
          )}

          {/* Video upload */}
          <input
            type="file"
            accept="video/mp4,video/mov,video/avi,video/webm"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="text-sm sm:text-base"
          />
          {mode === "edit" && initialData?.video && !video && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Current video:</p>
              <video src={getVideoUrl(initialData.video)} controls className="w-full max-h-64 rounded-lg border" />
            </div>
          )}

          {/* Status */}
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
            value={form.is_active ? "1" : "0"}
            onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm sm:text-base">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm sm:text-base hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? `Saving... ${progress}%` : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
