import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { userId, linkId, eventType, referrer, country, city, device, browser } = await request.json()

    if (!userId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['view', 'click', 'share'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const { error } = await supabase.from('analytics').insert({
      user_id: userId,
      link_id: linkId || null,
      event_type: eventType,
      referrer,
      country,
      city,
      device,
      browser,
    })

    if (error) throw error

    // If it's a click event, increment the link click count
    if (eventType === 'click' && linkId) {
      await supabase.rpc('increment_link_clicks', { link_uuid: linkId })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
