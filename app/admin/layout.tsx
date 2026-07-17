import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SidebarNav } from '@/components/admin/SidebarNav'
import { LogOut, Leaf } from 'lucide-react'

function AdminSidebar({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-prussian">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Leaf size={20} className="text-white/80" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate leading-tight">Admin Panel</p>
          <p className="text-[11px] text-white/60 truncate leading-tight">Kelurahan MNT</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 no-scrollbar">
        <SidebarNav />
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">{initial}</span>
            </div>
            <span className="text-xs text-white/70 truncate">{email}</span>
          </div>
          <form action="/auth/signout" method="POST" className="shrink-0">
            <button
              type="submit"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-svh bg-muted">
      <AdminSidebar email={user.email!} />
      <main className="ml-60 min-h-svh p-6 pt-8">{children}</main>
    </div>
  )
}
