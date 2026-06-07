'use client'

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'
import { usersApi, type User } from '@/lib/api'
import { authStore } from '@/lib/auth-store'
import { Moon, Monitor, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

function Section({
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    setMounted(true)
    const stored = authStore.getUser()
    if (stored) {
      setUser(stored)
      setName(stored.name)
    } else {
      authStore.token()
        .then((token) => usersApi.me(token))
        .then(({ user: u }) => {
          setUser(u)
          setName(u.name)
          authStore.save({ accessToken: authStore.getAccessToken()!, refreshToken: '' }, u)
        })
        .catch(() => router.push('/auth/login'))
    }
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const token = await authStore.token()
      const { user: updated } = await usersApi.update(token, { name })
      setUser(updated)
      authStore.save({ accessToken: authStore.getAccessToken()!, refreshToken: '' }, updated)
      setSaveMsg('Saved!')
    } catch {
      setSaveMsg('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return
    try {
      const token = await authStore.token()
      await usersApi.delete(token)
      authStore.clear()
      router.push('/auth/register')
    } catch {
      alert('Failed to delete account')
    }
  }

  if (!mounted || !user) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Full name */}
      <Section label="Full name">
        <div className="w-full max-w-xl">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-neutral-300 text-neutral-900"
          />
        </div>
      </Section>

      {/* Email */}
      <Section label="Email" description="Your login email address">
        <div className="w-full max-w-xl">
          <input
            type="email"
            defaultValue={user.email}
            readOnly
            className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-lg bg-white text-neutral-500 outline-none"
          />
        </div>
      </Section>

      {/* Save */}
      <Section label="Save changes">
        <div className="flex items-center gap-3">
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          {saveMsg && <span className="text-sm text-neutral-500">{saveMsg}</span>}
        </div>
      </Section>

      {/* Theme */}
      <Section label="Theme" description="Customize how the application looks">
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value)}
          className="grid grid-cols-3 gap-3 max-w-xl"
        >
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <div key={value}>
              <RadioGroupItem value={value} id={`theme-${value}`} className="peer sr-only" />
              <Label
                htmlFor={`theme-${value}`}
                className={cn(
                  'flex flex-col items-center justify-between rounded-lg border-2 border-neutral-200 bg-white p-4 cursor-pointer hover:bg-neutral-50',
                  'peer-data-[state=checked]:border-neutral-900 [&:has([data-state=checked])]:border-neutral-900',
                )}
              >
                <Icon className="mb-2 h-5 w-5 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-900">{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Section>

      {/* Danger zone */}
      <Section label="Delete account" description="Once deleted, there is no going back.">
        <div className="flex items-center justify-between border border-neutral-200 rounded-lg bg-white px-4 py-3 max-w-xl">
          <p className="text-sm text-neutral-500">Permanently remove your account and all data.</p>
          <Button variant="destructive" onClick={handleDelete}>Delete account</Button>
        </div>
      </Section>
    </div>
  )
}
