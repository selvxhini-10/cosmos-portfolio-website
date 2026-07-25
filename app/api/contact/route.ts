import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  // Initialise inside the handler so missing env vars fail at request time
  // (with a clear 500) rather than at build time (crashing the entire build).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

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