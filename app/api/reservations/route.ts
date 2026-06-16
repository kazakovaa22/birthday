import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  const { gift_id, name } = await req.json()

  if (!gift_id || !name?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: gift } = await supabase
    .from('gifts')
    .select('is_reserved, reserved_by')
    .eq('id', gift_id)
    .single()

  if (!gift?.is_reserved) {
    return NextResponse.json({ error: 'Not reserved' }, { status: 409 })
  }

  if (gift.reserved_by?.toLowerCase().trim() !== name.toLowerCase().trim()) {
    return NextResponse.json({ error: 'Wrong name' }, { status: 403 })
  }

  const { error } = await supabase
    .from('gifts')
    .update({ is_reserved: false, reserved_by: null })
    .eq('id', gift_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest) {
  const { gift_id, name } = await req.json()

  if (!gift_id || !name?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: gift } = await supabase
    .from('gifts')
    .select('is_reserved')
    .eq('id', gift_id)
    .single()

  if (gift?.is_reserved) {
    return NextResponse.json({ error: 'Already reserved' }, { status: 409 })
  }

  const { error } = await supabase
    .from('gifts')
    .update({ is_reserved: true, reserved_by: name.trim() })
    .eq('id', gift_id)
    .eq('is_reserved', false)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
