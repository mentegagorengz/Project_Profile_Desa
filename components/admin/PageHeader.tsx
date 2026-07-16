export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-teal-blue mb-1">{eyebrow}</p>
        <h1 className="font-display text-2xl font-semibold text-prussian">{title}</h1>
      </div>
      {action}
    </div>
  )
}
