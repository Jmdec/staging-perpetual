"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface LegitimacyForm {
  id?: number
  alias: string
  chapter: string
  position: string
  fraternity_number: string
}

interface Props {
  mode: "add" | "edit"
  isOpen: boolean
  initialData?: LegitimacyForm
  onClose: () => void
  onSubmitSuccess: () => void
}

export default function MemberLegitimacyModal({
  mode,
  isOpen,
  initialData,
  onClose,
  onSubmitSuccess,
}: Props) {
  const [form, setForm] = useState<LegitimacyForm>({
    alias: "",
    chapter: "",
    position: "",
    fraternity_number: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData && mode === "edit") {
      setForm(initialData)
    }
  }, [initialData, mode])

  const handleSubmit = async () => {
    if (
      !form.alias ||
      !form.chapter ||
      !form.position ||
      !form.fraternity_number
    ) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const url =
        mode === "add"
          ? "/api/legitimacy"
          : `/api/legitimacy/${initialData?.id}`

      const res = await fetch(url, {
        method: mode === "add" ? "POST" : "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast({
          title: "Success",
          description:
            mode === "add"
              ? "Legitimacy request submitted."
              : "Legitimacy request updated.",
        })
        onSubmitSuccess()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit request.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Server error.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Request Certificate of Legitimacy"
              : "Edit Certificate of Legitimacy"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Alias</Label>
            <Input
              value={form.alias}
              onChange={(e) => setForm({ ...form, alias: e.target.value })}
            />
          </div>

          <div>
            <Label>Chapter</Label>
            <Input
              value={form.chapter}
              onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            />
          </div>

          <div>
            <Label>Position</Label>
            <Input
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </div>

          <div>
            <Label>Fraternity Number</Label>
            <Input
              value={form.fraternity_number}
              onChange={(e) =>
                setForm({ ...form, fraternity_number: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : mode === "add"
                ? "Submit"
                : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
