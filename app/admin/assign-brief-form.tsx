'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from "@/lib/supabase-client"
import { useRouter } from 'next/navigation'

const TEST_CREATORS = [
  'test@exposure.com.au',
  'cleo@exposure.com.au',
  'chloe@exposure.com.au'
]

export function AssignBriefForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    creator_email: TEST_CREATORS[0],
    due_date: '',
    script: '',
    shots: [''],
    air_link: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Filter out empty shots
      const shots = formData.shots.filter(shot => shot.trim() !== '')

      const { error } = await supabase
        .from('briefs')
        .insert({
          ...formData,
          shots,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage('Brief created successfully!')
      setFormData({
        title: '',
        client: '',
        creator_email: TEST_CREATORS[0],
        due_date: '',
        script: '',
        shots: [''],
        air_link: '',
      })
      
      router.refresh()
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleShotChange = (index: number, value: string) => {
    const newShots = [...formData.shots]
    newShots[index] = value
    
    // Add new empty shot if this is the last one and it's being filled
    if (index === formData.shots.length - 1 && value.trim() !== '') {
      newShots.push('')
    }
    
    // Remove empty shots except the last one
    const filteredShots = newShots.filter((shot, i) => shot.trim() !== '' || i === newShots.length - 1)
    
    setFormData({
      ...formData,
      shots: filteredShots
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Video campaign for..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client *</Label>
          <Input
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="Client name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="creator_email">Assign to Creator *</Label>
          <Select
            value={formData.creator_email}
            onValueChange={(value) => setFormData({ ...formData, creator_email: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEST_CREATORS.map(email => (
                <SelectItem key={email} value={email}>{email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date *</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="script">Script</Label>
        <Textarea
          id="script"
          name="script"
          value={formData.script}
          onChange={handleChange}
          placeholder="Enter the script here..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Shot List</Label>
        <div className="space-y-2">
          {formData.shots.map((shot, index) => (
            <Input
              key={index}
              value={shot}
              onChange={(e) => handleShotChange(index, e.target.value)}
              placeholder={`Shot ${index + 1} description...`}
              className={index === formData.shots.length - 1 ? 'border-dashed' : ''}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Add shots one by one. A new field will appear as you fill each one.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="air_link">Air Link (Optional)</Label>
        <Input
          id="air_link"
          name="air_link"
          type="url"
          value={formData.air_link}
          onChange={handleChange}
          placeholder="https://air.inc/..."
        />
        <p className="text-sm text-muted-foreground">
          Link to the Air project or reference material
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Brief'}
      </Button>

      {message && (
        <div className={`p-3 rounded text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
          {message}
        </div>
      )}
    </form>
  )
}