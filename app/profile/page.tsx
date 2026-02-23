'use client'

import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase-client"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, CreditCard, User } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState({
    bank_name: '',
    account_name: '',
    bsb: '',
    account_number: '',
    paypal_email: '',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Try to fetch existing profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({
          bank_name: data.bank_name || '',
          account_name: data.account_name || '',
          bsb: data.bsb || '',
          account_number: data.account_number || '',
          paypal_email: data.paypal_email || '',
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your payout information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Bank Details
            </CardTitle>
            <CardDescription>
              For direct deposit payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={profile.bank_name}
                  onChange={handleChange}
                  placeholder="Commonwealth Bank"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  name="account_name"
                  value={profile.account_name}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bsb">BSB</Label>
                  <Input
                    id="bsb"
                    name="bsb"
                    value={profile.bsb}
                    onChange={handleChange}
                    placeholder="123-456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    name="account_number"
                    value={profile.account_number}
                    onChange={handleChange}
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal_email">PayPal Email (Optional)</Label>
                <Input
                  id="paypal_email"
                  name="paypal_email"
                  type="email"
                  value={profile.paypal_email}
                  onChange={handleChange}
                  placeholder="paypal@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  If you prefer PayPal payments instead of bank transfer
                </p>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">How Payments Work</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Payments are processed within 7 business days after submission approval</li>
                <li>• You'll receive an email notification when payment is sent</li>
                <li>• Bank transfers are preferred for Australian creators</li>
                <li>• International creators can use PayPal</li>
                <li>• Contact gabe@exposure.com.au for payment inquiries</li>
              </ul>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">
                Your bank details are encrypted and stored securely. We never share your financial information with third parties.
              </p>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}