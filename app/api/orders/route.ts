import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  try {
    const skip = (page - 1) * limit

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [
            { student: { firstName: { contains: search, mode: "insensitive" } } },
            { student: { lastName: { contains: search, mode: "insensitive" } } },
            { student: { studentId: { contains: search, mode: "insensitive" } } },
            { referenceNumber: { contains: search, mode: "insensitive" } },
          ],
        },
        include: {
          student: true,
          product: { include: { item: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({
        where: {
          OR: [
            { student: { firstName: { contains: search, mode: "insensitive" } } },
            { student: { lastName: { contains: search, mode: "insensitive" } } },
            { student: { studentId: { contains: search, mode: "insensitive" } } },
            { referenceNumber: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    ])

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const order = await prisma.order.create({
      data: {
        student: { connect: { id: body.studentId } },
        product: { connect: { id: body.productId } },
        parentPhone: body.parentPhone,
        referenceNumber: `REF${Date.now()}`,
        transactionNumber: `TRX${Date.now()}`,
        totalPrice: body.totalPrice,
      },
      include: {
        student: true,
        product: { include: { item: true } },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const order = await prisma.order.update({
      where: { id: body.id },
      data: {
        student: { connect: { id: body.studentId } },
        product: { connect: { id: body.productId } },
        parentPhone: body.parentPhone,
        totalPrice: body.totalPrice,
      },
      include: {
        student: true,
        product: { include: { item: true } },
      },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Error updating order" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
  }

  try {
    await prisma.order.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting order" }, { status: 500 })
  }
}

