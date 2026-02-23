'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from "@/lib/supabase-client"
import { Calendar, Clock, User, Mail, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Brief {
  id: string
  title: string
  client: string
  creator_email: string
  due_date: string
  status: string
  created_at: string
}

interface AdminBriefTableProps {
  briefs: Brief[]
}

export function AdminBriefTable({ briefs: initialBriefs }: AdminBriefTableProps) {
  const [briefs, setBriefs] = useState(initialBriefs)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'bg-green-500/20 text-green-700 dark:text-green-300'
      case 'in progress':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      case 'overdue':
        return 'bg-red-500/20 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    }
  }

  const handleStatusChange = async (briefId: string, newStatus: string) => {
    setUpdating(briefId)
    try {
      const { error } = await supabase
        .from('briefs')
        .update({ status: newStatus })
        .eq('id', briefId)

      if (error) throw error

      setBriefs(briefs.map(brief => 
        brief.id === briefId ? { ...brief, status: newStatus } : brief
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (briefId: string) => {
    if (!confirm('Are you sure you want to delete this brief?')) return

    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', briefId)

      if (error) throw error

      setBriefs(briefs.filter(brief => brief.id !== briefId))
    } catch (error) {
      console.error('Error deleting brief:', error)
    }
  }

  if (briefs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No briefs yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first brief using the form above
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Creator</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {briefs.map((brief) => {
            const due = new Date(brief.due_date)
            const now = new Date()
            const isOverdue = due < now && brief.status !== 'submitted'
            
            return (
              <tr key={brief.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="font-medium">{brief.title}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {brief.client}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {brief.creator_email}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {due.toLocaleDateString()}
                    {isOverdue && <Clock className="h-4 w-4 text-red-500" />}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Select
                    value={brief.status || 'pending'}
                    onValueChange={(value) => handleStatusChange(brief.id, value)}
                    disabled={updating === brief.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/brief/${brief.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(brief.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}