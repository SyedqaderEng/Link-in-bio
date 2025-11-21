'use client'

import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Send, Sparkles, Bot, User as UserIcon, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-vibrant flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold gradient-text">AI Assistant</h1>
              <p className="text-sm text-gray-400">Powered by Gemini 1.5 Flash</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-vibrant flex items-center justify-center mb-6">
                <Bot className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
              <p className="text-gray-400 max-w-md">
                Ask me anything! I can help with code, answer questions, or have a conversation.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-3xl">
                <button
                  onClick={() => setInput('Explain how React hooks work')}
                  className="glass p-4 rounded-xl hover:bg-white/10 transition text-left"
                >
                  <div className="text-sm font-semibold mb-1">💡 Explain Concepts</div>
                  <div className="text-xs text-gray-400">How React hooks work</div>
                </button>
                <button
                  onClick={() => setInput('Write a function to sort an array')}
                  className="glass p-4 rounded-xl hover:bg-white/10 transition text-left"
                >
                  <div className="text-sm font-semibold mb-1">💻 Write Code</div>
                  <div className="text-xs text-gray-400">Sort an array function</div>
                </button>
                <button
                  onClick={() => setInput('Help me debug this error')}
                  className="glass p-4 rounded-xl hover:bg-white/10 transition text-left"
                >
                  <div className="text-sm font-semibold mb-1">🐛 Debug Issues</div>
                  <div className="text-xs text-gray-400">Fix code errors</div>
                </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-vibrant flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-3xl ${
                  message.role === 'user'
                    ? 'bg-primary-cyan/20 border border-primary-cyan/30'
                    : 'glass'
                } rounded-2xl p-4 relative group`}
              >
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
                    title="Copy"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}

                <ReactMarkdown
                  className="prose prose-invert max-w-none"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !mt-2 !mb-2"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-primary-cyan/20 border border-primary-cyan/30 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-vibrant flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="glass rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-cyan animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary-cyan animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary-cyan animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-dark-border">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-6 py-4 bg-white/5 border border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-6 py-4 bg-gradient-vibrant rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
