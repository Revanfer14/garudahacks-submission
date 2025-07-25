"use client"

import type React from "react"

import { useState } from "react"
import { firestore } from "../../lib/firebase.js"
import { collection, addDoc } from "firebase/firestore"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Sparkles, Send } from "lucide-react"

export default function RequestPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requesterName, setRequesterName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const ref = collection(firestore, "requests")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await addDoc(ref, {
        title,
        description,
        requesterName,
        createdAt: new Date().toISOString(),
      })
      setSuccess(true)
      setTitle("")
      setDescription("")
      setRequesterName("")
    } catch (err) {
      setError("Gagal mengirim permintaan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 text-foreground">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <BookOpen className="h-16 w-16 text-primary" />
              <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Permintaan Dongeng</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Punya ide dongeng yang ingin diceritakan? Kirimkan permintaanmu dan kami akan membuatkan dongeng yang
            menarik untukmu!
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-soft border border-border bg-card/90 text-card-foreground">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-foreground">Ceritakan Ide Dongengmu</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Isi formulir di bawah ini dengan detail dongeng yang kamu inginkan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Requester Name */}
              <div className="space-y-2">
                <Label htmlFor="requesterName" className="text-base font-medium text-foreground">
                  Nama Kamu
                </Label>
                <Input
                  id="requesterName"
                  type="text"
                  placeholder="Siapa nama kamu?"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="text-base h-12"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium text-foreground">
                  Judul Dongeng <span className="text-red-700">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Contoh: Petualangan Si Kelinci Pemberani"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-base h-12"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
                disabled={loading || !title}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengirim...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Kirim Permintaan
                  </div>
                )}
              </Button>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                    <Sparkles className="h-5 w-5" />
                    Permintaan berhasil dikirim!
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Terima kasih! Kami akan segera memproses permintaan dongengmu.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8 text-muted-foreground">
          <p className="text-sm">
            💡 <strong>Tips:</strong> Semakin detail deskripsi yang kamu berikan, semakin menarik dongeng yang akan kami
            buat!
          </p>
        </div>
      </div>
    </div>
  )
}
