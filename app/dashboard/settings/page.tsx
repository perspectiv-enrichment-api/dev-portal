'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTheme } from 'next-themes'
import { mockDeveloper, tierLimits } from '@/lib/mock-data'
import { Check, Moon, Monitor, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const currentTierLimit = tierLimits[mockDeveloper.plan]
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and subscription preferences</p>
        </div>
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>UI / Display</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
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
                defaultValue={mockDeveloper.name}
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                defaultValue={mockDeveloper.email}
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <input
                type="text"
                defaultValue={mockDeveloper.company}
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <div className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg text-muted-foreground">
                {new Date(mockDeveloper.joinedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          <Button>Save Changes</Button>
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

      {/* Subscription Plan */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Manage your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-background/50 border border-accent/30 rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground capitalize">{mockDeveloper.plan} Plan</h3>
                <p className="text-muted-foreground mt-1">
                  {typeof currentTierLimit.cost === 'string'
                    ? currentTierLimit.cost
                    : `$${currentTierLimit.cost}/month`}
                </p>
              </div>
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Monthly Request Limit</p>
                <p className="text-3xl font-bold text-accent">
                  {(currentTierLimit.requestsPerMonth as number).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Rate Limit</p>
                <p className="text-3xl font-bold text-accent">
                  {(currentTierLimit.rateLimit as number).toLocaleString()} req/s
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex gap-2 text-sm text-foreground">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>API Key Management</span>
              </li>
              <li className="flex gap-2 text-sm text-foreground">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex gap-2 text-sm text-foreground">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Real-time Monitoring</span>
              </li>
              <li className="flex gap-2 text-sm text-foreground">
                <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>24/7 Priority Support</span>
              </li>
            </ul>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Upgrade Plan</Button>
              <Button variant="outline">View Billing History</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Payment method and invoice settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Payment Method</h4>
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
              <Button variant="ghost">Update</Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Billing Email</h4>
            <input
              type="email"
              defaultValue="billing@company.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Recent Invoices</h4>
            <div className="space-y-2">
              {[
                { date: 'Mar 1, 2024', amount: '$99.00' },
                { date: 'Feb 1, 2024', amount: '$99.00' },
                { date: 'Jan 1, 2024', amount: '$99.00' },
              ].map((invoice) => (
                <div key={invoice.date} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                  <span className="text-foreground">{invoice.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground">{invoice.amount}</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Password</h4>
            <Button variant="outline">Change Password</Button>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Active Sessions</h4>
            <div className="space-y-2">
              {[
                { browser: 'Chrome on macOS', ip: '192.168.1.1', last: 'Just now' },
                { browser: 'Safari on iPhone', ip: '192.168.1.2', last: '2 hours ago' },
              ].map((session) => (
                <div key={session.ip} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{session.browser}</p>
                    <p className="text-sm text-muted-foreground">{session.ip}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{session.last}</p>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-background border border-border rounded-lg">
              <div>
                <h4 className="font-semibold text-foreground">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
