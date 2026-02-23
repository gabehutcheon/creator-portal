import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, User, Mail, Plus } from 'lucide-react'
import { AdminBriefTable } from './admin-brief-table'
import { AssignBriefForm } from './assign-brief-form'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== 'gabe@exposure.com.au') {
    redirect('/dashboard')
  }

  // Fetch all briefs
  const { data: briefs } = await supabase
    .from('briefs')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch all users (from auth and profiles)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">
          Manage briefs and assignments
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Brief
            </CardTitle>
            <CardDescription>
              Add a new brief and assign it to a creator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssignBriefForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Briefs</CardTitle>
            <CardDescription>
              View and manage all briefs in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminBriefTable briefs={briefs || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{briefs?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Briefs</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {briefs?.filter(b => b.status === 'submitted').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Submitted</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {briefs?.filter(b => b.status === 'in progress').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {briefs?.filter(b => {
                    const due = new Date(b.due_date)
                    const now = new Date()
                    return due < now && b.status !== 'submitted'
                  }).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}