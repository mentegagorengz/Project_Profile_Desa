import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SidebarNav } from '@/components/admin/SidebarNav'
import { LogOut, Leaf } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-[#f8faf7]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#14532d] flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <Leaf size={18} className="text-green-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">Manembo-nembo Tengah</div>
            <div className="text-[10px] text-green-400 font-mono">Panel Admin</div>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* User info */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="font-mono text-xs text-green-300 truncate">{user.email}</p>
          <form action="/auth/signout" method="POST" className="mt-2">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-10">
          <p className="text-muted-foreground text-sm font-mono">Panel Admin Kelurahan</p>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
