import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Use Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create chat with history
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    })

    const result = await chat.sendMessage(message)
    const response = result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      model: 'gemini-1.5-flash'
    })
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
