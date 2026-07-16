import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-muted/30 p-4 space-y-2">
        <Link href="/admin" className="block font-semibold py-2 px-3 rounded hover:bg-muted">Dashboard</Link>
        <Link href="/admin/berita" className="block py-2 px-3 rounded hover:bg-muted">Berita Desa</Link>
        <Link href="/admin/produk" className="block py-2 px-3 rounded hover:bg-muted">Produk BUMDes</Link>
        <Link href="/admin/pos" className="block py-2 px-3 rounded hover:bg-muted">Kasir POS</Link>
        <Link href="/admin/laporan" className="block py-2 px-3 rounded hover:bg-muted">Laporan</Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
