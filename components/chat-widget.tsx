"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"

const SUGGESTIONS = [
  "What is Selvahini working on?",
  "Tell me about her projects",
  "What's her experience?",
  "How can I contact her?",
]

export function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  // Hidden on the cinematic intro route so it only appears once the site loads.
  if (pathname === "/") return null

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || isBusy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-cosmic-gold/50 bg-gradient-to-br from-cosmic-gold to-cosmic-orange text-cosmic-black shadow-[0_0_24px_rgba(255,180,100,0.45)] transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[75vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-cosmic-gold/30 bg-cosmic-black/95 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            role="dialog"
            aria-label="Portfolio assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-cosmic-gold/20 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cosmic-gold/15 text-cosmic-gold">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-cosmic-white">Portfolio Assistant</p>
                <p className="truncate text-xs text-cosmic-white/50">Ask me about Selvahini</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-cosmic-white/70">
                    {"Hi! I'm Selvahini's AI assistant. Ask me anything about her work, projects, or how to get in touch."}
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => submit(s)}
                        className="rounded-lg border border-cosmic-gold/20 bg-cosmic-black/60 px-3 py-2 text-left text-sm text-cosmic-gold transition-colors hover:border-cosmic-gold/50 hover:bg-cosmic-gold/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-cosmic-gold to-cosmic-orange text-cosmic-black"
                        : "border border-cosmic-gold/20 bg-cosmic-black/70 text-cosmic-white/90"
                    }`}
                  >
                    {message.parts.map((part, i) =>
                      part.type === "text" ? <span key={i}>{part.text}</span> : null,
                    )}
                  </div>
                </div>
              ))}

              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl border border-cosmic-gold/20 bg-cosmic-black/70 px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cosmic-gold [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cosmic-gold [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cosmic-gold" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
              className="border-t border-cosmic-gold/20 p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                      e.preventDefault()
                      submit(input)
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-lg border border-cosmic-gold/30 bg-cosmic-black/60 px-3 py-2.5 text-sm text-cosmic-white placeholder-cosmic-white/30 focus:border-cosmic-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isBusy || !input.trim()}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cosmic-gold to-cosmic-orange text-cosmic-black transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
