import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch briefs assigned to this user
  const { data: briefs } = await supabase
    .from('briefs')
    .select('*')
    .eq('creator_email', user.email)
    .order('due_date', { ascending: true })

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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user.email}. Here are your assigned briefs.
        </p>
      </div>

      {briefs && briefs.length > 0 ? (
        <div className="grid gap-6">
          {briefs.map((brief) => {
            const daysRemaining = getDaysRemaining(brief.due_date)
            const isOverdue = daysRemaining < 0
            
            return (
              <Card key={brief.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{brief.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <User className="h-4 w-4" />
                        {brief.client}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(brief.status)}>
                      {brief.status || 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(brief.due_date).toLocaleDateString()}
                      </div>
                      <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : daysRemaining <= 3 ? 'text-yellow-500' : ''}`}>
                        <Clock className="h-4 w-4" />
                        {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/brief/${brief.id}`}>
                        {brief.status === 'submitted' ? 'View Submission' : 'Work on Brief'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No briefs assigned</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any briefs assigned to you yet. Check back soon!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/profile">Profile Settings</Link>
        </Button>
        {user.email === 'gabe@exposure.com.au' && (
          <Button variant="outline" asChild>
            <Link href="/admin">Admin Panel</Link>
          </Button>
        )}
      </div>
    </div>
  )
}