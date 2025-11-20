import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateUsername } from '@/lib/utils'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const plan = requestUrl.searchParams.get('plan') || 'free'

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // Create profile if it doesn't exist
      if (!existingProfile) {
        const username = generateUsername(user.email || '')

        await supabase.from('profiles').insert({
          id: user.id,
          username,
          subscription_tier: plan,
          display_name: user.user_metadata.full_name || username,
          avatar_url: user.user_metadata.avatar_url,
        })
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
