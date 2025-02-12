import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        item: true,
        student: true,
      },
    })

    console.log({products})
    return NextResponse.json(products)
  } catch (error) {
    console.error({error})
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        item: { connect: { id: body.itemId } },
        student: { connect: { id: body.studentId } },
        quantity: body.quantity,
        totalPrice: body.totalPrice,
        billerReferenceNumber: body.billerReferenceNumber,
      },
      include: {
        item: true,
        student: true,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}