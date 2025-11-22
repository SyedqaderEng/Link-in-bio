import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { verifyAuth } from '@/lib/auth'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { keywords, tone, length } = body

    if (!keywords || keywords.trim().length === 0) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a professional copywriter specializing in social media bios. Generate a compelling, concise bio based on the following:

Keywords/Description: ${keywords}
Tone: ${tone || 'professional'}
Length: ${length || 'short'} (short = 1 sentence, medium = 2-3 sentences, long = 4-5 sentences)

Requirements:
- Make it engaging and memorable
- Use emojis if appropriate for the tone
- Keep it within the specified length
- Focus on value and personality
- Make it suitable for a link-in-bio page

Generate ONLY the bio text, no additional commentary.`

    const result = await model.generateContent(prompt)
    const bio = result.response.text().trim()

    return NextResponse.json({ bio })
  } catch (error: any) {
    console.error('AI bio generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate bio' },
      { status: 500 }
    )
  }
}
