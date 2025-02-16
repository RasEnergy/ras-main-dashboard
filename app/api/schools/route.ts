import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const page = Number.parseInt(searchParams.get("page") || "1");
	const limit = Number.parseInt(searchParams.get("limit") || "10");
	const search = searchParams.get("search") || "";

	try {
		const skip = (page - 1) * limit;

		const [schools, totalCount] = await Promise.all([
			prisma.school.findMany({
				where: {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ schoolId: { contains: search, mode: "insensitive" } },
					],
				},
				skip,
				take: limit,
			}),
			prisma.school.count({
				where: {
					OR: [
						{ name: { contains: search, mode: "insensitive" } },
						{ schoolId: { contains: search, mode: "insensitive" } },
					],
				},
			}),
		]);

		return NextResponse.json({
			schools,
			totalPages: Math.ceil(totalCount / limit),
			currentPage: page,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching schools" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const school = await prisma.school.create({
			data: {
				name: body.name,
				businessEmail: body.businessEmail,
				schoolId: body.schoolId,
				location: body.location,
				businessPhone: body.businessPhone,
			},
		});
		return NextResponse.json(school);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error creating school" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const school = await prisma.school.update({
			where: { id: body.id },
			data: {
				name: body.name,
				businessEmail: body.businessEmail,
				schoolId: body.schoolId,
				location: body.location,
				businessPhone: body.businessPhone,
			},
		});
		return NextResponse.json(school);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error updating school" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "Missing school ID" }, { status: 400 });
	}

	try {
		await prisma.school.delete({
			where: { id },
		});
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "Error deleting school" },
			{ status: 500 }
		);
	}
}
