import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, send to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const destination = req.nextUrl.searchParams.get('to')

  if (!destination) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect to destination with Cloudflare service token cookie
  const response = NextResponse.redirect(destination)
  response.cookies.set('CF_Authorization', process.env.CF_ACCESS_CLIENT_SECRET!, {
    domain: '.keala.io',
    path: '/',
    secure: true,
    httpOnly: false,
    sameSite: 'lax',
  })

  return response
}
