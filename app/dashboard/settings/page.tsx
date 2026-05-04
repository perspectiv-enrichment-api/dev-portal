'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTheme } from 'next-themes'
import { usersApi, type User } from '@/lib/api'
import { authStore } from '@/lib/auth-store'
import { Moon, Monitor, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        </div>
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardContent>
            <div className="h-24 animate-pulse bg-muted rounded-md" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription preferences</p>
      </div>

      {/* Account Information */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                readOnly
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
            {saveMsg && <span className="text-sm text-muted-foreground">{saveMsg}</span>}
          </div>
        </CardContent>
      </Card>

      {/* UI / Display */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>UI / Display</CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Theme
            </label>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <div>
                <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-border bg-popover p-4 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-accent [&:has([data-state=checked])]:border-accent"
                >
                  <Sun className="mb-2 h-6 w-6 text-foreground" />
                  <span className="text-sm font-medium">Light</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-border bg-popover p-4 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-accent [&:has([data-state=checked])]:border-accent"
                >
                  <Moon className="mb-2 h-6 w-6 text-foreground" />
                  <span className="text-sm font-medium">Dark</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-border bg-popover p-4 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-accent [&:has([data-state=checked])]:border-accent"
                >
                  <Monitor className="mb-2 h-6 w-6 text-foreground" />
                  <span className="text-sm font-medium">System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between p-4 bg-background border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-foreground">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
