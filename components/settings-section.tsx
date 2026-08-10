export function SettingsSection({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-8 px-8 py-8 border-b-2 border-neutral-100 mx-8 last:border-b-0">
      <div className="w-56 shrink-0">
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        {description && (
          <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
