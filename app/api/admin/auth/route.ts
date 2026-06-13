import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(password).toString('base64')
    return NextResponse.json({ token })
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
