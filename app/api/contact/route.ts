import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message }])

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    )
  }
}
