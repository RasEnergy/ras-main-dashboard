import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const page = Number.parseInt(searchParams.get("page") || "1");
	const limit = Number.parseInt(searchParams.get("limit") || "10");
	const search = searchParams.get("search") || "";
	const studentId = searchParams.get("studentId");

	try {
		if (studentId) {
			// If studentId is provided, return a single student
			const student = await prisma.student.findUnique({
				where: { studentId: studentId },
			});

			if (!student) {
				return NextResponse.json(
					{ error: "Student not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json(student);
		}

		const skip = (page - 1) * limit;

		const whereClause = search
			? {
					OR: [
						{ firstName: { contains: search, mode: "insensitive" } as any },
						{ lastName: { contains: search, mode: "insensitive" } as any },
						{ studentId: { contains: search, mode: "insensitive" } as any },
						{ father_phone: { contains: search, mode: "insensitive" } as any },
						{ mother_phone: { contains: search, mode: "insensitive" } as any },
						{ branch: { contains: search, mode: "insensitive" } as any },
						{ grade: { contains: search, mode: "insensitive" } as any },
					],
			  }
			: {};

		const [students, totalCount] = await Promise.all([
			prisma.student.findMany({
				where: whereClause,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.student.count({ where: whereClause }),
		]);

		return NextResponse.json({
			students,
			totalPages: Math.ceil(totalCount / limit),
			currentPage: page,
			totalCount,
		});
	} catch (error) {
		console.error("Error in students API route:", error);
		return NextResponse.json(
			{ error: "Error fetching students" },
			{ status: 500 }
		);
	}
}
// export async function GET(request: Request) {
// 	const { searchParams } = new URL(request.url);
// 	const page = Number.parseInt(searchParams.get("page") || "1");
// 	const limit = Number.parseInt(searchParams.get("limit") || "10");
// 	const search = searchParams.get("search") || "";
// 	const studentId = searchParams.get("studentId");

// 	try {
// 		if (studentId) {
// 			// If studentId is provided, return a single student
// 			const student = await prisma.student.findUnique({
// 				where: { studentId: studentId },
// 			});

// 			if (!student) {
// 				return NextResponse.json(
// 					{ error: "Student not found" },
// 					{ status: 404 }
// 				);
// 			}

// 			return NextResponse.json(student);
// 		}

// 		const skip = (page - 1) * limit;

// 		const [students, totalCount] = await Promise.all([
// 			prisma.student.findMany({
// 				where: {
// 					OR: [
// 						{ firstName: { contains: search, mode: "insensitive" } },
// 						{ lastName: { contains: search, mode: "insensitive" } },
// 						{ studentId: { contains: search, mode: "insensitive" } },
// 					],
// 				},
// 				skip,
// 				take: limit,
// 				orderBy: { createdAt: "desc" },
// 			}),
// 			prisma.student.count({
// 				where: {
// 					OR: [
// 						{ firstName: { contains: search, mode: "insensitive" } },
// 						{ lastName: { contains: search, mode: "insensitive" } },
// 						{ studentId: { contains: search, mode: "insensitive" } },
// 					],
// 				},
// 			}),
// 		]);

// 		return NextResponse.json({
// 			students,
// 			totalPages: Math.ceil(totalCount / limit),
// 			currentPage: page,
// 		});
// 	} catch (error) {
// 		console.error("Error in students API route:", error);
// 		return NextResponse.json(
// 			{ error: "Error fetching students" },
// 			{ status: 500 }
// 		);
// 	}
// }

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const student = await prisma.student.create({
			data: {
				...body,
				firstName: body.firstName || undefined,
				lastName: body.lastName || undefined,
				gender: body.gender || undefined,
				grade: body.grade || undefined,
				status: body.status || undefined,
			},
		});
		return NextResponse.json(student);
	} catch (error) {
		console.error("Error creating student:", error);
		return NextResponse.json(
			{ error: "Error creating student" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const student = await prisma.student.update({
			where: { id: body.id },
			data: {
				...body,
				firstName: body.firstName || undefined,
				lastName: body.lastName || undefined,
				gender: body.gender || undefined,
				grade: body.grade || undefined,
				status: body.status || undefined,
			},
		});
		return NextResponse.json(student);
	} catch (error) {
		console.error("Error updating student:", error);
		return NextResponse.json(
			{ error: "Error updating student" },
			{ status: 500 }
		);
	}
}

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(request: Request) {
// 	const { searchParams } = new URL(request.url);
// 	const page = Number.parseInt(searchParams.get("page") || "1");
// 	const limit = Number.parseInt(searchParams.get("limit") || "10");
// 	const search = searchParams.get("search") || "";
// 	const studentId = searchParams.get("studentId");

// 	try {
// 		if (studentId) {
// 			// If studentId is provided, return a single student
// 			const student = await prisma.student.findUnique({
// 				where: { studentId: studentId },
// 			});

// 			if (!student) {
// 				return NextResponse.json(
// 					{ error: "Student not found" },
// 					{ status: 404 }
// 				);
// 			}

// 			return NextResponse.json(student);
// 		}

// 		const skip = (page - 1) * limit;

// 		const [students, totalCount] = await Promise.all([
// 			prisma.student.findMany({
// 				where: {
// 					OR: [
// 						{ firstName: { contains: search, mode: "insensitive" } },
// 						{ lastName: { contains: search, mode: "insensitive" } },
// 						{ studentId: { contains: search, mode: "insensitive" } },
// 					],
// 				},
// 				skip,
// 				take: limit,
// 				orderBy: { createdAt: "desc" },
// 			}),
// 			prisma.student.count({
// 				where: {
// 					OR: [
// 						{ firstName: { contains: search, mode: "insensitive" } },
// 						{ lastName: { contains: search, mode: "insensitive" } },
// 						{ studentId: { contains: search, mode: "insensitive" } },
// 					],
// 				},
// 			}),
// 		]);

// 		return NextResponse.json({
// 			students,
// 			totalPages: Math.ceil(totalCount / limit),
// 			currentPage: page,
// 		});
// 	} catch (error) {
// 		console.error("Error in students API route:", error);
// 		return NextResponse.json(
// 			{ error: "Error fetching students" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function POST(request: Request) {
// 	try {
// 		const body = await request.json();
// 		const student = await prisma.student.create({
// 			data: body,
// 		});
// 		return NextResponse.json(student);
// 	} catch (error) {
// 		console.error({
// 			error,
// 		});
// 		return NextResponse.json(
// 			{ error: "Error creating student" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function PUT(request: Request) {
// 	try {
// 		const body = await request.json();
// 		const student = await prisma.student.update({
// 			where: { id: body.id },
// 			data: body,
// 		});
// 		return NextResponse.json(student);
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Error updating student" },
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function DELETE(request: Request) {
// 	const { searchParams } = new URL(request.url);
// 	const id = searchParams.get("id");

// 	if (!id) {
// 		return NextResponse.json({ error: "Missing student ID" }, { status: 400 });
// 	}

// 	try {
// 		await prisma.student.delete({
// 			where: { id },
// 		});
// 		return NextResponse.json({ success: true });
// 	} catch (error) {
// 		return NextResponse.json(
// 			{ error: "Error deleting student" },
// 			{ status: 500 }
// 		);
// 	}
// }
