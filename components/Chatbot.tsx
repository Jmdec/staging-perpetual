'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import Image from 'next/image'

interface Message {
  type: 'bot' | 'user'
  text: string
  quickReplies?: string[]
}

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: 'Hi there! 👋 How can I help you today?',
      quickReplies: ['Admissions', 'Office Hours', 'Contact Info'],
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = async (message?: string) => {
    const text = message || inputMessage
    if (!text.trim() || isLoading) return

    setMessages(prev => [...prev, { type: 'user', text }])
    setInputMessage('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: data.reply ?? 'No response received.',
          quickReplies: ['Admissions', 'Programs', 'Visit Campus'],
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: '⚠️ Unable to connect right now. Please try again later.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  /** ✅ FIX: quick reply handler */
  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-linear-to-r from-orange-600 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open Chatbot"
      >
        {isChatOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5">
            <Image
              src="/pamplona_tres.png"
              alt="Perpetual Village Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain animate-pulse"
              priority
            />
          </div>
        )}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
          1
        </span>
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 h-[80vh] w-[50vh] lg:w-96 lg:h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-linear-to-r from-orange-600 to-orange-500 text-white p-4 flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Image
                src="/pamplona_tres.png"
                alt="Perpetual Village Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Perpetual College Assistant</h3>
              <p className="text-xs text-orange-100">Las Piñas Campus</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-orange-700 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.type === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-orange-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line break-words">
                      {message.text}
                    </p>
                  </div>
                </div>

                {/* Quick Replies */}
                {message.type === 'bot' && message.quickReplies && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 text-xs bg-white border-2 border-orange-500 text-orange-600 rounded-full hover:bg-orange-500 hover:text-white transition"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-sm text-gray-500">Typing…</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 border rounded px-3 py-2 text-sm"
                placeholder="Type your message..."
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className="bg-orange-600 text-white p-2 rounded"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
