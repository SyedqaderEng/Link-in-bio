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
    const { url, description, count } = body

    if (!url && !description) {
      return NextResponse.json(
        { error: 'URL or description is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a marketing expert creating compelling call-to-action link titles.

${url ? `URL: ${url}` : ''}
${description ? `Description: ${description}` : ''}

Generate ${count || 3} different link titles that:
- Are catchy and action-oriented
- Include relevant emojis
- Are 3-6 words each
- Create urgency or excitement
- Would make people want to click

Format your response as a JSON array of objects with "title" and "description" fields.
Example: [{"title": "🚀 Get Started Now", "description": "Begin your journey today"}, ...]

Provide ONLY the JSON array, no additional text.`

    const result = await model.generateContent(prompt)
    let responseText = result.response.text().trim()

    // Clean up markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    try {
      const suggestions = JSON.parse(responseText)
      return NextResponse.json({ suggestions })
    } catch (parseError) {
      // If JSON parsing fails, return a simple format
      return NextResponse.json({
        suggestions: [
          { title: '✨ Click Here', description: 'Discover something amazing' },
          { title: '🔥 Check This Out', description: 'You won\'t want to miss this' },
          { title: '🎯 Learn More', description: 'Get all the details' },
        ],
      })
    }
  } catch (error: any) {
    console.error('AI link generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate link suggestions' },
      { status: 500 }
    )
  }
}
