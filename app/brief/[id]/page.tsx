import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, User, Link as LinkIcon, FileText, Video } from 'lucide-react'
import { BriefSubmissionForm } from './brief-submission-form'

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabaseClient()
  const { id } = await params
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch the specific brief
  const { data: brief } = await supabase
    .from('briefs')
    .select('*')
    .eq('id', id)
    .single()

  if (!brief) {
    notFound()
  }

  // Check if user is authorized to view this brief
  if (brief.creator_email !== user.email && user.email !== 'gabe@exposure.com.au') {
    redirect('/dashboard')
  }

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

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining(brief.due_date)
  const isOverdue = daysRemaining < 0

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{brief.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {brief.client}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Due: {new Date(brief.due_date).toLocaleDateString()}
              </div>
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : daysRemaining <= 3 ? 'text-yellow-500' : ''}`}>
                <Clock className="h-4 w-4" />
                {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
              </div>
            </div>
          </div>
          <Badge className={`text-lg px-4 py-2 ${getStatusColor(brief.status)}`}>
            {brief.status || 'Pending'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Script
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
              {brief.script || 'No script provided yet.'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Shot List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brief.shots && brief.shots.length > 0 ? (
              <ul className="space-y-2">
                {brief.shots.map((shot: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span>{shot}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No shot list provided yet.</p>
            )}
          </CardContent>
        </Card>

        {brief.air_link && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Air Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href={brief.air_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {brief.air_link}
              </a>
            </CardContent>
          </Card>
        )}

        {brief.mark_url && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Submitted Mark</CardTitle>
              <CardDescription>Your submitted work</CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href={brief.mark_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {brief.mark_url}
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Submitted on {new Date(brief.updated_at || brief.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {brief.status !== 'submitted' && (
        <div className="mt-8">
          <BriefSubmissionForm briefId={brief.id} />
        </div>
      )}

      <div className="mt-8">
        <Button variant="outline" asChild>
          <a href="/dashboard">Back to Dashboard</a>
        </Button>
      </div>
    </div>
  )
}