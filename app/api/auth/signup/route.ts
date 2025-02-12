import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { signToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    })

    // Generate JWT token
    const token = await signToken({ userId: user.id, role: user.role })

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

