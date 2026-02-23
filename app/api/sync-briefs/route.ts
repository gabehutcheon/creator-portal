import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    // For now, return a simple response
    // In production, implement actual Notion sync
    return NextResponse.json({ 
      success: true, 
      message: 'Sync endpoint ready. Notion integration would be implemented here.' 
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, briefId, status, markUrl } = body

    if (action === 'update_status') {
      // Update Supabase status
      const supabase = await createServerSupabaseClient()
      
      const { error } = await supabase
        .from('briefs')
        .update({
          status: status.toLowerCase(),
          mark_url: markUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', briefId)

      if (error) throw error

      return NextResponse.json({ 
        success: true, 
        message: 'Brief updated successfully' 
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error updating brief:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}