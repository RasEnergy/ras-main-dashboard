import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  try {
    const skip = (page - 1) * limit

    const [items, totalCount] = await Promise.all([
      prisma.item.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { school: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
        include: { school: true },
        skip,
        take: limit,
      }),
      prisma.item.count({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { school: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
      }),
    ])

    return NextResponse.json({
      items,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const item = await prisma.item.create({
      data: {
        name: body.name,
        price: body.price,
        school: { connect: { id: body.schoolId } },
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Error creating item" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const item = await prisma.item.update({
      where: { id: body.id },
      data: {
        name: body.name,
        price: body.price,
        school: { connect: { id: body.schoolId } },
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Error updating item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing item ID" }, { status: 400 })
  }

  try {
    await prisma.item.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 })
  }
}

