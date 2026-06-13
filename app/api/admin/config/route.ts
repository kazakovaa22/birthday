import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token')
  if (!token || !process.env.ADMIN_PASSWORD) return false
  return Buffer.from(token, 'base64').toString() === process.env.ADMIN_PASSWORD
}

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('app_config').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { key, value } = await req.json()
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('app_config')
    .upsert({ key, value, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
