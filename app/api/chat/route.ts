import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { SYSTEM_PROMPT } from "@/lib/portfolio-knowledge"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    // Vercel AI Gateway model string — no provider package or API key needed.
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}