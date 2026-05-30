'use client'

import { Chat, Typewriter } from '@wire-ui/react'
import { useRef, useState } from 'react'

interface Msg {
  id: number
  role: 'user' | 'assistant'
  text: string
  streaming?: boolean
}

const seed: Msg[] = [
  { id: 0, role: 'assistant', text: 'Hey! Ask me anything about Wire UI.' },
  { id: 1, role: 'user', text: 'What makes the Chat component special?' },
  {
    id: 2,
    role: 'assistant',
    text: 'It is headless and streaming-aware: the list is virtualized, messages carry a data-role, and it pins to the bottom as new tokens arrive.',
  },
]

const REPLY =
  'Great question! Wire UI ships zero CSS — you style everything with className and data-* attributes, so it drops into any design system.'

const bubbleCls = (isUser: boolean) =>
  `max-w-[80%] rounded-[16px] border border-black px-3 py-2 text-sm leading-relaxed ${
    isUser ? 'bg-black text-white' : 'bg-white text-black'
  }`

export function ChatPreview() {
  const [messages, setMessages] = useState<Msg[]>(seed)
  const [streaming, setStreaming] = useState(false)
  const nextId = useRef(seed.length)

  const send = (text: string) => {
    const userMsg: Msg = { id: nextId.current++, role: 'user', text }
    const botId = nextId.current++
    setMessages((m) => [...m, userMsg, { id: botId, role: 'assistant', text: REPLY, streaming: true }])
    setStreaming(true)
    const done = REPLY.length * 18 + 200
    setTimeout(() => setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, streaming: false } : msg))), done)
    setTimeout(() => setStreaming(false), done)
  }

  return (
    <div className="flex justify-center p-6">
      <Chat.Root
        isStreaming={streaming}
        onSubmit={send}
        className="flex h-[460px] w-full max-w-lg flex-col overflow-hidden rounded-[20px] border border-black bg-white"
      >
        <Chat.List count={messages.length} estimateItemHeight={88} className="flex-1 px-4 py-3">
          {({ index }) => {
            const msg = messages[index]
            const isUser = msg.role === 'user'
            return (
              <Chat.Message
                role={msg.role}
                streaming={msg.streaming}
                className={`flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={bubbleCls(isUser)}>
                  {msg.streaming ? (
                    <Typewriter.Root text={msg.text} speed={18}>
                      <Typewriter.Text />
                      <Typewriter.Cursor className="ml-0.5 inline-block animate-pulse">▋</Typewriter.Cursor>
                    </Typewriter.Root>
                  ) : (
                    msg.text
                  )}
                </div>
              </Chat.Message>
            )
          }}
        </Chat.List>

        <Chat.Composer className="flex items-end gap-2 border-t border-black p-3">
          <Chat.Input
            aria-label="Message"
            rows={1}
            placeholder="Send a message…"
            className="max-h-32 flex-1 resize-none rounded-[8px] border border-black px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black"
          />
          <Chat.Send className="rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40">
            Send
          </Chat.Send>
        </Chat.Composer>
      </Chat.Root>
    </div>
  )
}
