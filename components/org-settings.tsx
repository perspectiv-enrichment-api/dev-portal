'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SettingsSection } from '@/components/settings-section'
import { orgsApi, type Org, type OrgMember, type User } from '@/lib/api'
import { authStore, dicebearUrl } from '@/lib/auth-store'

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Org profile and membership. The member list comes from `GET /orgs/:id` —
 * there is no dedicated members endpoint, only add and remove.
 */
export function OrgSettings({ user }: { user: User }) {
  const [org, setOrg] = useState<Org | null>(null)
  const [members, setMembers] = useState<OrgMember[]>([])
  const [loading, setLoading] = useState(!!user.org_id)
  const [loadError, setLoadError] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [saving, setSaving] = useState(false)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [removing, setRemoving] = useState<OrgMember | null>(null)

  const [creating, setCreating] = useState(false)

  const hydrate = useCallback((next: Org) => {
    setOrg(next)
    setName(next.name ?? '')
    setSlug(next.slug ?? '')
    setWebsiteUrl(next.website_url ?? '')
    setCompanySize(next.company_size ?? '')
  }, [])

  const load = useCallback(async () => {
    if (!user.org_id) return
    setLoading(true)
    setLoadError('')
    try {
      const token = await authStore.token()
      const res = await orgsApi.get(token, user.org_id)
      hydrate(res.org)
      setMembers(res.members)
    } catch (err: unknown) {
      setLoadError(
        err instanceof Error ? err.message : 'Failed to load organization',
      )
    } finally {
      setLoading(false)
    }
  }, [user.org_id, hydrate])

  useEffect(() => {
    load()
  }, [load])

  const handleCreate = async () => {
    if (!name.trim() || creating) return
    setCreating(true)
    try {
      const token = await authStore.token()
      const created = await orgsApi.create(token, {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
      })
      hydrate(created)
      toast.success('Organization created')
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create organization',
      )
    } finally {
      setCreating(false)
    }
  }

  const handleSave = async () => {
    if (!org || saving) return
    setSaving(true)
    try {
      const token = await authStore.token()
      const updated = await orgsApi.update(token, org.id, {
        name: name.trim(),
        slug: slug.trim(),
        ...(websiteUrl.trim() ? { website_url: websiteUrl.trim() } : {}),
        ...(companySize ? { company_size: companySize } : {}),
      })
      hydrate(updated)
      toast.success('Organization saved')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleInvite = async () => {
    if (!org || !inviteEmail.trim() || inviting) return
    setInviting(true)
    try {
      const token = await authStore.token()
      const member = await orgsApi.addMember(token, org.id, {
        email: inviteEmail.trim(),
      })
      // The endpoint's response body isn't guaranteed to include the new
      // member, so refetch when it doesn't.
      if (member) setMembers((ms) => [...ms, member])
      else await load()
      setInviteEmail('')
      toast.success(`Invited ${inviteEmail.trim()}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  const handleRemove = async () => {
    if (!org || !removing) return
    try {
      const token = await authStore.token()
      await orgsApi.removeMember(token, org.id, removing.id)
      setMembers((ms) => ms.filter((m) => m.id !== removing.id))
      toast.success(`Removed ${removing.email}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setRemoving(null)
    }
  }

  // No org yet — offer to create one rather than showing empty fields.
  if (!user.org_id && !org) {
    return (
      <SettingsSection
        label="Organization"
        description="Create an organization to share projects and API keys with your team."
      >
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Name</label>
            <Input
              placeholder="e.g. Acme Ltd"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Slug</label>
            <Input
              placeholder={slugify(name) || 'acme-ltd'}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 text-white self-start"
            onClick={handleCreate}
            disabled={creating || !name.trim()}
          >
            {creating ? 'Creating…' : 'Create organization'}
          </Button>
        </div>
      </SettingsSection>
    )
  }

  if (loading) {
    return (
      <SettingsSection label="Organization">
        <p className="text-sm text-neutral-400">Loading…</p>
      </SettingsSection>
    )
  }

  if (loadError) {
    return (
      <SettingsSection label="Organization">
        <p className="text-sm text-destructive">{loadError}</p>
      </SettingsSection>
    )
  }

  return (
    <>
      <SettingsSection
        label="Organization"
        description="Details shared across your team."
      >
        <div className="grid grid-cols-2 gap-4 max-w-xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">
              Website
            </label>
            <Input
              placeholder="https://acme.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">
              Company size
            </label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size} employees
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Button
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
              onClick={handleSave}
              disabled={saving || !name.trim()}
            >
              {saving ? 'Saving…' : 'Save organization'}
            </Button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        label="Team"
        description="People with access to this organization."
      >
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="colleague@acme.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleInvite()
                }
              }}
            />
            <Button
              className="bg-neutral-900 hover:bg-neutral-800 text-white shrink-0"
              onClick={handleInvite}
              disabled={inviting || !inviteEmail.trim()}
            >
              {inviting ? 'Inviting…' : 'Invite'}
            </Button>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-neutral-400 border border-dashed border-neutral-200 rounded-lg py-8 text-center">
              No other members yet.
            </p>
          ) : (
            <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="w-8 h-8 rounded-full border border-neutral-200 bg-neutral-100 overflow-hidden shrink-0">
                    <Image
                      src={dicebearUrl(member.email)}
                      alt={member.name || member.email}
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {member.name || member.email}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {member.email}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 capitalize shrink-0">
                    {member.role}
                  </span>
                  {member.id !== user.id && (
                    <button
                      type="button"
                      onClick={() => setRemoving(member)}
                      className="text-neutral-400 hover:text-destructive p-1.5 shrink-0"
                      aria-label={`Remove ${member.email}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SettingsSection>

      <AlertDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              {removing?.email} will lose access to this organization&apos;s
              projects and API keys.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
