"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Edit, Image as ImageIcon, X, Upload } from "lucide-react"
import Image from "next/image"
import AdminLayout from "@/components/adminLayout"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"

interface Gallery {
  id: number
  title: string
  description?: string
  image_url: string
  created_at: string
}

export default function AdminGalleryPage() {
  const { user, loading: authLoading } = useAuth(true)
  const { toast } = useToast()

  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  /* ---------------- FETCH ---------------- */
  const fetchGalleries = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/galleries", { credentials: "include" })
      const data = await res.json()
      setGalleries(data.data ?? data)
    } catch {
      toast({ variant: "destructive", title: "Failed to load gallery" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) fetchGalleries()
  }, [authLoading, user])

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 12 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Max 12MB",
      })
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  /* ---------------- MODAL ---------------- */
  const openCreate = () => {
    setMode("create")
    setEditingId(null)
    setTitle("")
    setDescription("")
    setImage(null)
    setPreview("")
    setIsModalOpen(true)
  }

  const openEdit = (g: Gallery) => {
    setMode("edit")
    setEditingId(g.id)
    setTitle(g.title)
    setDescription(g.description ?? "")
    setPreview(g.image_url)
    setImage(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!title || (!image && mode === "create")) {
      toast({ variant: "destructive", title: "Title & image required" })
      return
    }

    const form = new FormData()
    form.append("title", title)
    form.append("description", description)
    if (image) form.append("image", image)

    const url = mode === "edit" ? `/api/admin/galleries/${editingId}` : "/api/admin/galleries"

    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      body: form,
    })

    if (res.ok) {
      toast({ title: "Gallery saved" })
      closeModal()
      fetchGalleries()
    } else {
      toast({ variant: "destructive", title: "Failed to save" })
    }
  }

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return

    const res = await fetch(`/api/admin/galleries/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (res.ok) {
      toast({ title: "Gallery deleted" })
      fetchGalleries()
    }
  }

  

  if (authLoading) return null

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gallery</h1>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : galleries.length === 0 ? (
          <p>No images yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleries.map((g) => (
              <div key={g.id} className="border rounded-lg overflow-hidden">
                <div className="relative h-40">
                  <Image src={g.image_url} alt={g.title} fill className="object-cover" unoptimized />
                </div>
                <div className="p-3 space-y-2">
                  <p className="font-medium truncate">{g.title}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(g)}>
                      <Edit className="w-4 h-4 text-orange-600" />
                    </button>
                    <button onClick={() => handleDelete(g.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{mode === "create" ? "Add Image" : "Edit Image"}</h2>
                <button onClick={closeModal}>
                  <X />
                </button>
              </div>

              <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {preview ? (
                <div className="relative h-48">
                  <Image src={preview} alt="" fill className="object-cover" />
                </div>
              ) : (
                <label className="border-dashed border-2 p-6 flex flex-col items-center cursor-pointer">
                  <Upload />
                  <span>Upload image</span>
                  <input type="file" hidden onChange={handleImageChange} />
                </label>
              )}

              <button onClick={handleSubmit} className="w-full py-2 bg-orange-600 text-white rounded-lg">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
