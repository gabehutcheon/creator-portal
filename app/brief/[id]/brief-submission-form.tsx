'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from "@/lib/supabase-client"
import { useRouter } from 'next/navigation'

export function BriefSubmissionForm({ briefId }: { briefId: string }) {
  const [markUrl, setMarkUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Update the brief in Supabase
      const { error: supabaseError } = await supabase
        .from('briefs')
        .update({
          mark_url: markUrl,
          status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefId)

      if (supabaseError) {
        throw supabaseError
      }

      // Call the Notion sync API to update Notion
      const response = await fetch('/api/sync-briefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_status',
          briefId,
          status: 'Submitted',
          markUrl
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update Notion')
      }

      setMessage('Submission successful! Notion has been updated.')
      router.refresh()
      
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Work</CardTitle>
        <CardDescription>
          Upload your final mark and submit for review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="markUrl" className="text-sm font-medium">
              Mark URL
            </label>
            <Input
              id="markUrl"
              type="url"
              placeholder="https://drive.google.com/... or https://vimeo.com/..."
              value={markUrl}
              onChange={(e) => setMarkUrl(e.target.value)}
              required
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Provide a link to your final work (Google Drive, Vimeo, YouTube, etc.)
            </p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded text-sm ${message.includes('successful') ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}