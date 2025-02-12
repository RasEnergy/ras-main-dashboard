import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { signToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Find user
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    // Generate JWT token
    const token = await signToken({ userId: user.id, role: user.role })

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

