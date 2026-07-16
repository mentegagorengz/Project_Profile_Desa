'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah. Silakan coba lagi.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-light-silver flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-2">Portal Admin</p>
        <h1 className="font-display text-2xl font-bold text-prussian">Kelurahan Manembo-nembo Tengah</h1>
        <p className="text-prussian/60 text-sm mt-1">Masuk untuk mengelola konten kelurahan</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-xl border border-pastel-blue shadow-sm p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-prussian font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@kelurahan.id"
              className="border-pastel-blue focus:border-teal-blue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-prussian font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-pastel-blue focus:border-teal-blue"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-prussian hover:bg-prussian/90 text-white font-display"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </main>
  )
}
